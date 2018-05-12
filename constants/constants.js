module.exports = {
	tipo_mensaje : {
		error : 1,
		no_data : 2,
		exito : 3,
		alerta : 4
	},
	titulo_mensaje : {
		error 			: "Error",
		error_servidor  : "Error interno",
		sesion_expirada : "Sesión expiró",
		no_data 		: "Sin datos",
		datos_invalidos : "Datos invalidos",
		exito 			: "Éxito"
	},
	tipo_usuario : {
		natural : 1,
		juridica : 2
	},
	var_configuracion : {
		PUERTO_NODE: 9999
	},

	bd: {
		nombre: 'tdp',
		usuario: 'root',
		password: 'root'
	}
}