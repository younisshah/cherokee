var c = document.getElementById("ckt_canvas");
var ctx = c.getContext("2d");
ctx.beginPath();

var nqubits = 3;
var ckt = "H X H;H I Y;H H I"
stages = ckt.split(";")
//alert(stages[0])
var nstages  = stages.length;

// Draw parallel lines equal to 
// the number of qubits.
drawLines(ctx, nqubits);
drawStages(stages, nqubits);

function drawLines(ctx, nqubits) {
	var x = 50, y = 50;
	for(i = 0; i < nqubits; i++) {
		ctx.moveTo(x, y);
		ctx.lineTo(800, y);
		ctx.stroke();		
		y += 50;
	}
}

function drawStages(stages, nqubits) {
	var nstages  = stages.length;
	var x = 70, y = 40, width = 25, height = 25;
	for(i = 0; i < nstages; i++) {
		for(j = 0; j < nqubits; j++){
			gates = stages[i].split(" ");
			drawImg(gates[j], x, y, width, height)
			y += 50;
		}
		x  += 100;
		y = 40;
	}
}


function drawImg(name, x, y, width, height) {
	if(name != "I") {
		var img = new Image();
			img.addEventListener("load", function(){
			ctx.drawImage(img, x, y, width, height);
		}, false);
		img.src = "gates/"+name+".png"
	}
}