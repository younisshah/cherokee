/*
*
*  cherokee.js
*	
*  __________ 
* < Cherokee >
*  ---------- 
*       \                    / \  //\
*        \    |\___/|      /   \//  \\
*         \   /0  0  \__  /    //  | \ \    
*            /     /  \/_/    //   |  \  \  
*            @_^_@'/   \/_   //    |   \   \ 
*            //_^_/     \/_ //     |    \    \
*         ( //) |        \///      |     \     \
*       ( / /) _|_ /   )  //       |      \     _\
*     ( // /) '/,_ _ _/  ( ; -.    |    _ _\.-~        .-~~~^-.
*   (( / / )) ,-{        _      `-.|.-~-.           .~         `.
*  (( // / ))  '/\      /                 ~-. _ .-~      .-~^-.  \
*  (( /// ))      `.   {            }                   /      \  \
*   (( / ))     .----~-.\        \-'                 .~         \  `. \^-.
*              ///.----..>        \             _ -~             `.  ^-`  ^-_
*                ///-._ _ _ _ _ _ _}^ - - - - ~                     ~-- ,.-~
*                                                                  /.-~
* 
* Authored by Younis Shah
* on : 27 March 2015
*
* This is the main js file for - Cherokee: A Quantum Circuit Synthesizer & Simulator
* 
* It deals with: 
* 
* 1) Modal rendering. 
* 2) Quantum Circuit construction using HTML5 canvas API.   
* 3) Displaying LaTeX-style Unitary Transformation Matrix of the entire Quantum Circuit using MathJax API.
* 
*/

