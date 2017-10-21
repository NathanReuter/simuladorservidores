(function() {
	'use strict';

	var config = {
		name: 'Simulador de Filas',
		viewInitalConfigIds: ['#begin-form-tc1', '#begin-form-tc2', '#begin-form-ts1', '#begin-form-ts2',
			'#begin-form-percentagefail', '#begin-form-timefail'],
		viewStopConditionIds: ['#begin-button-simtime', '#begin-button-maxentities'],
		mimSimTime: 500
	};

	module.exports = config;
})();