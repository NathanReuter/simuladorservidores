(function (window) {
	'use strict';

	var Simulation = require('./simulation'),
        View = require('./view'),
        _ = require('lodash'),
        ProbFunctions = require('./probFunctions');

    var init = function () {
        var beginButton = document.getElementById('begin-button');

        beginButton.onclick = function () {
            var numberOfPlayers = document.getElementById('nplayer-input').value;
            _(numberOfPlayers)
                .thru(game.init)
                .thru(view.init)
                .value();
        };
    };

	window.simulation = new Simulation();
	window.view = new View();
	window.prob = new ProbFunctions();

	init();
})(window);