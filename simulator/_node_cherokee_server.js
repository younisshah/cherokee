var express = require("express");
var cherokee = express();
var bodyParser = require("body-parser");
var zmq = require('zmq');

var ROOT = "../ui/";
cherokee.use(express.static(ROOT));
cherokee.use(bodyParser.urlencoded());

function sendTOZMQServer(response, data) {

	console.log("[+] Connecting to Julia ZMQ server…");
	var requester = zmq.socket('req');

	requester.on("message", function(reply) {
	  console.log("<<Recvd>>");
	  response.end(reply.toString());
	  requester.close();
	});

	requester.connect("tcp://localhost:5555");

	requester.send(data);
}


cherokee.post("/simulate", function(request, response) {
			
	var cktData = request.body.stages.trim() + "&" + request.body.nqubits + "&" + request.body.nstages + "&" + request.body.inputs;
	sendTOZMQServer(response, cktData);	
			
});

var server = cherokee.listen(8000, function() {
	var host = server.address().address;
  	var port = server.address().port;

  	console.log('Cherokee listening at http://%s:%s', host, port); 
});	