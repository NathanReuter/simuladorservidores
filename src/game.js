/**
 * Created by nathangodinho on 08/04/17.
 */
(function () {
    "use strict";

    var config = require('./config'),
        Player = require('./player'),
        _ = require('lodash');

    var createPlayers = function (nOfPlayers) {
        return _.times(nOfPlayers)
            .map(function (id) {
                return new Player(id);
            });
    };

    var checkNumberOfPlayer = function (nOfPlayers) {
        if (nOfPlayers > config.gameSettings.maxPLayers) {
            return config.gameSettings.maxPLayers;
        }

        if (!nOfPlayers || nOfPlayers < config.gameSettings.minPlayers) {
            return config.gameSettings.minPlayers;
        }

        return nOfPlayers;
    };

    var checkWinCondition = function (player) {
        if (!player.totalSticks) {
            window.game.winner = player.id + 1;
            alert('Jogador ' + (player.id + 1)  + ' Venceu!');
        }
    };

    var nextRound = function (players) {
        /* Sum of all sticks in game*/
        var amountOfSticksInGame = function () {
            return _(players)
                .map(function (player) {
                    return player.totalSticks;
                }).reduce(function (sticksSum, nSticks) {
                    return sticksSum += nSticks;
                });
        }();

        /* Sum of all sticks in hand in this round,
        * the players must guess this number */
        var totalInHandSticks = function () {
            return _(players)
                .map(function (player) {
                    return player.inHandSticks;
                }).reduce(function (sticksSum, nSticks) {
                    return sticksSum += nSticks;
                });
        }();

        var isCorrectBet = function (playerBet, totalInHandSticks) {
            return playerBet === totalInHandSticks;
        };

        /* Begin the round with the winning player and for every player
        * colectes its bets, at the end check if anyOf them had win.*/
        var checkPlayersBet = function (players) {
            var playersBets = [];

            var getBetOfThePlayers = function (playersBets) {
                players = _(players)
                    .sortBy('hadWin')
                    .reverse()
                    .forEach(function (player) {
                        var playerbet = player.bet(amountOfSticksInGame, players, playersBets);

                        playersBets.push(playerbet);
                        player.clearWin();
                    });
            },

            checkForWinners = function (playersBets, players) {
                _.forEach(playersBets, function (playerBet, index) {
                    var player = players[index];

                    if (isCorrectBet(playerBet, totalInHandSticks)) {
                        player.decreaseStick();
                        player.setWin();
                        checkWinCondition(player);
                    }

                    player.chooseNewsSticks();
                });
            };

            getBetOfThePlayers(playersBets);
            checkForWinners(playersBets, players);
        };

        checkPlayersBet(players);
    };

    var Game = function () {};

    Game.prototype.init = function (nOfPlayers) {
        var players = createPlayers(checkNumberOfPlayer(nOfPlayers));

        nextRound(players);

        return players;
    };

    Game.prototype.nextRound = nextRound;

    module.exports  = Game;
})();