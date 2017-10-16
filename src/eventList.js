(function () {
    "use strict";

    var EventList = function () {
        this.list = [];
    };

    EventList.prototype.addEvent = function (time, event, params, context) {
        this.list.push({time: time, event: event, params: params, context: context});
        this.list.sort(function (event1, event2) {
            return event1.time > event2.time;
        });
    };

    EventList.prototype.nextEvent = function () {
        // Just get the head of the list
        var eventObj = this.list.shift();

        var returnData = {time: eventObj.time, eventName: eventObj.event.name,
            returnValue: eventObj.event.apply(eventObj.context, eventObj.params)};

        console.log('returnData', returnData);
        return returnData;
    };

    module.exports = EventList;
})();