/*var child = require("child_process");

var exec = child.exec;

var options = {

};

var command = "C:/Program Files/Julia-0.3.7/bin/julia.exe test.jl";
exec(command, function(err, stdout, stderr) {
	if(err) {
		console.log(err)
	}
	console.log(stdout)
});
	*/

var spawn = require("child_process").spawn;
var prc = spawn('julia', ['test.jl']);

prc.stdout.setEncoding("utf8");
console.log("Here")
prc.stdout.on("data", function(data) {
	console.log(data.toString());
});	

prc.on("close", function(code) {
	console.log("Exit code " + code);
})