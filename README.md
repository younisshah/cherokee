# Cherokee

Cherokee is a Quantum Circuit Simulator which is capable of simulating 5-qubit, 5 stage quantum circuits. Although it can simulate an n-qubit, m-stage quantum circuit, the GUI of the program doesn’t support such big quantum circuits yet. The word Cherokee refers to a Native American tribe indigenous to the Southeastern United States. The language spoken by the Cherokee people is itself called Cherokee. It is an Iroquoian language. In addition, Cherokee also known as “Cherokee (Indian Love Song)” is a jazz standard written by Ray Noble published in 1938. Cherokee jazz is also featured in a recent movie, Whiplash, directed by Damien Chazelle in 2014. 

# Components of Cherokee

Cherokee is not a single system but consists of a number of sub-systems which work together in a synchronous manner in order to achieve the overall purpose of simulating the quantum circuits. Cherokee consists of the following systems:
  1.	An HTTP client which sends an HTTP POST request. 
  2.	An HTTP server which receives the sent HTTP request.
  3.	A ØMQ client which extracts this POST data and sends it to the ØMQ Server.
  4.	A ØMQ server which receives the data and passes it to the quantum simulator.   
  5.	A quantum simulator which processes this data and created the transfer matrix and the output state.

# Cherokee & Julia

The quantum simulator sub-system of Cherokee uses Julia to simulate a given quantum circuit. The program takes the description of the quantum circuit (name of the quantum gates) and input state of qubits as inputs parameters. It then coverts the names of the quantum gates to a symbol matrix. Each symbol matrix entry is replaced by its corresponding transfer matrix except for the CNOT which is computed using Cherokee’s CNOT generator algorithm. After that its computes the tensor product of the transfer matrices, computes the output state from the input state and the circuit’s transfer matrix. For example, the symbol matrix of the quantum circuit presented in Figure 1 is written as:

[![Figure 1](https://s5.postimg.org/3v41endhj/test_ckt.png)](https://postimg.org/image/4xe7x6war/)

is written as:

![Matrix](http://bit.ly/2bCpzT9)

The rows of the symbol matrix is equal to the number of input qubits (here 2) and the columns represent the stages of the quantum circuit.

# Cherokee & ØMQ

Cherokee uses ØMQ’s node.js client and ØMQ’s Julia Server to transfer quantum circuit description and input states and the simulated quantum circuits’ and output state’s transfer matrices. Cherokee’s HTTP server wraps the ØMQ’s node.js client and is responsible for communicating with Cherokee’s quantum circuit simulator.

# Cherokee & node.js

Cherokee’s HTTP server is written in node.js which makes it inherently non-blocking. The HTTP client (browser) sends the circuit description and input state vectors using the Cherokee’s GUI (written in HTML5, CSS3 & jQuery). This circuit data is received by Cherokee’s HTTP node.js server, which passes it to the ØMQ node.js client. The ØMQ client in turn sends the circuit data to Cherokee’s ØMQ Julia server (RESP-REQ pattern) which forwards this data to Cherokee’s quantum circuit simulator.

