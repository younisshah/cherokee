using ZMQ
include("CherokeeQCSynthesizer.jl")

context = Context()
socket = Socket(context, REP)
ZMQ.bind(socket, "tcp://*:5555")

println("[+] Cherokee ΦMQ Server listening on port 5555")
while true
  print("[+] Waiting for ΦMQ Client...")
  message = split(bytestring(ZMQ.recv(socket)), "&")
  println("Connected.")

  stages = message[1]
  nqubits = int(message[2])
  nstages = int(message[3])
  inputs = message[4]

  print("[+] Simulating...")
  unitaryMatrix = simulate(strip(stages), nqubits, nstages)
  println("DONE")
  print("[+] Mapping inputs...")
  mapped_inputs = map_inputs(inputs)
  println("DONE")
  print("[+] Computing output...")
  if unitaryMatrix != "NA"
     output = unitaryMatrix * mapped_inputs
     println("DONE")
     unitaryMatrix = string(unitaryMatrix)
     unitaryMatrix = contains(unitaryMatrix, "Complex{Float64}") ? SubString(unitaryMatrix, 17) : unitaryMatrix
     output = string(output)
     output = contains(output, "Complex{Float64}") ? SubString(output, 17) : output
     result = string(unitaryMatrix , " | " , output)
  else
    result = "NA"
  end

  print("[+] Sending results...")
  ZMQ.send(socket, result)
  println("...DONE\n")
end

ZMQ.close(socket)
ZMQ.close(context)
