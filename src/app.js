(function (window) {
	'use strict';

	var Simulation = require('./simulation'),
        View = require('./view'),
        _ = require('lodash'),
        ProbFunctions = require('./probFunctions'),
        config = require('./config');

	var simulationSettings = {};

    var init = function (view, config) {
        view.init(config.viewsIds);
        var beginButton = document.getElementById('begin-button');

        beginButton.onclick = function () {
            simulationSettings = view.getBeginFormData();
            console.log('begin', simulationSettings);
        //    TODO USE Prob
        };
    };

	window.simulation = new Simulation();
	window.view = new View();
	window.prob = new ProbFunctions();

	init(window.view, config);
})(window);