/**
 * Created by nathangodinho on 08/04/17.
 */
(function () {
    "use strict";

    var ProbFunctions = require('./probFunctions');


    var calculateArriveTime = function (settings, probFunction) {
        return {
            tc1: probFunction[settings.tc1.probType].apply(this, settings.tc1.values),
            tc2: probFunction[settings.tc2.probType].apply(this, settings.tc2.values)
        };
    };

    var Simulation = function (simulationSettings) {
        this.settings = simulationSettings;
        this.time = 0;
        this.probFunctions = new ProbFunctions();
    };

    Simulation.prototype.init = function () {
        var a = calculateArriveTime(this.settings, this.probFunctions);
        console.log('a', a);
    };

    module.exports  = Simulation;
})();