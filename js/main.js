$(document).ready(function() {
	const expr = document.getElementById('expr')
	const centro = document.getElementById('centro')
	const grau = document.getElementById('grau')
	const funcao = document.getElementById('funcao')
	// const result = document.getElementById('result')

	let parenthesis = 'keep'
	let implicit = 'hide'
	
	$("#calcular").click(function(){

		if(expr.value == "" || centro.value == "" ||  grau.value == ""){
			expr.value = "cos(x)"
			centro.value = 1
			grau.value = 3
		}

		draw();
		taylor();
	})
	
	function draw() {
		try {
			// compile the expression once
			const express = math.compile(expr.value)
			
			// evaluate the expression repeatedly for different values of x
			const xValues = math.range(-10, 10, 0.5).toArray()
			const yValues = xValues.map(function (x) {
				return express.eval({x: x})
			})
			
			// render the plot using plotly
			const trace1 = {
				x: xValues,
				y: yValues,
				type: 'scatter'
			}
			const data = [trace1]
			Plotly.newPlot('plot', data)
		}
		catch (err) {
			console.error(err)
			alert(err)
		}
	}

	function drawPolinomio(expressao) {
		try {
			// compile the expression once
			const express = math.compile(expressao)
			
			// evaluate the expression repeatedly for different values of x
			const xValues = math.range(-10, 10, 0.5).toArray()
			const yValues = xValues.map(function (x) {
				return express.eval({x: x})
			})
			
			// render the plot using plotly
			const trace1 = {
				x: xValues,
				y: yValues,
				type: 'scatter'
			}
			const data = [trace1]
			Plotly.newPlot('plot_poli', data)
		}
		catch (err) {
			console.error(err)
			alert(err)
		}
	}

	function An(derivada, a, n){
		valor = math.simplify(derivada, {x: a});
		valor = math.eval(`${valor.toString()}/${n}!`)
		return valor.toString()
	}

	function taylor(){
		let node = null
		try {

			termos = []
			derivadas = []
			a = $("#centro").val() != "" ? Number($("#centro").val()) : 0
			grauPolinomio = $("#grau").val() != "" ? Number($("#grau").val()) : 3
			node = math.parse(expr.value != "" ? expr.value : "")

			derivadas.push(node)
			let an = An(derivadas[0], a, 0)
			let termo0 = `${an} * (x - ${a})^0` 
			termo0 = math.simplify(termo0)
			termos.push(termo0)
			
			for (n = 1; n <= grauPolinomio; n++) {
				derivada = math.derivative(derivadas[n - 1], 'x')
				derivadas.push(derivada)
				an = An(derivada, a, n);
				let termo = `${an} * (x - ${a})^${n}`
				termos.push(math.parse(termo));
			}

			mostrarPolinomio(termos);
		} catch (err) {
			console.log(err)
		}
	}
	
	function mostrarPolinomio(termos) {

		try {
			let polinomio = termos.reduce((prev, element) => {
				return `${prev} + (${element.toString()})`;
			})
			console.log(polinomio.toString());

			drawPolinomio(polinomio)
			polinomio = math.simplify(polinomio);

			const lat = polinomio ? polinomio.toTex({
				parenthesis: parenthesis,
				implicit: implicit
			}) : ''
			
			// display and re-render the expression
			const elem = MathJax.Hub.getAllJax('polinomio')[0]
			MathJax.Hub.Queue(['Text', elem, lat])

		} catch (err){
			console.log(err);
		}
	}

	expr.oninput = function () {
		let node = null
		try {
			node = math.parse(expr.value != "" ? expr.value : "")

			const latex = node ? node.toTex({
				parenthesis: parenthesis,
				implicit: impliciasdf
			}) : ''
			
			// display and re-render the expression
			const elem = MathJax.Hub.getAllJax('funcao')[0]
			MathJax.Hub.Queue(['Text', elem, latex])
			
		} catch (err) {}
	}
});