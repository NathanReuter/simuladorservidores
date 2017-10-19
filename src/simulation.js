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
            nextArriveTime = Number(this.time) + getProbTime('tc'.concat(type)),
            that = this;
        this.sistemEntitiesCount++;

        var entity =  {
            id: this.sistemEntitiesCount,
            type: type,
            tc: Number(this.time) + Number(tc)
        };

        // Fix after free server cb, to add the new entity to freeServer Event
        this.eventList.addEvent(entity.tc, chooseServerByEntityType, [entity], this);
        this.eventList.addEvent(nextArriveTime, createEntity, [nextArriveTime], this);
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
                this.sim.eventList.addEvent(nextEntity.tc, this.tryToUse, [nextEntity], this);
            }
        };

        return new Server();
    };

    var setupFirstEntities = function () {
        getProbTime = calculateProbTimes(this.settings, this.probFunctions);
        this.eventList.addEvent(this.time, createEntity, [this.time], this);
        // var firstEntity = createEntity.apply(this);
        // this.eventList.addEvent(firstEntity);
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
        return Number(this.endcondition.maxentities) === this.sistemEntitiesCount || this.time >= Number(this.endcondition.simtime);
    };

    var eventLoopInit = function (endSimulationCB) {
        // MODIFICAR LISTA DE EVENTOS!! DE A OCORDO COM O ALGORITMO
        var that = this;

        while (!isSimulationEnd.apply(this)) {
            // Get Current entity in event list
            this.eventList.nextEvent(function (eventObj) {
                // Set simulation time to the entity arrive time
                that.time = eventObj.time;

                var returnData = {time: eventObj.time, eventName: eventObj.event.name,
                    returnValue: eventObj.event.apply(eventObj.context, eventObj.params)};
            });

        }

        endSimulationCB(this);
    };

    var finalLog = function (simulation) {
        console.log('Total de Entidades: ', simulation.sistemEntitiesCount);
        console.log('Total de Entidades Dispensadas: ', simulation.disposedEntities.length);
        console.log('Total de Entidades Dispensadas Completadas: ', simulation.disposedEntities.filter(entity => entity.server).length);
        console.log('Total de tempo de Simulação: ', simulation.time, 'segundos');
        console.log('Entidades na fila servidor 1: ', simulation.serverOne.queue.length);
        console.log('Entidades na fila servidor 2: ', simulation.serverTwo.queue.length);
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
    };

    Simulation.prototype.init = function () {
        setupFirstEntities.apply(this);
        eventLoopInit.apply(this, [function (sim) {
            finalLog(sim);
        }]);
    };

    module.exports  = Simulation;
})();