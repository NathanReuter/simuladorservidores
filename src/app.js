(function (window) {
	'use strict';

	var Simulation = require('./simulation'),
        View = require('./view'),
        _ = require('lodash'),
        ProbFunctions = require('./probFunctions');

    var init = function (view) {
        view.init();
        var beginButton = document.getElementById('begin-button');

        beginButton.onclick = function () {

        };
    };

	window.simulation = new Simulation();
	window.view = new View();
	window.prob = new ProbFunctions();

	init(window.view);
})(window);