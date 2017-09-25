/**
 * Created by nathangodinho on 08/04/17.
 */

(function () {
    "use strict";

    var _ = require('lodash'),
        config = require('./config');

    var hideBeginForm = function () {
        var beginForm = document.getElementById('begin-form');

        beginForm.style.display = 'none';

        return beginForm;
    };

    var showBeginForm = function () {
        var beginForm = document.getElementById('begin-form');

        beginForm.style.display = 'block';

        return beginForm;
    };

    var hideGameView = function () {
        document.getElementById('game-view')
            .innerHTML = '';
    };

    var showGameView = function () {
        var gameView = document.getElementById('game-view');

        gameView.style.display = 'block';

        return gameView;
    };

    var createPlayersView = function (players, gameView) {
        if (window.game.winner) {
            return endGameView(window.game.winner);
        }

        var winPlayers = [];
        var playerViewTemplate =
                '<div class="col-sm-{{nPlayer}} player-view" id="player-{{id}}" style="background: {{color}}">' +
                    '<h4>Jogador: {{id}}</h4>' +
                    '<h3>Na Mão: {{inHandSticks}}</h3>' +
                    '<h3>Total: {{totalSticks}}</h3>' +
                '</div>';

        var nextRoundButtonTemplate =
            '<div class="row"> ' +
                '<div class="col-sm-12" style="margin-top: 20px;"> '+
                    '<button class="btn btn-primary bt-lg" id="next-round-button">Próxima Rodada</button>' +
                '</div>' +
            '</div>';

        playerViewTemplate = playerViewTemplate
                .replace('{{nPlayer}}', Math.floor(12 / players.length));

        gameView.innerHTML = '<div class="row"></div>';

        _.forEach(players, function (player) {
            if (player.hadWin) {
                winPlayers.push(player.id + 1);
            }

            var playerView = playerViewTemplate
                .replace(/{{id}}/g, player.id + 1)
                .replace('{{inHandSticks}}', player.inHandSticks)
                .replace('{{totalSticks}}', player.totalSticks)
                .replace('{{color}}', config.playersColors[player.id]);

            gameView.firstChild.innerHTML += playerView;
        });

        gameView.firstChild.innerHTML += nextRoundButtonTemplate;

        setTimeout(function () {
            _.forEach(winPlayers, function (id) {
                var el = document.getElementById('player-'.concat(id));

                el.className += ' round-win' ;
            });

        }, 100);

        document.getElementById('next-round-button').onclick = function () {
            window.game.nextRound(players);
            createPlayersView(players, gameView);
        };
    };

    var endGameView = function (winnerId) {
        var gameView = document.getElementById('game-view'),
            nextRoundButton = document.getElementById('next-round-button'),
            starContainer = document.createElement('div'),
            star = document.createElement('img'),
            replayButton = document.createElement('button');

        var setUpStar = function () {
            starContainer.className = 'highlight-star-container';
            star.src = 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Gold_Star.png';
            star.className = 'highlight-star';
            starContainer.appendChild(star);
        };

        var setupReplayButton = function () {
            replayButton.className = 'btn btn-warning btn-lg';
            replayButton.textContent = 'Jogar Novamente';

            replayButton.onclick = function () {
                window.game.winner = undefined;
                hideGameView();
                showBeginForm();
            };
        };

        var addReplayButton = function () {
            nextRoundButton.parentNode.removeChild(nextRoundButton);
            gameView.appendChild(replayButton);
        };

        var highlightWinner = function () {
            document.getElementById('player-'.concat(winnerId))
                .appendChild(starContainer);
        };

        setupReplayButton();
        addReplayButton();
        setUpStar();
        setTimeout(function () {
            highlightWinner();
        });
    };

    var View = function () {
        this.init = function (players) {
            hideBeginForm();
            _()
                .thru(showGameView)
                .thru(_.bind(createPlayersView, null, players))
                .value();
        };

        this.endGameView = endGameView;
    };

    module.exports = View;
})();