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
            simulationSettings.endcondition = view.getEndConditionForm();
            debugger;
            window.simulation = new Simulation(simulationSettings);
            window.simulation.init();
        };
    };

	window.view = new View();

	init(window.view, config);
})(window);