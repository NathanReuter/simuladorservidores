/**
 * Created by nathangodinho on 08/04/17.
 */
(function () {
    "use strict";

    var ProbFunctions = require('./probFunctions'),
        EventList =  require('./eventList');

    var calculateProbTimes = function (settings, probFunction) {
        return function (target) {
            return Number(probFunction[settings[target].probType].apply(this, settings[target].values));
        }

    };
    var getProbTime;

    var createEntity = function (tc) {
        // Select entity type by 50 % chance
        var type = Math.floor(Math.random() * 2 + 1),
            nextArriveTime = Number(this.time) + getProbTime('tc'.concat(type));
        this.sistemEntitiesCount++;

        var entity =  {
            id: this.sistemEntitiesCount,
            type: type,
            tc: Number(this.time) + Number(tc)
        };

        this.eventList.addEvent(entity.tc, chooseServerByEntityTtype, [entity, console.log, console.log], this);
        this.eventList.addEvent(nextArriveTime, createEntity, [nextArriveTime], this);
    };
    
    var createServer = function (type, maxQueue) {
        var Server = function () {
            this.id = type;
            this.queue = [];
            this.isAvailable = true;
            this.maxQueue = maxQueue || Number.MAX_VALUE;
        };

        Server.prototype.tryToUse = function (entity, success, fail) {
            if (this.isAvailable) {
                this.isAvailable = false;
                entity.server = {
                    id: this.id,
                    ts: getProbTime('ts'.concat(type))
                };

                success(entity)
            } else {
                if (this.queue.length <= this.maxQueue) {
                    this.queue.push(entity);
                    fail({state: 'waiting', msg: 'Unavailable Resource'});
                } else {
                    fail({state: 'disposed', msg: 'Max Queue Reached'});
                }
            }
        };

        Server.prototype.freeServer = function () {
            this.isAvailable = true;

            return this.queue.shift()
        };

        return new Server();
    };

    var setupFirstEntities = function () {
        getProbTime = calculateProbTimes(this.settings, this.probFunctions);
        this.eventList.addEvent(this.time, createEntity, [this.time], this);
        // var firstEntity = createEntity.apply(this);
        // this.eventList.addEvent(firstEntity);
    };

    var chooseServerByEntityTtype = function (entity, successCB, errorCB) {
        var that = this;

        if (entity.type === 1) {
            that.serverOne.tryToUse(entity, successCB, function (error) {
                if (error.state === 'waiting') {
                    that.serverTwo.tryToUse(entity, successCB, errorCB)
                }
            });
        } else {
            that.serverTwo.tryToUse(entity, successCB, function (error) {
                if (error.state === 'waiting') {
                    that.serverOne.tryToUse(entity, successCB, errorCB)
                }
            });
        }
    };
    var eventLoopInit = function (endSimulationCB) {
        var that = this;
        var disposedEntites = [];
        // MODIFICAR LISTA DE EVENTOS!! DE A OCORDO COM O ALGORITMO
        while (this.endcondition.sistemEntitiesCount !== this.sistemEntitiesCount) {
            debugger;
            // Get Current entity in event list
            var currentEnvent = this.eventList.nextEvent();
            // Set simulation time to the entity arrive time
            this.time = Number(currentEnvent.time);
        }

        endSimulationCB(disposedEntites);
    };

    var Simulation = function (simulationSettings) {
        this.settings = simulationSettings;
        this.time = 0;
        this.sistemEntitiesCount = 0;
        this.probFunctions = new ProbFunctions();
        this.eventList = new EventList();
        this.endcondition = simulationSettings.endcondition;
        this.serverOne = createServer('1');
        this.serverTwo = createServer('2');
    };

    Simulation.prototype.init = function () {
        setupFirstEntities.apply(this);
        eventLoopInit.apply(this, [function (logOutput) {
            // console.log('Logoutput:', logOutput);
        }]);
    };

    module.exports  = Simulation;
})();