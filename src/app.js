(function (window) {
	'use strict';

	var Simulation = require('./simulation'),
        View = require('./view'),
        _ = require('lodash'),
        config = require('./config');

	var simulationSettings = {};

    var init = function (view, config) {
        view.init(config);
        var beginButton = document.getElementById('begin-button');

        beginButton.onclick = function () {
            simulationSettings = view.getBeginFormData();
            if (!simulationSettings.filedValidationFailed) {
                simulationSettings.endcondition = view.getEndConditionForm();
                simulationSettings.endcondition.simtime = simulationSettings.endcondition.simtime || config.mimSimTime;
                simulationSettings.simSpeed = view.getSimulationSpeed();
                view.showSimulationView();
                window.simulation = new Simulation(simulationSettings);
                window.simulation.init(function beforeRun(simulation) {
                    //    SetupCallbacks Events
                    simulation.updateView = function (simulationData) {
                        view.updateView(simulationData);
                    }
                });
            } else {
                view.alert('Preencha Todos os Campos');
            }
        };
    };

	window.view = new View();

	init(window.view, config);
})(window);