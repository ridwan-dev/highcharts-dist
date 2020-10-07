/**
 * @license Highstock JS v8.2.0 (2020-10-07)
 *
 * Indicator series type for Highstock
 *
 * (c) 2010-2019 Sebastian Bochan
 *
 * License: www.highcharts.com/license
 */
'use strict';
(function (factory) {
    if (typeof module === 'object' && module.exports) {
        factory['default'] = factory;
        module.exports = factory;
    } else if (typeof define === 'function' && define.amd) {
        define('highcharts/indicators/macd', ['highcharts', 'highcharts/modules/stock'], function (Highcharts) {
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
    _registerModule(_modules, 'Stock/Indicators/EMAIndicator.js', [_modules['Core/Series/Series.js'], _modules['Core/Utilities.js']], function (BaseSeries, U) {
        /* *
         *
         *  License: www.highcharts.com/license
         *
         *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
         *
         * */
        var correctFloat = U.correctFloat,
            isArray = U.isArray;
        /**
         * The EMA series type.
         *
         * @private
         * @class
         * @name Highcharts.seriesTypes.ema
         *
         * @augments Highcharts.Series
         */
        BaseSeries.seriesType('ema', 'sma', 
        /**
         * Exponential moving average indicator (EMA). This series requires the
         * `linkedTo` option to be set.
         *
         * @sample stock/indicators/ema
         *         Exponential moving average indicator
         *
         * @extends      plotOptions.sma
         * @since        6.0.0
         * @product      highstock
         * @requires     stock/indicators/indicators
         * @requires     stock/indicators/ema
         * @optionparent plotOptions.ema
         */
        {
            params: {
                /**
                 * The point index which indicator calculations will base. For
                 * example using OHLC data, index=2 means the indicator will be
                 * calculated using Low values.
                 *
                 * By default index value used to be set to 0. Since Highstock 7
                 * by default index is set to 3 which means that the ema
                 * indicator will be calculated using Close values.
                 */
                index: 3,
                period: 9 // @merge 14 in v6.2
            }
        }, 
        /**
         * @lends Highcharts.Series#
         */
        {
            accumulatePeriodPoints: function (period, index, yVal) {
                var sum = 0,
                    i = 0,
                    y = 0;
                while (i < period) {
                    y = index < 0 ? yVal[i] : yVal[i][index];
                    sum = sum + y;
                    i++;
                }
                return sum;
            },
            calculateEma: function (xVal, yVal, i, EMApercent, calEMA, index, SMA) {
                var x = xVal[i - 1],
                    yValue = index < 0 ?
                        yVal[i - 1] :
                        yVal[i - 1][index],
                    y;
                y = typeof calEMA === 'undefined' ?
                    SMA : correctFloat((yValue * EMApercent) +
                    (calEMA * (1 - EMApercent)));
                return [x, y];
            },
            getValues: function (series, params) {
                var period = params.period,
                    xVal = series.xData,
                    yVal = series.yData,
                    yValLen = yVal ? yVal.length : 0,
                    EMApercent = 2 / (period + 1),
                    sum = 0,
                    EMA = [],
                    xData = [],
                    yData = [],
                    index = -1,
                    SMA = 0,
                    calEMA,
                    EMAPoint,
                    i;
                // Check period, if bigger than points length, skip
                if (yValLen < period) {
                    return;
                }
                // Switch index for OHLC / Candlestick / Arearange
                if (isArray(yVal[0])) {
                    index = params.index ? params.index : 0;
                }
                // Accumulate first N-points
                sum = this.accumulatePeriodPoints(period, index, yVal);
                // first point
                SMA = sum / period;
                // Calculate value one-by-one for each period in visible data
                for (i = period; i < yValLen + 1; i++) {
                    EMAPoint = this.calculateEma(xVal, yVal, i, EMApercent, calEMA, index, SMA);
                    EMA.push(EMAPoint);
                    xData.push(EMAPoint[0]);
                    yData.push(EMAPoint[1]);
                    calEMA = EMAPoint[1];
                }
                return {
                    values: EMA,
                    xData: xData,
                    yData: yData
                };
            }
        });
        /**
         * A `EMA` series. If the [type](#series.ema.type) option is not
         * specified, it is inherited from [chart.type](#chart.type).
         *
         * @extends   series,plotOptions.ema
         * @since     6.0.0
         * @product   highstock
         * @excluding dataParser, dataURL
         * @requires  stock/indicators/indicators
         * @requires  stock/indicators/ema
         * @apioption series.ema
         */
        ''; // adds doclet above to the transpiled file

    });
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
    _registerModule(_modules, 'Stock/Indicators/MACDIndicator.js', [_modules['Core/Series/Series.js'], _modules['Core/Globals.js'], _modules['Core/Utilities.js']], function (BaseSeries, H, U) {
        /* *
         *
         *  License: www.highcharts.com/license
         *
         *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
         *
         * */
        var noop = H.noop;
        var correctFloat = U.correctFloat,
            defined = U.defined,
            merge = U.merge;
        var SMA = H.seriesTypes.sma,
            EMA = H.seriesTypes.ema;
        /**
         * The MACD series type.
         *
         * @private
         * @class
         * @name Highcharts.seriesTypes.macd
         *
         * @augments Highcharts.Series
         */
        BaseSeries.seriesType('macd', 'sma', 
        /**
         * Moving Average Convergence Divergence (MACD). This series requires
         * `linkedTo` option to be set and should be loaded after the
         * `stock/indicators/indicators.js` and `stock/indicators/ema.js`.
         *
         * @sample stock/indicators/macd
         *         MACD indicator
         *
         * @extends      plotOptions.sma
         * @since        6.0.0
         * @product      highstock
         * @requires     stock/indicators/indicators
         * @requires     stock/indicators/macd
         * @optionparent plotOptions.macd
         */
        {
            params: {
                /**
                 * The short period for indicator calculations.
                 */
                shortPeriod: 12,
                /**
                 * The long period for indicator calculations.
                 */
                longPeriod: 26,
                /**
                 * The base period for signal calculations.
                 */
                signalPeriod: 9,
                period: 26
            },
            /**
             * The styles for signal line
             */
            signalLine: {
                /**
                 * @sample stock/indicators/macd-zones
                 *         Zones in MACD
                 *
                 * @extends plotOptions.macd.zones
                 */
                zones: [],
                styles: {
                    /**
                     * Pixel width of the line.
                     */
                    lineWidth: 1,
                    /**
                     * Color of the line.
                     *
                     * @type  {Highcharts.ColorString}
                     */
                    lineColor: void 0
                }
            },
            /**
             * The styles for macd line
             */
            macdLine: {
                /**
                 * @sample stock/indicators/macd-zones
                 *         Zones in MACD
                 *
                 * @extends plotOptions.macd.zones
                 */
                zones: [],
                styles: {
                    /**
                     * Pixel width of the line.
                     */
                    lineWidth: 1,
                    /**
                     * Color of the line.
                     *
                     * @type  {Highcharts.ColorString}
                     */
                    lineColor: void 0
                }
            },
            threshold: 0,
            groupPadding: 0.1,
            pointPadding: 0.1,
            crisp: false,
            states: {
                hover: {
                    halo: {
                        size: 0
                    }
                }
            },
            tooltip: {
                pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name}</b><br/>' +
                    'Value: {point.MACD}<br/>' +
                    'Signal: {point.signal}<br/>' +
                    'Histogram: {point.y}<br/>'
            },
            dataGrouping: {
                approximation: 'averages'
            },
            minPointLength: 0
        }, 
        /**
         * @lends Highcharts.Series#
         */
        {
            nameComponents: ['longPeriod', 'shortPeriod', 'signalPeriod'],
            requiredIndicators: ['ema'],
            // "y" value is treated as Histogram data
            pointArrayMap: ['y', 'signal', 'MACD'],
            parallelArrays: ['x', 'y', 'signal', 'MACD'],
            pointValKey: 'y',
            // Columns support:
            markerAttribs: noop,
            getColumnMetrics: H.seriesTypes.column.prototype.getColumnMetrics,
            crispCol: H.seriesTypes.column.prototype.crispCol,
            // Colors and lines:
            init: function () {
                SMA.prototype.init.apply(this, arguments);
                // Check whether series is initialized. It may be not initialized,
                // when any of required indicators is missing.
                if (this.options) {
                    // Set default color for a signal line and the histogram:
                    this.options = merge({
                        signalLine: {
                            styles: {
                                lineColor: this.color
                            }
                        },
                        macdLine: {
                            styles: {
                                color: this.color
                            }
                        }
                    }, this.options);
                    // Zones have indexes automatically calculated, we need to
                    // translate them to support multiple lines within one indicator
                    this.macdZones = {
                        zones: this.options.macdLine.zones,
                        startIndex: 0
                    };
                    this.signalZones = {
                        zones: this.macdZones.zones.concat(this.options.signalLine.zones),
                        startIndex: this.macdZones.zones.length
                    };
                    this.resetZones = true;
                }
            },
            toYData: function (point) {
                return [point.y, point.signal, point.MACD];
            },
            translate: function () {
                var indicator = this, plotNames = ['plotSignal', 'plotMACD'];
                H.seriesTypes.column.prototype.translate.apply(indicator);
                indicator.points.forEach(function (point) {
                    [point.signal, point.MACD].forEach(function (value, i) {
                        if (value !== null) {
                            point[plotNames[i]] =
                                indicator.yAxis.toPixels(value, true);
                        }
                    });
                });
            },
            destroy: function () {
                // this.graph is null due to removing two times the same SVG element
                this.graph = null;
                this.graphmacd = this.graphmacd && this.graphmacd.destroy();
                this.graphsignal = this.graphsignal && this.graphsignal.destroy();
                SMA.prototype.destroy.apply(this, arguments);
            },
            drawPoints: H.seriesTypes.column.prototype.drawPoints,
            drawGraph: function () {
                var indicator = this,
                    mainLinePoints = indicator.points,
                    pointsLength = mainLinePoints.length,
                    mainLineOptions = indicator.options,
                    histogramZones = indicator.zones,
                    gappedExtend = {
                        options: {
                            gapSize: mainLineOptions.gapSize
                        }
                    },
                    otherSignals = [[],
                    []],
                    point;
                // Generate points for top and bottom lines:
                while (pointsLength--) {
                    point = mainLinePoints[pointsLength];
                    if (defined(point.plotMACD)) {
                        otherSignals[0].push({
                            plotX: point.plotX,
                            plotY: point.plotMACD,
                            isNull: !defined(point.plotMACD)
                        });
                    }
                    if (defined(point.plotSignal)) {
                        otherSignals[1].push({
                            plotX: point.plotX,
                            plotY: point.plotSignal,
                            isNull: !defined(point.plotMACD)
                        });
                    }
                }
                // Modify options and generate smoothing line:
                ['macd', 'signal'].forEach(function (lineName, i) {
                    indicator.points = otherSignals[i];
                    indicator.options = merge(mainLineOptions[lineName + 'Line'].styles, gappedExtend);
                    indicator.graph = indicator['graph' + lineName];
                    // Zones extension:
                    indicator.currentLineZone = lineName + 'Zones';
                    indicator.zones =
                        indicator[indicator.currentLineZone].zones;
                    SMA.prototype.drawGraph.call(indicator);
                    indicator['graph' + lineName] = indicator.graph;
                });
                // Restore options:
                indicator.points = mainLinePoints;
                indicator.options = mainLineOptions;
                indicator.zones = histogramZones;
                indicator.currentLineZone = null;
                // indicator.graph = null;
            },
            getZonesGraphs: function (props) {
                var allZones = SMA.prototype.getZonesGraphs.call(this,
                    props),
                    currentZones = allZones;
                if (this.currentLineZone) {
                    currentZones = allZones.splice(this[this.currentLineZone].startIndex + 1);
                    if (!currentZones.length) {
                        // Line has no zones, return basic graph "zone"
                        currentZones = [props[0]];
                    }
                    else {
                        // Add back basic prop:
                        currentZones.splice(0, 0, props[0]);
                    }
                }
                return currentZones;
            },
            applyZones: function () {
                // Histogram zones are handled by drawPoints method
                // Here we need to apply zones for all lines
                var histogramZones = this.zones;
                // signalZones.zones contains all zones:
                this.zones = this.signalZones.zones;
                SMA.prototype.applyZones.call(this);
                // applyZones hides only main series.graph, hide macd line manually
                if (this.graphmacd && this.options.macdLine.zones.length) {
                    this.graphmacd.hide();
                }
                this.zones = histogramZones;
            },
            getValues: function (series, params) {
                var j = 0,
                    MACD = [],
                    xMACD = [],
                    yMACD = [],
                    signalLine = [],
                    shortEMA,
                    longEMA,
                    i;
                if (series.xData.length <
                    params.longPeriod + params.signalPeriod) {
                    return;
                }
                // Calculating the short and long EMA used when calculating the MACD
                shortEMA = EMA.prototype.getValues(series, {
                    period: params.shortPeriod
                });
                longEMA = EMA.prototype.getValues(series, {
                    period: params.longPeriod
                });
                shortEMA = shortEMA.values;
                longEMA = longEMA.values;
                // Subtract each Y value from the EMA's and create the new dataset
                // (MACD)
                for (i = 1; i <= shortEMA.length; i++) {
                    if (defined(longEMA[i - 1]) &&
                        defined(longEMA[i - 1][1]) &&
                        defined(shortEMA[i + params.shortPeriod + 1]) &&
                        defined(shortEMA[i + params.shortPeriod + 1][0])) {
                        MACD.push([
                            shortEMA[i + params.shortPeriod + 1][0],
                            0,
                            null,
                            shortEMA[i + params.shortPeriod + 1][1] -
                                longEMA[i - 1][1]
                        ]);
                    }
                }
                // Set the Y and X data of the MACD. This is used in calculating the
                // signal line.
                for (i = 0; i < MACD.length; i++) {
                    xMACD.push(MACD[i][0]);
                    yMACD.push([0, null, MACD[i][3]]);
                }
                // Setting the signalline (Signal Line: X-day EMA of MACD line).
                signalLine = EMA.prototype.getValues({
                    xData: xMACD,
                    yData: yMACD
                }, {
                    period: params.signalPeriod,
                    index: 2
                });
                signalLine = signalLine.values;
                // Setting the MACD Histogram. In comparison to the loop with pure
                // MACD this loop uses MACD x value not xData.
                for (i = 0; i < MACD.length; i++) {
                    // detect the first point
                    if (MACD[i][0] >= signalLine[0][0]) {
                        MACD[i][2] = signalLine[j][1];
                        yMACD[i] = [0, signalLine[j][1], MACD[i][3]];
                        if (MACD[i][3] === null) {
                            MACD[i][1] = 0;
                            yMACD[i][0] = 0;
                        }
                        else {
                            MACD[i][1] = correctFloat(MACD[i][3] -
                                signalLine[j][1]);
                            yMACD[i][0] = correctFloat(MACD[i][3] -
                                signalLine[j][1]);
                        }
                        j++;
                    }
                }
                return {
                    values: MACD,
                    xData: xMACD,
                    yData: yMACD
                };
            }
        });
        /**
         * A `MACD` series. If the [type](#series.macd.type) option is not
         * specified, it is inherited from [chart.type](#chart.type).
         *
         * @extends   series,plotOptions.macd
         * @since     6.0.0
         * @product   highstock
         * @excluding dataParser, dataURL
         * @requires  stock/indicators/indicators
         * @requires  stock/indicators/macd
         * @apioption series.macd
         */
        ''; // to include the above in the js output

    });
    _registerModule(_modules, 'masters/indicators/macd.src.js', [], function () {


    });
}));