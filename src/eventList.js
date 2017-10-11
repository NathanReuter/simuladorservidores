(function () {
    "use strict";

    var EventList = function () {
        this.list = [];
    };

    EventList.prototype.addEvent = function (event) {
        this.list.push(event);
        this.list.sort(function (entity1, entity2) {
            return entity1.tc < entity2.tc;
        });
    };

    EventList.prototype.nextEvent = function () {
        // Just get the head of the list
        return this.list.shift();
    };

    module.exports = EventList;
})();