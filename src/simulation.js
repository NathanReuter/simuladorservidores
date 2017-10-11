/**
 * Created by nathangodinho on 08/04/17.
 */
(function () {
    "use strict";

    var ProbFunctions = require('./probFunctions'),
        EventList =  require('./eventList');

    var calculateProbTimes = function (settings, probFunction) {
        return function (target) {
            return probFunction[settings[target].probType].apply(this, settings[target].values);
        }

    };
    var getProbTime;

    var createEntity = function () {
        // Select entity type by 50 % chance
        var type = Math.floor(Math.random() * 2 + 1),
            arriveTime = getProbTime('tc'.concat(type));
        this.sistemEntitiesCount++;

        return {
            id: this.sistemEntitiesCount,
            type: type,
            tc: Number(this.time) + Number(arriveTime)
        };
    };

    var setupFirstEntities = function () {
        getProbTime = calculateProbTimes(this.settings, this.probFunctions);
        var firstEntity = createEntity.apply(this);
        this.eventList.addEvent(firstEntity);
    };

    var eventLoopInit = function (endSimulationCB) {
        var that = this;
        var disposedEntites = [];
        while (this.endcondition.sistemEntitiesCount !== this.sistemEntitiesCount) {
            this.eventList.addEvent(createEntity.apply(that));
            var currentEntity = this.eventList.nextEvent();
            this.time = Number(currentEntity.tc);
            //Do something

            disposedEntites.push(currentEntity);
            debugger;
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
    };

    Simulation.prototype.init = function () {
        setupFirstEntities.apply(this);
        eventLoopInit.apply(this, [function (logOutput) {
            console.log(logOutput);
        }]);
        console.log('this.eventList', this.eventList);
    };

    module.exports  = Simulation;
})();