$(document).ready(function() {

	var n_qubits, n_stages, ctx, ckt_stages;

	$("#next_2").click(function(){
		$('#stepper_step').stepper('next')
		$("#start").modal('hide');
		
		createQuantumCircuitForm();
		$("#secondModal").modal('show');
	});
	
	$("#next_3").click(function() {
		$('#stepper_step').stepper('next')
		$("#secondModal").modal('hide');

		if(typeof(Storage) !== "undefined") {
			sessionStorage.inputString = getInputString();
		}
		else {
			alert("Your browser does not support Web Storage. Please use a different browser.")
			window.close();
		}
		drawCircuit(n_qubits, getCircuitAsString());
		$("#thirdModal").modal('show');
	});

	$("#show_matrix").click(function(){
		//loadMathJax();
		showUnitaryMatrix();
		//$("#unitaryMatrixModal").modal('show');
	});	

	function getInputString() {
		inputVectors = Array();
		for(i = 1; i <= n_qubits; i++) {
			inputVectors.push($("#input_" + i + " :selected").val());
		}
		return inputVectors.toString().split(",").join(" ");
	}
	

	function showUnitaryMatrix() {		
		if(typeof(Storage) !== "undefined") {
			sessionStorage.ckt_stages = ckt_stages;
			sessionStorage.n_qubits = n_qubits;
			sessionStorage.n_stages = n_stages;	
		}
		else {
			alert("Your browser does not support Web Storage. Please use a different browser.");
			window.close();
		}
		window.open("unitary.html");
	}

	function createQuantumCircuitForm() {

		n_qubits = parseInt($("#nqubits").val());
		n_stages = parseInt($("#nstages").val());

		for(i = 1; i <= n_qubits; i++) {
			var newDiv = $(document.createElement('tr'));
			var html = "<td><select id='input_" + i + "' class ='form-control span2'><option value='one'>|1></option><option value='zero'>|0></option></select></td>";
			for(j = 1; j <= n_stages; j++) {
				var sel_id = j.toString() + i.toString();
				if(n_qubits > 1) {
					var cellHtml = "<select id='sel" + sel_id + "' class='form-control'>" +
										"<option value='H'>Hadamard</option>" +
										"<option value='C'>Control</option>" +
										"<option value='N'>NOT</option>" +
										"<option value='X'>Pauli X</option>" +
										"<option value='Y'>Pauli Y</option>" +
										"<option value='Z'>Pauli Z</option>" +
										"<option value='I'>Identity</option></select>";
				}
				else {
					var cellHtml = "<select id='sel" + sel_id + "' class='form-control'>" +
										"<option value='H'>Hadamard</option>" +
										"<option value='X'>Pauli X</option>" +
										"<option value='Y'>Pauli Y</option>" +
										"<option value='Z'>Pauli Z</option>" +
										"<option value='I'>Identity</option></select>";
				}
				html += "<td>" + cellHtml + "</td>";							
			}
			newDiv.html(html);
			newDiv.appendTo('#circuitTable');	
		}
	} 

	function getCircuitAsString() {

		var cktString = Array();		
		for(i = 1 ; i <= n_stages; i++) {			
			var stage_entry = ""			
			for(j = 1; j <= n_qubits; j++ ) {				
				stage_entry += get(i.toString() + j.toString()) + " " 
			}
			stage_entry += ";"
			cktString.push(stage_entry.trim());
		}
		return cktString.join("");
	}

	/*
	* A utlity function
	**/
	function get(id) {
		return $("#sel" + id + " :selected").val();
	}

	/* Call this function and it will do the rest*/
	function drawCircuit(n_qubits, ckt) {
		
		//alert("Try this: " +ckt)
		stages = ckt.slice(0, -1).split(";");
		ckt_stages = stages.toString().split(" ,").join(";"); //alert("Send this " +stages.toString().split(" ,").join(";"))
		var nstages  = stages.length;

		/**
		* Did some calculations here. Check notes!
		*/
		var height = (n_qubits * 50) + 50;
		var width = nstages * 100;
		var lineLength = width + 150;  

		var cktCanvas = $(document.createElement('canvas')).attr({
			'id': 'ckt_canvas',
			'width': width,
			'height' : height,
			'class' : 'pull-center',
			'style' : 'border:0px solid #d3d3d3;'
		});
		cktCanvas.appendTo('#cktCanvasDiv');
		
		var c = document.getElementById("ckt_canvas");
		ctx = c.getContext("2d");
		ctx.beginPath();		
		
		// Draw parallel lines equal to 
		// the number of qubits.
		drawLines(ctx, n_qubits, lineLength);
		drawStages(stages, n_qubits);
	}	

	function drawLines(ctx, nqubits, lineLength) {
		var x = 50, y = 50;
		for(i = 0; i < nqubits; i++) {
			ctx.moveTo(x, y);
			ctx.lineTo(lineLength, y);
			ctx.stroke();		
			y += 50;
		}
	}


	function drawStages(stages, nqubits) {
		var nstages  = stages.length;
		var controlJSON = [], targetJSON = [];

		var x = 60, y = 40, width = 25, height = 25;
		for(i = 0; i < nstages; i++) {
			for(j = 0; j < nqubits; j++) {
				gates = stages[i].split(" ");
				if(gates[j] == "C") {
					control = {};
					control["x"] = x;
					control["y"] = y;
					controlJSON.push(control);
				}
				if(gates[j] == "N") {
					target = {};
					target["x"] = x;
					target["y"] = y;
					targetJSON.push(target);				
				}
				drawImg(gates[j], x, y, width, height)
				y += 50;
			}
			x  += 100;
			y = 40;
		}
		drawCNOTLines(controlJSON, targetJSON);
	}

	function drawCNOTLines(controls, targets) {
		for(i = 0; i < controls.length; i++) {
			ctx.moveTo(controls[i]["x"] + 11, controls[i]["y"] - 2);
			ctx.lineTo(targets[i]["x"] + 11, targets[i]["y"]);
			ctx.stroke();		
		}
	}


	function drawImg(name, x, y, width, height) {
		name = name.trim()
		if(name != "I") {
			var img = new Image();
			img.addEventListener("load", function(){
				ctx.drawImage(img, x, y - 2, width, height);
			}, false);
			img.src = "gates/"+name+".png"
		}
	}
});