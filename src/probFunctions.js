(function () {
    'use strict';

    var probFunctions = function () {};
    
    var round = function (num) {
        return Math.round(num * 100) / 100;
    };

    probFunctions.prototype.const = function (constValue) {
        return round(constValue);
    };

    /* Return an expo dist random number
     * @params mean*/
    probFunctions.prototype.expo = function (mean) {
       var u = Math.random();

       if (!u || !mean) {
           return 0;
       }

       return round((-1 / mean) * (Math.log(1 - u)));
    };

    /* Return a normal dist random number
    * @params mean, standard deviation*/
    probFunctions.prototype.normal = function (mean, sd) {
        var u1 = Math.random(),
            u2 = Math.random(),
            z = Math.sqrt(- 2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

        if (!mean || !sd || !z) {
            return z;
        }

        return round(mean + sd * z);
    };

    /* Return a triangular dist random number
     * @params minValue, modal value and Max value*/
    probFunctions.prototype.triangular = function (min, moda, max) {
        var interval = (moda - min) / (max - min),
            u = Math.random(),
            lowerFunction = function () {
                return min + Math.sqrt(u * (moda - min) * (max - moda));
            },
            upperFunction = function () {
                return max - Math.sqrt((1 - u) * (max - moda) * (max - min));
            };

        if (u >= 0 && u < interval) {
            return round(lowerFunction());
        } else if (interval < u  && u <= 1) {
            return round(upperFunction());
        }

        return 0;
    };

    /* Return an uniforme dist random number
     * @params min value and max value*/
    probFunctions.prototype.uniform = function (min, max) {
        // var u = Math.random();
        var u = Math.random();

        return round(min + (u * (max-min)));
    };


    module.exports = probFunctions;
})();