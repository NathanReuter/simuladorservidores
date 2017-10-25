(function () {
    "use strict";

    var _ = require('lodash');

    var EventList = function () {
        this.list = [];
    };

    EventList.prototype.addEvent = function (time, event, params, context) {
        this.list.push({time: time, event: event, params: params, context: context});
        _.sortBy(this.list, function (event) {
            return event.time;
        });
    };

    EventList.prototype.nextEvent = function (callback) {
        // Just get the head of the list
        _.sortBy(this.list, function (event) {
            return event.time;
        });

        var eventObj = this.list.shift();

        callback(eventObj);
    };

    module.exports = EventList;
})();