/**
 * Created by nathangodinho on 08/04/17.
 */
(function () {
    "use strict";

    var ProbFunctions = require('./probFunctions');


    var calculateNextTimes = function (settings, probFunction) {
        return {
            tc1: probFunction[settings.tc1.probType].apply(this, settings.tc1.values),
            tc2: probFunction[settings.tc2.probType].apply(this, settings.tc2.values),
            ts1: probFunction[settings.ts2.probType].apply(this, settings.ts2.values),
            ts2: probFunction[settings.ts2.probType].apply(this, settings.ts2.values),
            timefail: probFunction[settings.timefail.probType].apply(this, settings.timefail.values),
            percentagefail: settings.ts2.values
        }

    };

    var createEntity = function (tc, ts) {
        this.sistemEntities++;

        return {
            id: this.sistemEntities,
            tc: tc,
            ts: ts
        };
    };

    var setupFirstEntities = function () {
        var initTimes = calculateNextTimes(this.settings, this.probFunctions);
        this.eventList.push(createEntity.apply(this, [initTimes.tc1, initTimes.ts1]));
        this.eventList.push(createEntity.apply(this, [initTimes.tc2, initTimes.ts2]));
        this.eventList.sort(function (entity1, entity2) {
            return entity1.tc < entity2;
        });
    };

    var Simulation = function (simulationSettings) {
        this.settings = simulationSettings;
        this.time = 0;
        this.sistemEntities = 0;
        this.probFunctions = new ProbFunctions();
        this.eventList = [];
    };

    Simulation.prototype.init = function () {
        setupFirstEntities.apply(this);
        console.log('this.eventList', this.eventList);
    };

    module.exports  = Simulation;
})();