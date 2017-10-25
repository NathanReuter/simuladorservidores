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

    var getSimulationSpeed = function () {
        var radioInput = document.querySelector('input[name="sim-speed-radio"]:checked');

        return (radioInput && radioInput.value) || 0
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

    var showSimulationView = function () {
        hideElement(this.initalFormId);
        showElement(this.simViewId);
    };

    var hideSimulation = function () {
        hideElement(this.simViewId);
        showElement(this.initalFormId);
    };

    var registerControlButtons = function (view) {
        var controlArea = document.getElementById('controls');

        controlArea.querySelector('[data-info=back-button]').onclick = function () {
            hideSimulation.apply(view);
        };
    };

    var updateView = function (modelData) {
        console.log('modelData', modelData);
        var statisticsId = '#statistics',
            sections = ['.basic-info'],
            statusLabel = '#sim-status',
            statusColor = {
                running: 'green-text',
                finished: 'red-text',
                stoped: 'yellow-text'
            },
            setStatusText = function () {
                document.querySelector(statusLabel.concat(' span')).className = statusColor[modelData.simulationStatus];
                document.querySelector(statusLabel.concat(' span')).innerText = modelData.simulationStatus.toUpperCase();
            };

        setStatusText();
        _.forEach(sections, function (section) {
            _.forIn(modelData, function (value, key) {
                var referenceData = key.replace(/([A-Z])/g, "-$1").toLowerCase();
                var element = document.querySelector(statisticsId.concat(' ' + section).concat(' [data-info=' + referenceData) + ']');

                if (element) {
                    element.querySelector('span').innerText = value;
                }
            });


        });
    };

    var View = function () {
        this.init = function (config) {
            this.viewInitalConfigIds = config.viewInitalConfigIds;
            this.viewStopConditionIds = config.viewStopConditionIds;
            this.initalFormId = 'begin-form';
            this.simViewId = 'sim-view';
            bindFormListeners(this.viewInitalConfigIds);
            hideElement(this.simViewId);
            registerControlButtons(this);
        };

        this.getBeginFormData = getBeginFormData;
        this.getEndConditionForm = getEndConditionForm;
        this.showSimulationView = showSimulationView;
        this.updateView = updateView;
        this.getSimulationSpeed = getSimulationSpeed;
    };

    module.exports = View;
})();