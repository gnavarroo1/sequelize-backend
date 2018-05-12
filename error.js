module.exports = {
	ManejadorErrores : function (contexto, funcion, linea, error, error_detallado){
        var fs = require('fs');
        
        //verifico si error no es nulo
        var mensaje = "";
        var stack = "";
        if(error != null) {
        	mensaje = error.message;
        	stack = error.stack;
        }
        var texto_error = contexto + "\n Funcion: " + funcion + "\n Mensaje Error: " + mensaje + "\n Stack del error: \n" + stack  + "\n Mensaje del programador: " + error_detallado + "\n Ocurrido el: " + fecha_actual
        var fecha_actual = new Date();
        fs.writeFile(
        'console.log', 
        texto_error, 
        {
            flag: 'a' // append
        }, 
        function(){});
        
        console.log(texto_error);

        
    }
}