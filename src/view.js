/**
 * Created by nathangodinho on 08/04/17.
 */

(function () {
    "use strict";

    var _ = require('lodash'),
        config = require('./config');

    var hideElement = function (selector) {
        var element = document.getElementById(selector);

        element.style.display = 'none';
    };

    var showElement = function (selector) {
        var element = document.getElementById(selector);

        element.style.display = 'block';
    };

    var getBeginFormData = function () {
        var viewsIds = this.viewInitalConfigIds;
        var dataBlock = {};

        _.forEach(viewsIds, function (id) {
            var select = document.querySelectorAll(id.concat(' select'))[0],
                inputs = document.querySelectorAll(id.concat(' .' + select.value  +' input')),
                inputValues = _.map(inputs, function (input) {
                    return input.value;
                }),
                idName = id.split('-').pop();

            dataBlock[idName] = {probType: select.value, values: inputValues};
        });

        return dataBlock;
    };

    var getEndConditionForm = function () {
        var viewsIds = this.viewStopConditionIds;
        var dataBlock = {};
        _.forEach(viewsIds, function (id) {
            var inputValue = document.querySelector(id).value;
            var idName = id.split('-').pop();

            console.log('inputValue', inputValue);

            dataBlock[idName] = inputValue;
        });

        return dataBlock;
    };
    var bindFormListeners = function (viewsIds) {
        _.forEach(viewsIds, function (id) {
            var input = document.querySelectorAll(id.concat(' input'))[0],
                select = document.querySelectorAll(id.concat(' select'))[0],
                hideAllViews = function () {
                    var views = document.querySelectorAll(id.concat(' .form-input'));

                    _.forEach(views, function (view) {
                        if (!_.includes(view.className, 'hide')) {
                            view.className = view.className + ' hide';
                        }
                    });
                };


            select.onchange = function () {
                hideAllViews();
                var selected = document.querySelector(id.concat(' .' + this.value));

                selected.className = _.replace(selected.className, 'hide', '');
            };
        });
    };

    var View = function () {
        this.init = function (config) {
            this.viewInitalConfigIds = config.viewInitalConfigIds;
            this.viewStopConditionIds = config.viewStopConditionIds;
            bindFormListeners(this.viewInitalConfigIds);
        };

        this.getBeginFormData = getBeginFormData;
        this.getEndConditionForm = getEndConditionForm;
    };

    module.exports = View;
})();