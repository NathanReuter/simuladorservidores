(function (window) {
	'use strict';

	var Game = require('./game'),
        View = require('./view'),
        _ = require('lodash');

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

	window.game = new Game();
	window.view = new View();

	init();
})(window);