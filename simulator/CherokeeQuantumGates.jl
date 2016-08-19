using DataStructures
# author: Younis Shah

# Gates: H, CNOT, S, Pauli gates

b₁ = [0, 1]
b₀ = [1, 0]

# Hadamard gate
# H = [1\√2  1\√2]
#     [1\√2 -1\√2]
H = round(1/sqrt(2) * [1 1; 1 -1], 3)

# Pauli X gate
σₓ = [0 1;
      1 0]

# Pauli Y gate
Y = [0 -im;
     im 0]

# Pauli Z gate
Z = [1 0;
     0 -1]

# Phase gate
# S= [1 0]
#    [0 ι]
S = [1 0;
     0 im]

# Controlled NOT gate
CNOT = [1 0 0 0;
        0 1 0 0;
        0 0 0 1;
        0 0 1 0]

# 2x2 Identity matrix
Ι = eye(Int64, 2)

gate_symbol_list = (:X, :Y, :Z, :H, :S)

gate_list = ("I", "H", "X", "Y", "Z", "CNOT", "S")

# |0⟩ = [1]
#       [0]
pure_state_0 = [1, 0]
#|1⟩ = [0]
#      [1]
pure_state_1 = [0, 1]

# Define a new Qubit type
# Rest -TODO
type Qubit
  index::Int64
  ket::Array
end

# Define a QuantumRegister type
# Rest - TODO
type QuantumRegister
  register::Array{Qubit}
end

# Define a new Stage output type
type StageOutput
  index::Int64
  output::Union(Array, SparseMatrixCSC)
end

# Define a new type to store all the Stage outputs
type StageOutputDeque
  stages::Deque{StageOutput}
end

# Define a new Gate type using which gates are represnted as matrices
type Gate
  qubit::Int64
  name::String
  repr::Array
end

# Define a new Gates type: the number of gates and qubits
# Represents total gates per stage
type Gates
  gates::Array{Gate}
  nqubits::Int64
end

