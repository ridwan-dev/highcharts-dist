/**
 * @license Highstock JS v8.2.0 (2020-10-07)
 *
 * Indicator series type for Highstock
 *
 * (c) 2010-2019 Kamil Kulig
 *
 * License: www.highcharts.com/license
 */
'use strict';
(function (factory) {
    if (typeof module === 'object' && module.exports) {
        factory['default'] = factory;
        module.exports = factory;
    } else if (typeof define === 'function' && define.amd) {
        define('highcharts/indicators/regressions', ['highcharts', 'highcharts/modules/stock'], function (Highcharts) {
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
    _registerModule(_modules, 'Stock/Indicators/RegressionIndicators.js', [_modules['Core/Series/Series.js'], _modules['Core/Utilities.js']], function (BaseSeries, U) {
        /**
         *
         *  (c) 2010-2020 Kamil Kulig
         *
         *  License: www.highcharts.com/license
         *
         *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
         *
         * */
        var isArray = U.isArray;
        /**
         * Linear regression series type.
         *
         * @private
         * @class
         * @name Highcharts.seriesTypes.linearregression
         *
         * @augments Highcharts.Series
         */
        BaseSeries.seriesType('linearRegression', 'sma', 
        /**
         * Linear regression indicator. This series requires `linkedTo` option to be
         * set.
         *
         * @sample {highstock} stock/indicators/linear-regression
         *         Linear regression indicator
         *
         * @extends      plotOptions.sma
         * @since        7.0.0
         * @product      highstock
         * @requires     stock/indicators/indicators
         * @requires     stock/indicators/regressions
         * @optionparent plotOptions.linearregression
         */
        {
            params: {
                /**
                 * Unit (in milliseconds) for the x axis distances used to compute
                 * the regression line paramters (slope & intercept) for every
                 * range. In Highstock the x axis values are always represented in
                 * milliseconds which may cause that distances between points are
                 * "big" integer numbers.
                 *
                 * Highstock's linear regression algorithm (least squares method)
                 * will utilize these "big" integers for finding the slope and the
                 * intercept of the regression line for each period. In consequence,
                 * this value may be a very "small" decimal number that's hard to
                 * interpret by a human.
                 *
                 * For instance: `xAxisUnit` equealed to `86400000` ms (1 day)
                 * forces the algorithm to treat `86400000` as `1` while computing
                 * the slope and the intercept. This may enchance the legiblitity of
                 * the indicator's values.
                 *
                 * Default value is the closest distance between two data points.
                 *
                 * @sample {highstock} stock/plotoptions/linear-regression-xaxisunit
                 *         xAxisUnit set to 1 minute
                 *
                 * @example
                 * // In Liniear Regression Slope Indicator series `xAxisUnit` is
                 * // `86400000` (1 day) and period is `3`. There're 3 points in the
                 * // base series:
                 *
                 * data: [
                 *   [Date.UTC(2020, 0, 1), 1],
                 *   [Date.UTC(2020, 0, 2), 3],
                 *   [Date.UTC(2020, 0, 3), 5]
                 * ]
                 *
                 * // This will produce one point in the indicator series that has a
                 * // `y` value of `2` (slope of the regression line). If we change
                 * // the `xAxisUnit` to `1` (ms) the value of the indicator's point
                 * // will be `2.3148148148148148e-8` which is harder to interpert
                 * // for a human.
                 *
                 * @type    {number}
                 * @product highstock
                 */
                xAxisUnit: void 0
            },
            tooltip: {
                valueDecimals: 4
            }
        }, 
        /**
         * @lends Highcharts.Series#
         */
        {
            nameBase: 'Linear Regression Indicator',
            /**
             * Return the slope and intercept of a straight line function.
             * @private
             * @param {Highcharts.LinearRegressionIndicator} this indicator to use
             * @param {Array<number>} xData -  list of all x coordinates in a period
             * @param {Array<number>} yData - list of all y coordinates in a period
             * @return {Highcharts.RegressionLineParametersObject}
             *          object that contains the slope and the intercept
             *          of a straight line function
             */
            getRegressionLineParameters: function (xData, yData) {
                // least squares method
                var yIndex = this.options.params.index,
                    getSingleYValue = function (yValue,
                    yIndex) {
                        return isArray(yValue) ? yValue[yIndex] : yValue;
                }, xSum = xData.reduce(function (accX, val) {
                    return val + accX;
                }, 0), ySum = yData.reduce(function (accY, val) {
                    return getSingleYValue(val, yIndex) + accY;
                }, 0), xMean = xSum / xData.length, yMean = ySum / yData.length, xError, yError, formulaNumerator = 0, formulaDenominator = 0, i, slope;
                for (i = 0; i < xData.length; i++) {
                    xError = xData[i] - xMean;
                    yError = getSingleYValue(yData[i], yIndex) - yMean;
                    formulaNumerator += xError * yError;
                    formulaDenominator += Math.pow(xError, 2);
                }
                slope = formulaDenominator ?
                    formulaNumerator / formulaDenominator : 0; // don't divide by 0
                return {
                    slope: slope,
                    intercept: yMean - slope * xMean
                };
            },
            /**
             * Return the y value on a straight line.
             * @private
             * @param {Highcharts.RegressionLineParametersObject} lineParameters
             *          object that contains the slope and the intercept
             *          of a straight line function
             * @param {number} endPointX - x coordinate of the point
             * @return {number} - y value of the point that lies on the line
             */
            getEndPointY: function (lineParameters, endPointX) {
                return lineParameters.slope * endPointX + lineParameters.intercept;
            },
            /**
             * Transform the coordinate system so that x values start at 0 and
             * apply xAxisUnit.
             * @private
             * @param {Array<number>} xData - list of all x coordinates in a period
             * @param {number} xAxisUnit - option (see the API)
             * @return {Array<number>} - array of transformed x data
             */
            transformXData: function (xData, xAxisUnit) {
                var xOffset = xData[0];
                return xData.map(function (xValue) {
                    return (xValue - xOffset) / xAxisUnit;
                });
            },
            /**
             * Find the closest distance between points in the base series.
             * @private
             * @param {Array<number>} xData
                        list of all x coordinates in the base series
             * @return {number} - closest distance between points in the base series
             */
            findClosestDistance: function (xData) {
                var distance,
                    closestDistance,
                    i;
                for (i = 1; i < xData.length - 1; i++) {
                    distance = xData[i] - xData[i - 1];
                    if (distance > 0 &&
                        (typeof closestDistance === 'undefined' ||
                            distance < closestDistance)) {
                        closestDistance = distance;
                    }
                }
                return closestDistance;
            },
            // Required to be implemented - starting point for indicator's logic
            getValues: function (baseSeries, regressionSeriesParams) {
                var xData = baseSeries.xData,
                    yData = baseSeries.yData,
                    period = regressionSeriesParams.period,
                    lineParameters,
                    i,
                    periodStart,
                    periodEnd, 
                    // format required to be returned
                    indicatorData = {
                        xData: [],
                        yData: [],
                        values: []
                    },
                    endPointX,
                    endPointY,
                    periodXData,
                    periodYData,
                    periodTransformedXData,
                    xAxisUnit = this.options.params.xAxisUnit ||
                        this.findClosestDistance(xData);
                // Iteration logic: x value of the last point within the period
                // (end point) is used to represent the y value (regression)
                // of the entire period.
                for (i = period - 1; i <= xData.length - 1; i++) {
                    periodStart = i - period + 1; // adjusted for slice() function
                    periodEnd = i + 1; // (as above)
                    endPointX = xData[i];
                    periodXData = xData.slice(periodStart, periodEnd);
                    periodYData = yData.slice(periodStart, periodEnd);
                    periodTransformedXData = this.transformXData(periodXData, xAxisUnit);
                    lineParameters = this.getRegressionLineParameters(periodTransformedXData, periodYData);
                    endPointY = this.getEndPointY(lineParameters, periodTransformedXData[periodTransformedXData.length - 1]);
                    // @todo this is probably not used anywhere
                    indicatorData.values.push({
                        regressionLineParameters: lineParameters,
                        x: endPointX,
                        y: endPointY
                    });
                    indicatorData.xData.push(endPointX);
                    indicatorData.yData.push(endPointY);
                }
                return indicatorData;
            }
        });
        /**
         * A linear regression series. If the [type](#series.linearregression.type)
         * option is not specified, it is inherited from [chart.type](#chart.type).
         *
         * @extends   series,plotOptions.linearregression
         * @since     7.0.0
         * @product   highstock
         * @excluding dataParser,dataURL
         * @requires  stock/indicators/indicators
         * @requires  stock/indicators/regressions
         * @apioption series.linearregression
         */
        /* ************************************************************************** */
        /**
         * The Linear Regression Slope series type.
         *
         * @private
         * @class
         * @name Highcharts.seriesTypes.linearRegressionSlope
         *
         * @augments Highcharts.Series
         */
        BaseSeries.seriesType('linearRegressionSlope', 'linearRegression', 
        /**
         * Linear regression slope indicator. This series requires `linkedTo`
         * option to be set.
         *
         * @sample {highstock} stock/indicators/linear-regression-slope
         *         Linear regression slope indicator
         *
         * @extends      plotOptions.linearregression
         * @since        7.0.0
         * @product      highstock
         * @requires     stock/indicators/indicators
         * @requires     stock/indicators/regressions
         * @optionparent plotOptions.linearregressionslope
         */
        {}, 
        /**
         * @lends Highcharts.Series#
         */
        {
            nameBase: 'Linear Regression Slope Indicator',
            getEndPointY: function (lineParameters) {
                return lineParameters.slope;
            }
        });
        /**
         * A linear regression slope series. If the
         * [type](#series.linearregressionslope.type) option is not specified, it is
         * inherited from [chart.type](#chart.type).
         *
         * @extends   series,plotOptions.linearregressionslope
         * @since     7.0.0
         * @product   highstock
         * @excluding dataParser,dataURL
         * @requires  stock/indicators/indicators
         * @requires  stock/indicators/regressions
         * @apioption series.linearregressionslope
         */
        /* ************************************************************************** */
        /**
         * The Linear Regression Intercept series type.
         *
         * @private
         * @class
         * @name Highcharts.seriesTypes.linearRegressionIntercept
         *
         * @augments Highcharts.Series
         */
        BaseSeries.seriesType('linearRegressionIntercept', 'linearRegression', 
        /**
         * Linear regression intercept indicator. This series requires `linkedTo`
         * option to be set.
         *
         * @sample {highstock} stock/indicators/linear-regression-intercept
         *         Linear intercept slope indicator
         *
         * @extends      plotOptions.linearregression
         * @since        7.0.0
         * @product      highstock
         * @requires     stock/indicators/indicators
         * @requires     stock/indicators/regressions
         * @optionparent plotOptions.linearregressionintercept
         */
        {}, 
        /**
         * @lends Highcharts.Series#
         */
        {
            nameBase: 'Linear Regression Intercept Indicator',
            getEndPointY: function (lineParameters) {
                return lineParameters.intercept;
            }
        });
        /**
         * A linear regression intercept series. If the
         * [type](#series.linearregressionintercept.type) option is not specified, it is
         * inherited from [chart.type](#chart.type).
         *
         * @extends   series,plotOptions.linearregressionintercept
         * @since     7.0.0
         * @product   highstock
         * @excluding dataParser,dataURL
         * @requires  stock/indicators/indicators
         * @requires  stock/indicators/regressions
         * @apioption series.linearregressionintercept
         */
        /* ************************************************************************** */
        /**
         * The Linear Regression Angle series type.
         *
         * @private
         * @class
         * @name Highcharts.seriesTypes.linearRegressionAngle
         *
         * @augments Highcharts.Series
         */
        BaseSeries.seriesType('linearRegressionAngle', 'linearRegression', 
        /**
         * Linear regression angle indicator. This series requires `linkedTo`
         * option to be set.
         *
         * @sample {highstock} stock/indicators/linear-regression-angle
         *         Linear intercept angle indicator
         *
         * @extends      plotOptions.linearregression
         * @since        7.0.0
         * @product      highstock
         * @requires     stock/indicators/indicators
         * @requires     stock/indicators/regressions
         * @optionparent plotOptions.linearregressionangle
         */
        {
            tooltip: {
                pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                    '{series.name}: <b>{point.y}°</b><br/>'
            }
        }, 
        /**
         * @lends Highcharts.Series#
         */
        {
            nameBase: 'Linear Regression Angle Indicator',
            /**
            * Convert a slope of a line to angle (in degrees) between
            * the line and x axis
            * @private
            * @param {number} slope of the straight line function
            * @return {number} angle in degrees
            */
            slopeToAngle: function (slope) {
                return Math.atan(slope) * (180 / Math.PI); // rad to deg
            },
            getEndPointY: function (lineParameters) {
                return this.slopeToAngle(lineParameters.slope);
            }
        });
        /**
         * A linear regression intercept series. If the
         * [type](#series.linearregressionangle.type) option is not specified, it is
         * inherited from [chart.type](#chart.type).
         *
         * @extends   series,plotOptions.linearregressionangle
         * @since     7.0.0
         * @product   highstock
         * @excluding dataParser,dataURL
         * @requires  stock/indicators/indicators
         * @requires  stock/indicators/regressions
         * @apioption series.linearregressionangle
         */
        ''; // to include the above in the js output

    });
    _registerModule(_modules, 'masters/indicators/regressions.src.js', [], function () {


    });
}));