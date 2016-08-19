using Match
using DataStructures
include("CherokeeQuantumGates.jl")

# author: Younis Shah

stage_deque = StageOutputDeque(Deque{StageOutput}())

function map_inputs(input::String)
  mapreduce(state -> rstrip(lstrip(state)) == "zero" ? b₀ : b₁ , kron, split(input, " "))
end

function tensor(ψ::Array{Symbol})
  ψ = detect_gate(ψ)
  accumulator = ψ[1]
  for i = 2:length(ψ)
    accumulator = round_v1(kron(accumulator, ψ[i]))
  end
  accumulator
end

# Convert the string of quantum gates to a Symbol Table/Matrix
function create_symbolic_ckt_matrix(ckt_string::String, nqubits::Int64, stages::Int64)
  symbolic_ckt_mat = Array(Symbol, nqubits, stages)
  ckt = split(ckt_string,";")
  for column = 1:length(ckt)
    rows = split(ckt[column])
    for row = 1:length(rows)
      symbolic_ckt_mat[row, column] = symbol(rows[row])
    end
  end
  symbolic_ckt_mat
end

function detect_gate(gate_symbol::Symbol)
  @match gate_symbol begin
    :H => H
    :I => Ι
    :X => σₓ
    :Y => Y
    :Z => Z
    :S => S
     _ => "NA"
  end
end

@vectorize_1arg Symbol detect_gate

function generate_basis_vectors_v1(n::Int64)
  basis_vecs = [0 : 2^n-1]
  digits_ = Array(String, 2^n)
  for i in basis_vecs
    digits_[i+1] = bin(i,n)
  end
  digits_
end

function gate_CNOT_positions(column::Array{Symbol})
  control_list, target_pos = Int64[], 0
  for i = 1:length(column)
    if column[i] == :C
      push!(control_list, i)
    elseif column[i] == :N
      target_pos = i
    end
  end
  control_list,target_pos
end

function simulate_CNOT(basis_vectors::Array, control, target::Int64, nqubits::Int64)
  vectors = map(vec -> parseint(vec, 2), map(vec -> xor(vec, control, target), basis_vectors))
  CNOT = zeros(Int64, 2^nqubits, 2^nqubits) # as Sparse matrix
  j=1
  for i in vectors
    CNOT[i+1,j] = 1
    j +=1
  end
  CNOT
end

function xor(s::String, control_qubits, target_qubit::Int64)
  digits_ = split(s,"")
  and_of_c_qubits = reduce(&, create_control_qubit_array(digits_, control_qubits)) # "And" the qubits -> Ummr Parry
  digits_[target_qubit] = string(and_of_c_qubits $ int(digits_[target_qubit]))
  join(digits_)
end

function create_control_qubit_array(s::Array, control_qubits)
  c_qubits = Int64[]
  for c in control_qubits
    push!(c_qubits, int(s[c]))
  end
  c_qubits
end

function round_v1(accumulator::Array)
  if length(filter(x -> x != 0, imag(accumulator))) == 0 # means no imaginary part
      accumulator = round(accumulator, 3)
    else
      accumulator = complex(round(real(accumulator),3), round(imag(accumulator),3))
    end
  accumulator
end

# expects a column vector
function router(mat::Array{Symbol}, basis_vecs::Array, nqubits_stages::(Int64,Int64), stage_deque::StageOutputDeque)
  if :C in mat && :N in mat && !(:H in mat || :X in mat || :Y in mat || :Z in mat || :S in mat) # only CNOT
    control, target = gate_CNOT_positions(mat)
    stage = StageOutput(nqubits_stages[2], simulate_CNOT(basis_vecs, control, target, nqubits_stages[1]))
    push!(stage_deque.stages, stage)
  elseif !(:C in mat && :N in mat)  # No CNOT
    stage = StageOutput(nqubits_stages[2], tensor(mat))
    push!(stage_deque.stages, stage)
  else
    return "NA"
  end
end

function multiply_stages(stages::StageOutputDeque)
  accumulator = pop!(stages.stages).output;
  for i = 1:length(stages.stages)
    stage = pop!(stage_deque.stages).output
    accumulator = accumulator * stage
  end
 round_v1(accumulator)
end

function simulate(ckt::String, nqubits::Int64, stages::Int64)
  #print_with_color(:blue, "SIMULATING...")
  mat = create_symbolic_ckt_matrix(ckt, nqubits, stages)
  basis_vecs = generate_basis_vectors_v1(nqubits)
  for i = 1:stages
    if router(mat[:,i], basis_vecs, (nqubits,i), stage_deque) == "NA"
      return "NA"
    end
  end
 # print_with_color(:blue, "DONE\n")
  #saved_stages = deepcopy(stage_deque) ############################### for WEB
  multiply_stages(stage_deque) # OUTPUT! Yaaaaayyy!!!!
end

###############################################

#ckt = "H H H Y;Y X I I" # from web
##println(simulate(ckt, nqubits, stages))

################################################
