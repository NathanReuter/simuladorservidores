/**
 * Created by nathangodinho on 08/04/17.
 */
(function () {
    "use strict";

    var config = require('./config'),
        _ = require('lodash');

    var getPlayerSticks = function (maxSticks) {
        var chooseTrim = function (cb) {
            if (Math.random() > 0.5) {
                return Math.ceil(cb())
            }

            return Math.floor(cb());
        };

        return chooseTrim(function () {
            return Math.random() * maxSticks;
        });
    };

    var findBestBet = function (players, playersBets, totalInGameSticks) {
        var player = this;
        var parentNode = {
            isParent: true,
            children: []
        };
        var nodesCount = 0;

        var createNode = function (parentNode, lastNodeSticks) {
            var newNode = {
                id: nodesCount,
                parentNode: parentNode,
                children: []
            };

            if(lastNodeSticks < player.inHandSticks){
                newNode.bet = player.inHandSticks;
            } else {
                newNode.bet = lastNodeSticks + 1;
            }

            nodesCount++;

            return newNode;
        };

        var populateVisitedList = function (playerBets) {
            if (!playerBets.length) {
                return [];
            } else if (playerBets.length === 1) {
                return [createNode(parentNode, playerBets[0])]
            }

            var visitedNodes = [];

            _.reduce(playersBets, function (last, current) {
                var parent = createNode(parentNode, last);
                visitedNodes.push(parent);

                return createNode(parent, current);
            });

            return visitedNodes;
        };


        var calculateGuess = function (nodo) {
            var diference = 0;

            _.forEach(visitedNodes, function (visited, index) {
                var diff = players[index + 1].qtdMaxPalitos - nodo.bet;

                if (diff > 0) {
                    diference += diff;
                }
            });

            if (nodo.bet < player.inHandSticks || nodo.bet > totalInGameSticks - diference) {
                return 0;
            }

            var guess = ((((totalInGameSticks - diference) - player.totalSticks) / players.length) / 2 )
                * players.length + player.inHandSticks;

            return guess * 10 - (Math.abs(nodo.bet - guess));

        };

        var visitedNodes = populateVisitedList(playersBets);
        var actualNode = createNode(parentNode, 0);
        var nextNode = createNode(parentNode, actualNode.bet);

        parentNode.children.push(actualNode);
        parentNode.children.push(nextNode);

        var actualNodeGrade = calculateGuess(actualNode);
        var nextNodeGrade = calculateGuess(nextNode);

        while(actualNodeGrade < nextNodeGrade){
            actualNode = nextNode;
            actualNodeGrade = nextNodeGrade;
            nextNode = createNode(parentNode, nextNode.bet);
            parentNode.children.push(nextNode);
            nextNodeGrade = calculateGuess(nextNode);
        }

        return actualNode.bet;
    };

    var Player = function (id) {
        this.id = id;
        this.totalSticks = config.gameSettings.playersMaxSticks;
        this.inHandSticks = getPlayerSticks(this.totalSticks);
        this.hadWin = false;
    };

    Player.prototype.chooseNewsSticks = function () {
        this.inHandSticks = getPlayerSticks(this.totalSticks);
    };

    Player.prototype.decreaseStick = function () {
        this.totalSticks--;
    };

    Player.prototype.setWin = function () {
        this.hadWin = true;
    };

    Player.prototype.clearWin = function () {
        this.hadWin = false;
    };

    Player.prototype.bet = function (totalSticksInGame, players, playersBets) {
        return findBestBet.call(this, players, playersBets, totalSticksInGame);

        // return getPlayerSticks(totalSticksInGame);
    };

    module.exports = Player;
})();