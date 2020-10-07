/**
 * @license Highstock JS v8.2.0 (2020-10-07)
 *
 * Parabolic SAR Indicator for Highstock
 *
 * (c) 2010-2019 Grzegorz Blachliński
 *
 * License: www.highcharts.com/license
 */
'use strict';
(function (factory) {
    if (typeof module === 'object' && module.exports) {
        factory['default'] = factory;
        module.exports = factory;
    } else if (typeof define === 'function' && define.amd) {
        define('highcharts/indicators/psar', ['highcharts', 'highcharts/modules/stock'], function (Highcharts) {
            factory(Highcharts);
            factory.Highcharts = Highcharts;
            return factory;
        });
    } else {
        factory(typeof Highcharts !== 'undefined' ? Highcharts : undefined);
    }
}(function (Highcharts) {
    var _modules = Highcharts ? Highcharts._modules : {};
    function _registerModule(obj, path, args, fn) {
        if (!obj.hasOwnProperty(path)) {
            obj[path] = fn.apply(null, args);
        }
    }
    _registerModule(_modules, 'Mixins/IndicatorRequired.js', [_modules['Core/Utilities.js']], function (U) {
        /**
         *
         *  (c) 2010-2020 Daniel Studencki
         *
         *  License: www.highcharts.com/license
         *
         *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
         *
         * */
        var error = U.error;
        /* eslint-disable no-invalid-this, valid-jsdoc */
        var requiredIndicatorMixin = {
                /**
                 * Check whether given indicator is loaded,
            else throw error.
                 * @private
                 * @param {Highcharts.Indicator} indicator
                 *        Indicator constructor function.
                 * @param {string} requiredIndicator
                 *        Required indicator type.
                 * @param {string} type
                 *        Type of indicator where function was called (parent).
                 * @param {Highcharts.IndicatorCallbackFunction} callback
                 *        Callback which is triggered if the given indicator is loaded.
                 *        Takes indicator as an argument.
                 * @param {string} errMessage
                 *        Error message that will be logged in console.
                 * @return {boolean}
                 *         Returns false when there is no required indicator loaded.
                 */
                isParentLoaded: function (indicator,
            requiredIndicator,
            type,
            callback,
            errMessage) {
                    if (indicator) {
                        return callback ? callback(indicator) : true;
                }
                error(errMessage || this.generateMessage(type, requiredIndicator));
                return false;
            },
            /**
             * @private
             * @param {string} indicatorType
             *        Indicator type
             * @param {string} required
             *        Required indicator
             * @return {string}
             *         Error message
             */
            generateMessage: function (indicatorType, required) {
                return 'Error: "' + indicatorType +
                    '" indicator type requires "' + required +
                    '" indicator loaded before. Please read docs: ' +
                    'https://api.highcharts.com/highstock/plotOptions.' +
                    indicatorType;
            }
        };

        return requiredIndicatorMixin;
    });
    _registerModule(_modules, 'Stock/Indicators/SMAIndicator.js', [_modules['Core/Series/Series.js'], _modules['Core/Globals.js'], _modules['Mixins/IndicatorRequired.js'], _modules['Core/Utilities.js']], function (BaseSeries, H, requiredIndicator, U) {
        /* *
         *
         *  License: www.highcharts.com/license
         *
         *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
         *
         * */
        var seriesTypes = BaseSeries.seriesTypes;
        var addEvent = U.addEvent,
            error = U.error,
            extend = U.extend,
            isArray = U.isArray,
            pick = U.pick,
            splat = U.splat;
        var Series = H.Series,
            ohlcProto = seriesTypes.ohlc.prototype,
            generateMessage = requiredIndicator.generateMessage;
        /**
         * The parameter allows setting line series type and use OHLC indicators. Data
         * in OHLC format is required.
         *
         * @sample {highstock} stock/indicators/use-ohlc-data
         *         Plot line on Y axis
         *
         * @type      {boolean}
         * @product   highstock
         * @apioption plotOptions.line.useOhlcData
         */
        /* eslint-disable no-invalid-this */
        addEvent(H.Series, 'init', function (eventOptions) {
            var series = this,
                options = eventOptions.options;
            if (options.useOhlcData &&
                options.id !== 'highcharts-navigator-series') {
                extend(series, {
                    pointValKey: ohlcProto.pointValKey,
                    keys: ohlcProto.keys,
                    pointArrayMap: ohlcProto.pointArrayMap,
                    toYData: ohlcProto.toYData
                });
            }
        });
        addEvent(Series, 'afterSetOptions', function (e) {
            var options = e.options,
                dataGrouping = options.dataGrouping;
            if (dataGrouping &&
                options.useOhlcData &&
                options.id !== 'highcharts-navigator-series') {
                dataGrouping.approximation = 'ohlc';
            }
        });
        /* eslint-enable no-invalid-this */
        /**
         * The SMA series type.
         *
         * @private
         * @class
         * @name Highcharts.seriesTypes.sma
         *
         * @augments Highcharts.Series
         */
        BaseSeries.seriesType('sma', 'line', 
        /**
         * Simple moving average indicator (SMA). This series requires `linkedTo`
         * option to be set.
         *
         * @sample stock/indicators/sma
         *         Simple moving average indicator
         *
         * @extends      plotOptions.line
         * @since        6.0.0
         * @excluding    allAreas, colorAxis, dragDrop, joinBy, keys,
         *               navigatorOptions, pointInterval, pointIntervalUnit,
         *               pointPlacement, pointRange, pointStart, showInNavigator,
         *               stacking, useOhlcData
         * @product      highstock
         * @requires     stock/indicators/indicators
         * @optionparent plotOptions.sma
         */
        {
            /**
             * The name of the series as shown in the legend, tooltip etc. If not
             * set, it will be based on a technical indicator type and default
             * params.
             *
             * @type {string}
             */
            name: void 0,
            tooltip: {
                /**
                 * Number of decimals in indicator series.
                 */
                valueDecimals: 4
            },
            /**
             * The main series ID that indicator will be based on. Required for this
             * indicator.
             *
             * @type {string}
             */
            linkedTo: void 0,
            /**
             * Whether to compare indicator to the main series values
             * or indicator values.
             *
             * @sample {highstock} stock/plotoptions/series-comparetomain/
             *         Difference between comparing SMA values to the main series
             *         and its own values.
             *
             * @type {boolean}
             */
            compareToMain: false,
            /**
             * Paramters used in calculation of regression series' points.
             */
            params: {
                /**
                 * The point index which indicator calculations will base. For
                 * example using OHLC data, index=2 means the indicator will be
                 * calculated using Low values.
                 */
                index: 0,
                /**
                 * The base period for indicator calculations. This is the number of
                 * data points which are taken into account for the indicator
                 * calculations.
                 */
                period: 14
            }
        }, 
        /**
         * @lends Highcharts.Series.prototype
         */
        {
            processData: function () {
                var series = this,
                    compareToMain = series.options.compareToMain,
                    linkedParent = series.linkedParent;
                Series.prototype.processData.apply(series, arguments);
                if (linkedParent && linkedParent.compareValue && compareToMain) {
                    series.compareValue = linkedParent.compareValue;
                }
                return;
            },
            bindTo: {
                series: true,
                eventName: 'updatedData'
            },
            hasDerivedData: true,
            useCommonDataGrouping: true,
            nameComponents: ['period'],
            nameSuffixes: [],
            calculateOn: 'init',
            // Defines on which other indicators is this indicator based on.
            requiredIndicators: [],
            requireIndicators: function () {
                var obj = {
                        allLoaded: true
                    };
                // Check whether all required indicators are loaded, else return
                // the object with missing indicator's name.
                this.requiredIndicators.forEach(function (indicator) {
                    if (seriesTypes[indicator]) {
                        seriesTypes[indicator].prototype.requireIndicators();
                    }
                    else {
                        obj.allLoaded = false;
                        obj.needed = indicator;
                    }
                });
                return obj;
            },
            init: function (chart, options) {
                var indicator = this,
                    requiredIndicators = indicator.requireIndicators();
                // Check whether all required indicators are loaded.
                if (!requiredIndicators.allLoaded) {
                    return error(generateMessage(indicator.type, requiredIndicators.needed));
                }
                Series.prototype.init.call(indicator, chart, options);
                // Make sure we find series which is a base for an indicator
                chart.linkSeries();
                indicator.dataEventsToUnbind = [];
                /**
                 * @private
                 * @return {void}
                 */
                function recalculateValues() {
                    var oldData = indicator.points || [],
                        oldDataLength = (indicator.xData || []).length,
                        processedData = indicator.getValues(indicator.linkedParent,
                        indicator.options.params) || {
                            values: [],
                            xData: [],
                            yData: []
                        },
                        croppedDataValues = [],
                        overwriteData = true,
                        oldFirstPointIndex,
                        oldLastPointIndex,
                        croppedData,
                        min,
                        max,
                        i;
                    // We need to update points to reflect changes in all,
                    // x and y's, values. However, do it only for non-grouped
                    // data - grouping does it for us (#8572)
                    if (oldDataLength &&
                        !indicator.hasGroupedData &&
                        indicator.visible &&
                        indicator.points) {
                        // When data is cropped update only avaliable points (#9493)
                        if (indicator.cropped) {
                            if (indicator.xAxis) {
                                min = indicator.xAxis.min;
                                max = indicator.xAxis.max;
                            }
                            croppedData = indicator.cropData(processedData.xData, processedData.yData, min, max);
                            for (i = 0; i < croppedData.xData.length; i++) {
                                // (#10774)
                                croppedDataValues.push([
                                    croppedData.xData[i]
                                ].concat(splat(croppedData.yData[i])));
                            }
                            oldFirstPointIndex = processedData.xData.indexOf(indicator.xData[0]);
                            oldLastPointIndex = processedData.xData.indexOf(indicator.xData[indicator.xData.length - 1]);
                            // Check if indicator points should be shifted (#8572)
                            if (oldFirstPointIndex === -1 &&
                                oldLastPointIndex === processedData.xData.length - 2) {
                                if (croppedDataValues[0][0] === oldData[0].x) {
                                    croppedDataValues.shift();
                                }
                            }
                            indicator.updateData(croppedDataValues);
                            // Omit addPoint() and removePoint() cases
                        }
                        else if (processedData.xData.length !== oldDataLength - 1 &&
                            processedData.xData.length !== oldDataLength + 1) {
                            overwriteData = false;
                            indicator.updateData(processedData.values);
                        }
                    }
                    if (overwriteData) {
                        indicator.xData = processedData.xData;
                        indicator.yData = processedData.yData;
                        indicator.options.data = processedData.values;
                    }
                    // Removal of processedXData property is required because on
                    // first translate processedXData array is empty
                    if (indicator.bindTo.series === false) {
                        delete indicator.processedXData;
                        indicator.isDirty = true;
                        indicator.redraw();
                    }
                    indicator.isDirtyData = false;
                }
                if (!indicator.linkedParent) {
                    return error('Series ' +
                        indicator.options.linkedTo +
                        ' not found! Check `linkedTo`.', false, chart);
                }
                indicator.dataEventsToUnbind.push(addEvent(indicator.bindTo.series ?
                    indicator.linkedParent :
                    indicator.linkedParent.xAxis, indicator.bindTo.eventName, recalculateValues));
                if (indicator.calculateOn === 'init') {
                    recalculateValues();
                }
                else {
                    var unbinder = addEvent(indicator.chart,
                        indicator.calculateOn,
                        function () {
                            recalculateValues();
                        // Call this just once, on init
                        unbinder();
                    });
                }
                return indicator;
            },
            getName: function () {
                var name = this.name,
                    params = [];
                if (!name) {
                    (this.nameComponents || []).forEach(function (component, index) {
                        params.push(this.options.params[component] +
                            pick(this.nameSuffixes[index], ''));
                    }, this);
                    name = (this.nameBase || this.type.toUpperCase()) +
                        (this.nameComponents ? ' (' + params.join(', ') + ')' : '');
                }
                return name;
            },
            getValues: function (series, params) {
                var period = params.period,
                    xVal = series.xData,
                    yVal = series.yData,
                    yValLen = yVal.length,
                    range = 0,
                    sum = 0,
                    SMA = [],
                    xData = [],
                    yData = [],
                    index = -1,
                    i,
                    SMAPoint;
                if (xVal.length < period) {
                    return;
                }
                // Switch index for OHLC / Candlestick / Arearange
                if (isArray(yVal[0])) {
                    index = params.index ? params.index : 0;
                }
                // Accumulate first N-points
                while (range < period - 1) {
                    sum += index < 0 ? yVal[range] : yVal[range][index];
                    range++;
                }
                // Calculate value one-by-one for each period in visible data
                for (i = range; i < yValLen; i++) {
                    sum += index < 0 ? yVal[i] : yVal[i][index];
                    SMAPoint = [xVal[i], sum / period];
                    SMA.push(SMAPoint);
                    xData.push(SMAPoint[0]);
                    yData.push(SMAPoint[1]);
                    sum -= (index < 0 ?
                        yVal[i - range] :
                        yVal[i - range][index]);
                }
                return {
                    values: SMA,
                    xData: xData,
                    yData: yData
                };
            },
            destroy: function () {
                this.dataEventsToUnbind.forEach(function (unbinder) {
                    unbinder();
                });
                Series.prototype.destroy.apply(this, arguments);
            }
        });
        /**
         * A `SMA` series. If the [type](#series.sma.type) option is not specified, it
         * is inherited from [chart.type](#chart.type).
         *
         * @extends   series,plotOptions.sma
         * @since     6.0.0
         * @product   highstock
         * @excluding dataParser, dataURL, useOhlcData
         * @requires  stock/indicators/indicators
         * @apioption series.sma
         */
        ''; // adds doclet above to the transpiled file

    });
    _registerModule(_modules, 'Stock/Indicators/PSARIndicator.js', [_modules['Core/Series/Series.js']], function (BaseSeries) {
        /* *
         *
         *  Parabolic SAR indicator for Highstock
         *
         *  (c) 2010-2020 Grzegorz Blachliński
         *
         *  License: www.highcharts.com/license
         *
         *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
         *
         * */
        /* eslint-disable require-jsdoc */
        // Utils:
        function toFixed(a, n) {
            return parseFloat(a.toFixed(n));
        }
        function calculateDirection(previousDirection, low, high, PSAR) {
            if ((previousDirection === 1 && low > PSAR) ||
                (previousDirection === -1 && high > PSAR)) {
                return 1;
            }
            return -1;
        }
        /* *
         * Method for calculating acceleration factor
         * dir - direction
         * pDir - previous Direction
         * eP - extreme point
         * pEP - previous extreme point
         * inc - increment for acceleration factor
         * maxAcc - maximum acceleration factor
         * initAcc - initial acceleration factor
         */
        function getAccelerationFactor(dir, pDir, eP, pEP, pAcc, inc, maxAcc, initAcc) {
            if (dir === pDir) {
                if (dir === 1 && (eP > pEP)) {
                    return (pAcc === maxAcc) ? maxAcc : toFixed(pAcc + inc, 2);
                }
                if (dir === -1 && (eP < pEP)) {
                    return (pAcc === maxAcc) ? maxAcc : toFixed(pAcc + inc, 2);
                }
                return pAcc;
            }
            return initAcc;
        }
        function getExtremePoint(high, low, previousDirection, previousExtremePoint) {
            if (previousDirection === 1) {
                return (high > previousExtremePoint) ? high : previousExtremePoint;
            }
            return (low < previousExtremePoint) ? low : previousExtremePoint;
        }
        function getEPMinusPSAR(EP, PSAR) {
            return EP - PSAR;
        }
        function getAccelerationFactorMultiply(accelerationFactor, EPMinusSAR) {
            return accelerationFactor * EPMinusSAR;
        }
        /* *
         * Method for calculating PSAR
         * pdir - previous direction
         * sDir - second previous Direction
         * PSAR - previous PSAR
         * pACCMultiply - previous acceleration factor multiply
         * sLow - second previous low
         * pLow - previous low
         * sHigh - second previous high
         * pHigh - previous high
         * pEP - previous extreme point
         */
        function getPSAR(pdir, sDir, PSAR, pACCMulti, sLow, pLow, pHigh, sHigh, pEP) {
            if (pdir === sDir) {
                if (pdir === 1) {
                    return (PSAR + pACCMulti < Math.min(sLow, pLow)) ?
                        PSAR + pACCMulti :
                        Math.min(sLow, pLow);
                }
                return (PSAR + pACCMulti > Math.max(sHigh, pHigh)) ?
                    PSAR + pACCMulti :
                    Math.max(sHigh, pHigh);
            }
            return pEP;
        }
        /* eslint-enable require-jsdoc */
        /**
         * The Parabolic SAR series type.
         *
         * @private
         * @class
         * @name Highcharts.seriesTypes.psar
         *
         * @augments Highcharts.Series
         */
        BaseSeries.seriesType('psar', 'sma', 
        /**
         * Parabolic SAR. This series requires `linkedTo`
         * option to be set and should be loaded
         * after `stock/indicators/indicators.js` file.
         *
         * @sample stock/indicators/psar
         *         Parabolic SAR Indicator
         *
         * @extends      plotOptions.sma
         * @since        6.0.0
         * @product      highstock
         * @requires     stock/indicators/indicators
         * @requires     stock/indicators/psar
         * @optionparent plotOptions.psar
         */
        {
            lineWidth: 0,
            marker: {
                enabled: true
            },
            states: {
                hover: {
                    lineWidthPlus: 0
                }
            },
            /**
             * @excluding period
             */
            params: {
                /**
                 * The initial value for acceleration factor.
                 * Acceleration factor is starting with this value
                 * and increases by specified increment each time
                 * the extreme point makes a new high.
                 * AF can reach a maximum of maxAccelerationFactor,
                 * no matter how long the uptrend extends.
                 */
                initialAccelerationFactor: 0.02,
                /**
                 * The Maximum value for acceleration factor.
                 * AF can reach a maximum of maxAccelerationFactor,
                 * no matter how long the uptrend extends.
                 */
                maxAccelerationFactor: 0.2,
                /**
                 * Acceleration factor increases by increment each time
                 * the extreme point makes a new high.
                 *
                 * @since 6.0.0
                 */
                increment: 0.02,
                /**
                 * Index from which PSAR is starting calculation
                 *
                 * @since 6.0.0
                 */
                index: 2,
                /**
                 * Number of maximum decimals that are used in PSAR calculations.
                 *
                 * @since 6.0.0
                 */
                decimals: 4
            }
        }, {
            nameComponents: false,
            getValues: function (series, params) {
                var xVal = series.xData,
                    yVal = series.yData, 
                    // Extreme point is the lowest low for falling and highest high
                    // for rising psar - and we are starting with falling
                    extremePoint = yVal[0][1],
                    accelerationFactor = params.initialAccelerationFactor,
                    maxAccelerationFactor = params.maxAccelerationFactor,
                    increment = params.increment, 
                    // Set initial acc factor (for every new trend!)
                    initialAccelerationFactor = params.initialAccelerationFactor,
                    PSAR = yVal[0][2],
                    decimals = params.decimals,
                    index = params.index,
                    PSARArr = [],
                    xData = [],
                    yData = [],
                    previousDirection = 1,
                    direction,
                    EPMinusPSAR,
                    accelerationFactorMultiply,
                    newDirection,
                    prevLow,
                    prevPrevLow,
                    prevHigh,
                    prevPrevHigh,
                    newExtremePoint,
                    high,
                    low,
                    ind;
                if (index >= yVal.length) {
                    return;
                }
                for (ind = 0; ind < index; ind++) {
                    extremePoint = Math.max(yVal[ind][1], extremePoint);
                    PSAR = Math.min(yVal[ind][2], toFixed(PSAR, decimals));
                }
                direction = (yVal[ind][1] > PSAR) ? 1 : -1;
                EPMinusPSAR = getEPMinusPSAR(extremePoint, PSAR);
                accelerationFactor = params.initialAccelerationFactor;
                accelerationFactorMultiply = getAccelerationFactorMultiply(accelerationFactor, EPMinusPSAR);
                PSARArr.push([xVal[index], PSAR]);
                xData.push(xVal[index]);
                yData.push(toFixed(PSAR, decimals));
                for (ind = index + 1; ind < yVal.length; ind++) {
                    prevLow = yVal[ind - 1][2];
                    prevPrevLow = yVal[ind - 2][2];
                    prevHigh = yVal[ind - 1][1];
                    prevPrevHigh = yVal[ind - 2][1];
                    high = yVal[ind][1];
                    low = yVal[ind][2];
                    // Null points break PSAR
                    if (prevPrevLow !== null &&
                        prevPrevHigh !== null &&
                        prevLow !== null &&
                        prevHigh !== null &&
                        high !== null &&
                        low !== null) {
                        PSAR = getPSAR(direction, previousDirection, PSAR, accelerationFactorMultiply, prevPrevLow, prevLow, prevHigh, prevPrevHigh, extremePoint);
                        newExtremePoint = getExtremePoint(high, low, direction, extremePoint);
                        newDirection = calculateDirection(previousDirection, low, high, PSAR);
                        accelerationFactor = getAccelerationFactor(newDirection, direction, newExtremePoint, extremePoint, accelerationFactor, increment, maxAccelerationFactor, initialAccelerationFactor);
                        EPMinusPSAR = getEPMinusPSAR(newExtremePoint, PSAR);
                        accelerationFactorMultiply = getAccelerationFactorMultiply(accelerationFactor, EPMinusPSAR);
                        PSARArr.push([xVal[ind], toFixed(PSAR, decimals)]);
                        xData.push(xVal[ind]);
                        yData.push(toFixed(PSAR, decimals));
                        previousDirection = direction;
                        direction = newDirection;
                        extremePoint = newExtremePoint;
                    }
                }
                return {
                    values: PSARArr,
                    xData: xData,
                    yData: yData
                };
            }
        });
        /**
         * A `PSAR` series. If the [type](#series.psar.type) option is not specified, it
         * is inherited from [chart.type](#chart.type).
         *
         * @extends   series,plotOptions.psar
         * @since     6.0.0
         * @product   highstock
         * @excluding dataParser, dataURL
         * @requires  stock/indicators/indicators
         * @requires  stock/indicators/psar
         * @apioption series.psar
         */
        ''; // to include the above in the js output

    });
    _registerModule(_modules, 'masters/indicators/psar.src.js', [], function () {


    });
}));