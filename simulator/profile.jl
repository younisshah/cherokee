using Benchmark

function krons()
  for i=1:3000
    kron(eye(5), eye(5))
  end
end

function muls()
  for i=1:3000
    eye(5) * eye(5)
  end
end

walltimes = Array(Float64, 10)
for i=1:10
  d = benchmark(krons, "Kronecker Products of two 5x5 eyes", 1)
  walltimes[i] = float(d[4])[1]
end
output = "E:\\Cherokee\\simulator\\kron_output.txt"
f = open(output, "w")
print(f, walltimes)
close(f)
println("DONE")
