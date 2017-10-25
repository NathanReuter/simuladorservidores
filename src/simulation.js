/**
 * Created by nathangodinho on 08/04/17.
 */
(function () {
    "use strict";

    var ProbFunctions = require('./probFunctions'),
        EventList =  require('./eventList'),
        _ = require('lodash');

    var calculateProbTimes = function (settings, probFunction) {
        return function (target) {
            return Number(probFunction[settings[target].probType].apply(this, settings[target].values));
        }

    };
    var getProbTime;

    var createEntity = function (tc) {
        // Select entity type by 50 % chance
        var type = Math.floor(Math.random() * 2 + 1),
            nextArriveTime = getProbTime('tc'.concat(type));

        this.sistemEntitiesCount++;

        var entity =  {
            id: this.sistemEntitiesCount,
            type: type,
            tc: Number(this.time) + Number(tc)
        };

        // Fix after free server cb, to add the new entity to freeServer Event
        this.eventList.addEvent(entity.tc, chooseServerByEntityType, [entity], this);
        this.eventList.addEvent(entity.tc, createEntity, [nextArriveTime], this);
    };
    
    var createServer = function (type, maxQueue, simulation) {
        var Server = function () {
            this.id = type;
            this.queue = [];
            this.isAvailable = true;
            this.maxQueue = maxQueue || Number.MAX_VALUE;
            this.sim = simulation;
        };

        Server.prototype.isFull = function () {
            return this.queue.length > this.maxQueue;
        };

        Server.prototype.tryToUse = function (entity) {
            if (this.isAvailable) {
                this.isAvailable = false;
                entity.server = {
                    id: this.id,
                    ts: getProbTime('ts'.concat(type))
                };

                // Add free server resource event after success
                this.sim.eventList.addEvent((this.sim.time + entity.server.ts), this.freeServer, [entity] ,this);
            } else {

                if (this.queue.length <= this.maxQueue) {
                    entity.status = {
                        waiting: 'Server '.concat(this.id)
                    };

                    this.queue.push(entity);
                }
            }
        };

        Server.prototype.freeServer = function freeServer(entity) {
            this.isAvailable = true;
            entity.status = {
                done: true,
                time: this.sim.time
            };
            this.sim.disposedEntities.push(entity);

            var nextEntity =  this.queue.shift();

            if (nextEntity) {
                this.sim.eventList.addEvent(this.sim.time, this.tryToUse, [nextEntity], this);
            }
        };

        return new Server();
    };

    var setupFirstEntities = function () {
        getProbTime = calculateProbTimes(this.settings, this.probFunctions);
        this.eventList.addEvent(this.time, createEntity, [this.time], this);
    };

    var chooseServerByEntityType = function (entity) {
        var that = this;

        if (that.serverOne.isFull() && that.serverTwo.isFull()) {
            entity.status = {
                disposed: 'Servers Full',
                time: that.time
            };

            return that.disposedEntities.push(entity);
        }

        if (entity.type === 1) {
            if (!that.serverOne.isFull()) {
                that.serverOne.tryToUse(entity);
            } else {
                that.serverTwo.tryToUse(entity);
            }
        } else {
            if (!that.serverTwo.isFull()) {
                that.serverTwo.tryToUse(entity);
            } else {
                that.serverOne.tryToUse(entity);
            }
        }
    };

    var isSimulationEnd = function () {
        return (this.endcondition.maxentities && Number(this.endcondition.maxentities) === this.sistemEntitiesCount) ||
            this.time >= Number(this.endcondition.simtime);
    };

    var isServerFail = function () {
        var failtPercentage = this.serversFailPercentage;

        return Math.random() * 100 >= failtPercentage;
    };

    var eventLoopInit = function (endSimulationCB) {
        // MODIFICAR LISTA DE EVENTOS!! DE A OCORDO COM O ALGORITMO
        var that = this,
            eventLoop = function () {
                _.delay(function () {
                    that.status = 'running';
                    // Get Current entity in event list
                    that.eventList.nextEvent(function (eventObj) {
                        // Set simulation time to the entity arrive time
                        that.time = eventObj.time;

                        if (eventObj.event.name === undefined || eventObj.event.name === '') {
                            debugger;
                        }

                        var returnData = {time: eventObj.time, eventName: eventObj.event.name,
                            returnValue: eventObj.event.apply(eventObj.context, eventObj.params)};

                        console.log('Time: ', returnData.time, '- EventName: ', returnData.eventName);
                    });
                    updateView.apply(that);

                    if (!isSimulationEnd.apply(that)) {
                        eventLoop();
                    } else {
                        that.status = 'finished';
                        endSimulationCB(this);
                    }
                }, that.simSpeed);
            };

        eventLoop();
    };

    var finalLog = function (simulation) {
        console.log('Total de Entidades: ', simulation.sistemEntitiesCount);
        console.log('Total de Entidades Dispensadas: ', simulation.disposedEntities.length);
        console.log('Total de Entidades Dispensadas Completadas: ', simulation.disposedEntities.filter(entity => entity.server).length);
        console.log('Total de tempo de Simulação: ', simulation.time, 'segundos');
        console.log('Entidades na fila servidor 1: ', simulation.serverOne.queue.length);
        console.log('Entidades na fila servidor 2: ', simulation.serverTwo.queue.length);
    };

    var updateView = function () {
        if (typeof this.updateView === 'function') {
            this.updateView(this.getSimulationData());
        }
    };

    var Simulation = function (simulationSettings) {
        this.settings = simulationSettings;
        this.time = 0;
        this.sistemEntitiesCount = 0;
        this.probFunctions = new ProbFunctions();
        this.eventList = new EventList();
        this.endcondition = simulationSettings.endcondition;
        this.serverOne = createServer('1', undefined, this);
        this.serverTwo = createServer('2', undefined, this);
        this.disposedEntities = [];
        this.status = 'stoped';
        this.simSpeed = simulationSettings.simSpeed;
        this.lastestTime = 0;
        this.serversFailPercentage = 50;
    };

    Simulation.prototype.getSimulationData = function () {
        var simulation = this;
        var totalCompletedDisposedEntities = simulation.disposedEntities.filter(entity => entity.server).length;

        return {
            currentSimulationTime: simulation.time,
            simulationStatus: simulation.status,
            totalEntities: simulation.sistemEntitiesCount,
            totalDisposedEntities: simulation.disposedEntities.length,
            totalCompletedDisposedEntities: totalCompletedDisposedEntities,
            entitiesOnServer1: simulation.serverOne.queue.length,
            entitiesOnServer2: simulation.serverTwo.queue.length
        };
    };

    Simulation.prototype.init = function (beforeRun, onFinish) {
        var that = this;
        setupFirstEntities.apply(this);
        beforeRun(this);
        eventLoopInit.apply(this, [function () {
            updateView.apply(that);
        }]);
    };

    module.exports  = Simulation;
})();