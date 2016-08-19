# Cherokee
Cherokee is a Quantum Circuit Simulator which is capable of simulating 5-qubit, 5 stage quantum circuits. Although it can simulate an n-qubit, m-stage quantum circuit, the GUI of the program doesn’t support such big quantum circuits yet. The word Cherokee refers to a Native American tribe indigenous to the Southeastern United States. The language spoken by the Cherokee people is itself called Cherokee. It is an Iroquoian language. In addition, Cherokee also known as “Cherokee (Indian Love Song)” is a jazz standard written by Ray Noble published in 1938. Cherokee jazz is also featured in a recent movie, Whiplash, directed by Damien Chazelle in 2014. 

# Components of Cherokee
Cherokee is not a single system but consists of a number of sub-systems which work together in a synchronous manner in order to achieve the overall purpose of simulating the quantum circuits. Cherokee consists of the following systems:
  1.	An HTTP client which sends an HTTP POST request. 
  2.	An HTTP server which receives the sent HTTP request.
  3.	A ØMQ client which extracts this POST data and sends it to the ØMQ Server.
  4.	A ØMQ server which receives the data and passes it to the quantum simulator.   
  5.	A quantum simulator which processes this data and created the transfer matrix and the output state. 
