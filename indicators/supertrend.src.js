/**
 * @license Highstock JS v8.2.0 (2020-10-07)
 *
 * Indicator series type for Highstock
 *
 * (c) 2010-2019 Wojciech Chmiel
 *
 * License: www.highcharts.com/license
 */
'use strict';
(function (factory) {
    if (typeof module === 'object' && module.exports) {
        factory['default'] = factory;
        module.exports = factory;
    } else if (typeof define === 'function' && define.amd) {
        define('highcharts/indicators/supertrend', ['highcharts', 'highcharts/modules/stock'], function (Highcharts) {
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
    _registerModule(_modules, 'Stock/Indicators/ATRIndicator.js', [_modules['Core/Series/Series.js'], _modules['Core/Utilities.js']], function (BaseSeries, U) {
        /* *
         *
         *  License: www.highcharts.com/license
         *
         *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
         *
         * */
        var isArray = U.isArray;
        /* eslint-disable valid-jsdoc */
        // Utils:
        /**
         * @private
         */
        function accumulateAverage(points, xVal, yVal, i) {
            var xValue = xVal[i],
                yValue = yVal[i];
            points.push([xValue, yValue]);
        }
        /**
         * @private
         */
        function getTR(currentPoint, prevPoint) {
            var pointY = currentPoint, prevY = prevPoint, HL = pointY[1] - pointY[2], HCp = typeof prevY === 'undefined' ? 0 : Math.abs(pointY[1] - prevY[3]), LCp = typeof prevY === 'undefined' ? 0 : Math.abs(pointY[2] - prevY[3]), TR = Math.max(HL, HCp, LCp);
            return TR;
        }
        /**
         * @private
         */
        function populateAverage(points, xVal, yVal, i, period, prevATR) {
            var x = xVal[i - 1],
                TR = getTR(yVal[i - 1],
                yVal[i - 2]),
                y;
            y = (((prevATR * (period - 1)) + TR) / period);
            return [x, y];
        }
        /* eslint-enable valid-jsdoc */
        /**
         * The ATR series type.
         *
         * @private
         * @class
         * @name Highcharts.seriesTypes.atr
         *
         * @augments Highcharts.Series
         */
        BaseSeries.seriesType('atr', 'sma', 
        /**
         * Average true range indicator (ATR). This series requires `linkedTo`
         * option to be set.
         *
         * @sample stock/indicators/atr
         *         ATR indicator
         *
         * @extends      plotOptions.sma
         * @since        6.0.0
         * @product      highstock
         * @requires     stock/indicators/indicators
         * @requires     stock/indicators/atr
         * @optionparent plotOptions.atr
         */
        {
            params: {
                period: 14
            }
        }, 
        /**
         * @lends Highcharts.Series#
         */
        {
            getValues: function (series, params) {
                var period = params.period,
                    xVal = series.xData,
                    yVal = series.yData,
                    yValLen = yVal ? yVal.length : 0,
                    xValue = xVal[0],
                    yValue = yVal[0],
                    range = 1,
                    prevATR = 0,
                    TR = 0,
                    ATR = [],
                    xData = [],
                    yData = [],
                    point,
                    i,
                    points;
                points = [[xValue, yValue]];
                if ((xVal.length <= period) ||
                    !isArray(yVal[0]) ||
                    yVal[0].length !== 4) {
                    return;
                }
                for (i = 1; i <= yValLen; i++) {
                    accumulateAverage(points, xVal, yVal, i);
                    if (period < range) {
                        point = populateAverage(points, xVal, yVal, i, period, prevATR);
                        prevATR = point[1];
                        ATR.push(point);
                        xData.push(point[0]);
                        yData.push(point[1]);
                    }
                    else if (period === range) {
                        prevATR = TR / (i - 1);
                        ATR.push([xVal[i - 1], prevATR]);
                        xData.push(xVal[i - 1]);
                        yData.push(prevATR);
                        range++;
                    }
                    else {
                        TR += getTR(yVal[i - 1], yVal[i - 2]);
                        range++;
                    }
                }
                return {
                    values: ATR,
                    xData: xData,
                    yData: yData
                };
            }
        });
        /**
         * A `ATR` series. If the [type](#series.atr.type) option is not specified, it
         * is inherited from [chart.type](#chart.type).
         *
         * @extends   series,plotOptions.atr
         * @since     6.0.0
         * @product   highstock
         * @excluding dataParser, dataURL
         * @requires  stock/indicators/indicators
         * @requires  stock/indicators/atr
         * @apioption series.atr
         */
        ''; // to include the above in the js output

    });
    _registerModule(_modules, 'Stock/Indicators/SupertrendIndicator.js', [_modules['Core/Series/Series.js'], _modules['Core/Utilities.js']], function (BaseSeries, U) {
        /* *
         *
         *  License: www.highcharts.com/license
         *
         *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
         *
         * */
        var seriesTypes = BaseSeries.seriesTypes;
        var correctFloat = U.correctFloat,
            isArray = U.isArray,
            merge = U.merge,
            objectEach = U.objectEach;
        var ATR = seriesTypes.atr,
            SMA = seriesTypes.sma;
        /* eslint-disable require-jsdoc */
        // Utils:
        function createPointObj(mainSeries, index, close) {
            return {
                index: index,
                close: mainSeries.yData[index][close],
                x: mainSeries.xData[index]
            };
        }
        /* eslint-enable require-jsdoc */
        /**
         * The Supertrend series type.
         *
         * @private
         * @class
         * @name Highcharts.seriesTypes.supertrend
         *
         * @augments Highcharts.Series
         */
        BaseSeries.seriesType('supertrend', 'sma', 
        /**
         * Supertrend indicator. This series requires the `linkedTo` option to be
         * set and should be loaded after the `stock/indicators/indicators.js` and
         * `stock/indicators/sma.js`.
         *
         * @sample {highstock} stock/indicators/supertrend
         *         Supertrend indicator
         *
         * @extends      plotOptions.sma
         * @since        7.0.0
         * @product      highstock
         * @excluding    allAreas, cropThreshold, negativeColor, colorAxis, joinBy,
         *               keys, navigatorOptions, pointInterval, pointIntervalUnit,
         *               pointPlacement, pointRange, pointStart, showInNavigator,
         *               stacking, threshold
         * @requires     stock/indicators/indicators
         * @requires     stock/indicators/supertrend
         * @optionparent plotOptions.supertrend
         */
        {
            /**
             * Paramters used in calculation of Supertrend indicator series points.
             *
             * @excluding index
             */
            params: {
                /**
                 * Multiplier for Supertrend Indicator.
                 */
                multiplier: 3,
                /**
                 * The base period for indicator Supertrend Indicator calculations.
                 * This is the number of data points which are taken into account
                 * for the indicator calculations.
                 */
                period: 10
            },
            /**
             * Color of the Supertrend series line that is beneath the main series.
             *
             * @sample {highstock} stock/indicators/supertrend/
             *         Example with risingTrendColor
             *
             * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
             */
            risingTrendColor: '#06B535',
            /**
             * Color of the Supertrend series line that is above the main series.
             *
             * @sample {highstock} stock/indicators/supertrend/
             *         Example with fallingTrendColor
             *
             * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
             */
            fallingTrendColor: '#F21313',
            /**
             * The styles for the Supertrend line that intersect main series.
             *
             * @sample {highstock} stock/indicators/supertrend/
             *         Example with changeTrendLine
             */
            changeTrendLine: {
                styles: {
                    /**
                     * Pixel width of the line.
                     */
                    lineWidth: 1,
                    /**
                     * Color of the line.
                     *
                     * @type {Highcharts.ColorString}
                     */
                    lineColor: '#333333',
                    /**
                     * The dash or dot style of the grid lines. For possible
                     * values, see
                     * [this demonstration](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/series-dashstyle-all/).
                     *
                     * @sample {highcharts} highcharts/yaxis/gridlinedashstyle/
                     *         Long dashes
                     * @sample {highstock} stock/xaxis/gridlinedashstyle/
                     *         Long dashes
                     *
                     * @type  {Highcharts.DashStyleValue}
                     * @since 7.0.0
                     */
                    dashStyle: 'LongDash'
                }
            }
        }, 
        /**
         * @lends Highcharts.Series.prototype
         */
        {
            nameBase: 'Supertrend',
            nameComponents: ['multiplier', 'period'],
            requiredIndicators: ['atr'],
            init: function () {
                var options,
                    parentOptions;
                SMA.prototype.init.apply(this, arguments);
                options = this.options;
                parentOptions = this.linkedParent.options;
                // Indicator cropThreshold has to be equal linked series one
                // reduced by period due to points comparison in drawGraph method
                // (#9787)
                options.cropThreshold = (parentOptions.cropThreshold -
                    (options.params.period - 1));
            },
            drawGraph: function () {
                var indicator = this,
                    indicOptions = indicator.options, 
                    // Series that indicator is linked to
                    mainSeries = indicator.linkedParent,
                    mainLinePoints = (mainSeries ? mainSeries.points : []),
                    indicPoints = indicator.points,
                    indicPath = indicator.graph,
                    indicPointsLen = indicPoints.length, 
                    // Points offset between lines
                    tempOffset = mainLinePoints.length - indicPointsLen,
                    offset = tempOffset > 0 ? tempOffset : 0, 
                    // @todo: fix when ichi-moku indicator is merged to master.
                    gappedExtend = {
                        options: {
                            gapSize: indicOptions.gapSize
                        }
                    }, 
                    // Sorted supertrend points array
                    groupedPoitns = {
                        top: [],
                        bottom: [],
                        intersect: [] // Change trend line points
                    }, 
                    // Options for trend lines
                    supertrendLineOptions = {
                        top: {
                            styles: {
                                lineWidth: indicOptions.lineWidth,
                                lineColor: (indicOptions.fallingTrendColor ||
                                    indicOptions.color),
                                dashStyle: indicOptions.dashStyle
                            }
                        },
                        bottom: {
                            styles: {
                                lineWidth: indicOptions.lineWidth,
                                lineColor: (indicOptions.risingTrendColor ||
                                    indicOptions.color),
                                dashStyle: indicOptions.dashStyle
                            }
                        },
                        intersect: indicOptions.changeTrendLine
                    },
                    close = 3, 
                    // Supertrend line point
                    point, 
                    // Supertrend line next point (has smaller x pos than point)
                    nextPoint, 
                    // Main series points
                    mainPoint,
                    nextMainPoint, 
                    // Used when supertrend and main points are shifted
                    // relative to each other
                    prevMainPoint,
                    prevPrevMainPoint, 
                    // Used when particular point color is set
                    pointColor, 
                    // Temporary points that fill groupedPoitns array
                    newPoint,
                    newNextPoint;
                // Loop which sort supertrend points
                while (indicPointsLen--) {
                    point = indicPoints[indicPointsLen];
                    nextPoint = indicPoints[indicPointsLen - 1];
                    mainPoint = mainLinePoints[indicPointsLen - 1 + offset];
                    nextMainPoint = mainLinePoints[indicPointsLen - 2 + offset];
                    prevMainPoint = mainLinePoints[indicPointsLen + offset];
                    prevPrevMainPoint = mainLinePoints[indicPointsLen + offset + 1];
                    pointColor = point.options.color;
                    newPoint = {
                        x: point.x,
                        plotX: point.plotX,
                        plotY: point.plotY,
                        isNull: false
                    };
                    // When mainPoint is the last one (left plot area edge)
                    // but supertrend has additional one
                    if (!nextMainPoint &&
                        mainPoint && mainSeries.yData[mainPoint.index - 1]) {
                        nextMainPoint = createPointObj(mainSeries, mainPoint.index - 1, close);
                    }
                    // When prevMainPoint is the last one (right plot area edge)
                    // but supertrend has additional one (and points are shifted)
                    if (!prevPrevMainPoint &&
                        prevMainPoint && mainSeries.yData[prevMainPoint.index + 1]) {
                        prevPrevMainPoint = createPointObj(mainSeries, prevMainPoint.index + 1, close);
                    }
                    // When points are shifted (right or left plot area edge)
                    if (!mainPoint &&
                        nextMainPoint && mainSeries.yData[nextMainPoint.index + 1]) {
                        mainPoint = createPointObj(mainSeries, nextMainPoint.index + 1, close);
                    }
                    else if (!mainPoint &&
                        prevMainPoint && mainSeries.yData[prevMainPoint.index - 1]) {
                        mainPoint = createPointObj(mainSeries, prevMainPoint.index - 1, close);
                    }
                    // Check if points are shifted relative to each other
                    if (point &&
                        mainPoint &&
                        prevMainPoint &&
                        nextMainPoint &&
                        point.x !== mainPoint.x) {
                        if (point.x === prevMainPoint.x) {
                            nextMainPoint = mainPoint;
                            mainPoint = prevMainPoint;
                        }
                        else if (point.x === nextMainPoint.x) {
                            mainPoint = nextMainPoint;
                            nextMainPoint = {
                                close: mainSeries.yData[mainPoint.index - 1][close],
                                x: mainSeries.xData[mainPoint.index - 1]
                            };
                        }
                        else if (prevPrevMainPoint && point.x === prevPrevMainPoint.x) {
                            mainPoint = prevPrevMainPoint;
                            nextMainPoint = prevMainPoint;
                        }
                    }
                    if (nextPoint && nextMainPoint && mainPoint) {
                        newNextPoint = {
                            x: nextPoint.x,
                            plotX: nextPoint.plotX,
                            plotY: nextPoint.plotY,
                            isNull: false
                        };
                        if (point.y >= mainPoint.close &&
                            nextPoint.y >= nextMainPoint.close) {
                            point.color = (pointColor || indicOptions.fallingTrendColor ||
                                indicOptions.color);
                            groupedPoitns.top.push(newPoint);
                        }
                        else if (point.y < mainPoint.close &&
                            nextPoint.y < nextMainPoint.close) {
                            point.color = (pointColor || indicOptions.risingTrendColor ||
                                indicOptions.color);
                            groupedPoitns.bottom.push(newPoint);
                        }
                        else {
                            groupedPoitns.intersect.push(newPoint);
                            groupedPoitns.intersect.push(newNextPoint);
                            // Additional null point to make a gap in line
                            groupedPoitns.intersect.push(merge(newNextPoint, {
                                isNull: true
                            }));
                            if (point.y >= mainPoint.close &&
                                nextPoint.y < nextMainPoint.close) {
                                point.color = (pointColor || indicOptions.fallingTrendColor ||
                                    indicOptions.color);
                                nextPoint.color = (pointColor || indicOptions.risingTrendColor ||
                                    indicOptions.color);
                                groupedPoitns.top.push(newPoint);
                                groupedPoitns.top.push(merge(newNextPoint, {
                                    isNull: true
                                }));
                            }
                            else if (point.y < mainPoint.close &&
                                nextPoint.y >= nextMainPoint.close) {
                                point.color = (pointColor || indicOptions.risingTrendColor ||
                                    indicOptions.color);
                                nextPoint.color = (pointColor || indicOptions.fallingTrendColor ||
                                    indicOptions.color);
                                groupedPoitns.bottom.push(newPoint);
                                groupedPoitns.bottom.push(merge(newNextPoint, {
                                    isNull: true
                                }));
                            }
                        }
                    }
                    else if (mainPoint) {
                        if (point.y >= mainPoint.close) {
                            point.color = (pointColor || indicOptions.fallingTrendColor ||
                                indicOptions.color);
                            groupedPoitns.top.push(newPoint);
                        }
                        else {
                            point.color = (pointColor || indicOptions.risingTrendColor ||
                                indicOptions.color);
                            groupedPoitns.bottom.push(newPoint);
                        }
                    }
                }
                // Generate lines:
                objectEach(groupedPoitns, function (values, lineName) {
                    indicator.points = values;
                    indicator.options = merge(supertrendLineOptions[lineName].styles, gappedExtend);
                    indicator.graph = indicator['graph' + lineName + 'Line'];
                    SMA.prototype.drawGraph.call(indicator);
                    // Now save line
                    indicator['graph' + lineName + 'Line'] = indicator.graph;
                });
                // Restore options:
                indicator.points = indicPoints;
                indicator.options = indicOptions;
                indicator.graph = indicPath;
            },
            // Supertrend (Multiplier, Period) Formula:
            // BASIC UPPERBAND = (HIGH + LOW) / 2 + Multiplier * ATR(Period)
            // BASIC LOWERBAND = (HIGH + LOW) / 2 - Multiplier * ATR(Period)
            // FINAL UPPERBAND =
            //     IF(
            //      Current BASICUPPERBAND  < Previous FINAL UPPERBAND AND
            //      Previous Close > Previous FINAL UPPERBAND
            //     ) THEN (Current BASIC UPPERBAND)
            //     ELSE (Previous FINALUPPERBAND)
            // FINAL LOWERBAND =
            //     IF(
            //      Current BASIC LOWERBAND  > Previous FINAL LOWERBAND AND
            //      Previous Close < Previous FINAL LOWERBAND
            //     ) THEN (Current BASIC LOWERBAND)
            //     ELSE (Previous FINAL LOWERBAND)
            // SUPERTREND =
            //     IF(
            //      Previous Supertrend == Previous FINAL UPPERBAND AND
            //      Current Close < Current FINAL UPPERBAND
            //     ) THAN Current FINAL UPPERBAND
            //     ELSE IF(
            //      Previous Supertrend == Previous FINAL LOWERBAND AND
            //      Current Close < Current FINAL LOWERBAND
            //     ) THAN Current FINAL UPPERBAND
            //     ELSE IF(
            //      Previous Supertrend == Previous FINAL UPPERBAND AND
            //      Current Close > Current FINAL UPPERBAND
            //     ) THAN Current FINAL LOWERBAND
            //     ELSE IF(
            //      Previous Supertrend == Previous FINAL LOWERBAND AND
            //      Current Close > Current FINAL LOWERBAND
            //     ) THAN Current FINAL LOWERBAND
            getValues: function (series, params) {
                var period = params.period,
                    multiplier = params.multiplier,
                    xVal = series.xData,
                    yVal = series.yData,
                    ATRData = [], 
                    // 0- date, 1- Supertrend indicator
                    ST = [],
                    xData = [],
                    yData = [],
                    close = 3,
                    low = 2,
                    high = 1,
                    periodsOffset = (period === 0) ? 0 : period - 1,
                    basicUp,
                    basicDown,
                    finalUp = [],
                    finalDown = [],
                    supertrend,
                    prevFinalUp,
                    prevFinalDown,
                    prevST, // previous Supertrend
                    prevY,
                    y,
                    i;
                if ((xVal.length <= period) || !isArray(yVal[0]) ||
                    yVal[0].length !== 4 || period < 0) {
                    return;
                }
                ATRData = ATR.prototype.getValues.call(this, series, {
                    period: period
                }).yData;
                for (i = 0; i < ATRData.length; i++) {
                    y = yVal[periodsOffset + i];
                    prevY = yVal[periodsOffset + i - 1] || [];
                    prevFinalUp = finalUp[i - 1];
                    prevFinalDown = finalDown[i - 1];
                    prevST = yData[i - 1];
                    if (i === 0) {
                        prevFinalUp = prevFinalDown = prevST = 0;
                    }
                    basicUp = correctFloat((y[high] + y[low]) / 2 + multiplier * ATRData[i]);
                    basicDown = correctFloat((y[high] + y[low]) / 2 - multiplier * ATRData[i]);
                    if ((basicUp < prevFinalUp) ||
                        (prevY[close] > prevFinalUp)) {
                        finalUp[i] = basicUp;
                    }
                    else {
                        finalUp[i] = prevFinalUp;
                    }
                    if ((basicDown > prevFinalDown) ||
                        (prevY[close] < prevFinalDown)) {
                        finalDown[i] = basicDown;
                    }
                    else {
                        finalDown[i] = prevFinalDown;
                    }
                    if (prevST === prevFinalUp && y[close] < finalUp[i] ||
                        prevST === prevFinalDown && y[close] < finalDown[i]) {
                        supertrend = finalUp[i];
                    }
                    else if (prevST === prevFinalUp && y[close] > finalUp[i] ||
                        prevST === prevFinalDown && y[close] > finalDown[i]) {
                        supertrend = finalDown[i];
                    }
                    ST.push([xVal[periodsOffset + i], supertrend]);
                    xData.push(xVal[periodsOffset + i]);
                    yData.push(supertrend);
                }
                return {
                    values: ST,
                    xData: xData,
                    yData: yData
                };
            }
        });
        /**
         * A `Supertrend indicator` series. If the [type](#series.supertrend.type)
         * option is not specified, it is inherited from [chart.type](#chart.type).
         *
         * @extends   series,plotOptions.supertrend
         * @since     7.0.0
         * @product   highstock
         * @excluding allAreas, colorAxis, cropThreshold, data, dataParser, dataURL,
         *            joinBy, keys, navigatorOptions, negativeColor, pointInterval,
         *            pointIntervalUnit, pointPlacement, pointRange, pointStart,
         *            showInNavigator, stacking, threshold
         * @requires  stock/indicators/indicators
         * @requires  stock/indicators/supertrend
         * @apioption series.supertrend
         */
        ''; // to include the above in the js output

    });
    _registerModule(_modules, 'masters/indicators/supertrend.src.js', [], function () {


    });
}));