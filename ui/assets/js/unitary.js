jQuery(document).ready(function($) {

	/**
	* 
	* loadMathJax() is from MathJax Documentation, Release 2.4
	* 
	* Davide Cervone, Casey Stark, Robert Miner, Paul Topping, Frédéric
	* September 15, 2014
	*
	* Section - 3.4 "Loading MathJax Dynamically"
	* Page numbers: (104 - 105)
	*
	*/
	function loadMathJax() {
		var head = document.getElementsByTagName("head")[0], script;
		script = document.createElement("script");
		script.type = "text/x-mathjax-config";
		script[(window.opera ? "innerHTML" : "text")] = "MathJax.Hub.Config({\n" +
			"  tex2jax: { inlineMath: [['$','$'], ['\\\\(','\\\\)']] }\n" +
			"});"
		head.appendChild(script);
		script = document.createElement("script");
		script.type = "text/javascript";
		script.src  = "assets/MathJax/MathJax.js?config=TeX-AMS-MML_HTMLorMML";
		head.appendChild(script);
	}

	function removeSpinner(data) {
		$("#unitaryMatrix").html("");
		$("canvas").remove();
		loadMathJax();
		displayCKT(data);
	}

	function displayCKT(data) {
		data = data.split("|")
	
	    if(data == "NA") {
			alert("GATE COMBINATION COMING SOON");
			window.close();
		}
		else {
			var unitaryMatrix = "\\begin{pmatrix}";
			var results = (data[0].trim().replace("[", "")).replace("]", "").split("\n");
			for(i = 0; i < results.length; i++) {
				var rowEntries = results[i].trim().split(" ");
				for(j = 0; j < rowEntries.length; j++) {
					if(!rowEntries[j].match(/\s+/)) {											
						unitaryMatrix =  unitaryMatrix + rowEntries[j] + "&"
					}
				}
				unitaryMatrix = (unitaryMatrix.trim()).slice(0, -1); // chop off the last "&"
				unitaryMatrix = unitaryMatrix + "\\\\";
			}
			unitaryMatrix += "\\end{pmatrix}";
			unitaryMatrixDiv.append(unitaryMatrix);
			unitaryMatrixDiv.appendTo('#unitaryMatrix');
			if(!sessionStorage.reloadPage) {
				location.reload();
				sessionStorage.reloadPage = true;
			}

			displayOutput(data[1], unitaryMatrixDiv);
		}
	} /// end displayCKT

	function displayOutput(output, unitaryMatrixDiv) {
		var outputMatrix = "\\begin{pmatrix}";
		var output = output.trim().replace("[", "").replace("]", "").split(",")
		for(i = 0; i < output.length; i++) {
			outputMatrix += output[i] + "\\\\"
		}
		outputMatrix += "\\end{pmatrix}";

		//var outputMatrixDiv = $(document.createElement('div')); 
		unitaryMatrixDiv.append(outputMatrix);
		unitaryMatrixDiv.appendTo('#unitaryMatrix')
	}

	sessionStorage.reloadPage = false;
	var unitaryMatrixDiv = $(document.createElement('div'));
	var data = { stages  : sessionStorage.ckt_stages, 
				 nqubits : sessionStorage.n_qubits,	
				 nstages : sessionStorage.n_stages,
				 inputs  : sessionStorage.inputString };
	$.ajax({
		url: 'http://localhost:8000/simulate',
		type: 'POST',
		data : data,
		beforeSend : function() {
			$("#unitaryMatrix").load("loading.html");
		},
		success : function(data) {
		     setTimeout(function() {
		     	removeSpinner(data)
		     }, 3000);							
		}	
	});
});