//Carrega as configurações armazenas no localStorage
$.waitFor=function(elemento, func, timeout=15000){
	var cont=0;
	var loopWait=setInterval(function(){
		if( $(elemento).size()==1){
			clearInterval(loopWait);
			func();
		}
		cont=+100;
		if (cont>=timeout) clearInterval(loopWait);
	},100);	
	
};





$(document).ready(function(){
    



});
