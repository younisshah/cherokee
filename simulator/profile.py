import numpy as np
import time

def krons():
    for i in range(0,3001):
        np.kron(np.eye(5), np.eye(5))
    return    

def benchmark_krons(n):
    start = time.time()
    i = 0
    while i < n:
        krons()
        i += 1
    end = time.time()
    return (end - start)    
    
    
walltimes = [10]
for i in range(0,10):
    walltimes.append(benchmark_krons(1))

print(walltimes)        
f = open("e:\\Cherokee\\simulator\\kron_python.txt", "w")
f.write(''.join(str(e) for e in walltimes))
f.close()
print("DONE")                                