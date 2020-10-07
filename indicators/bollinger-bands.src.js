/**
 * @license Highstock JS v8.2.0 (2020-10-07)
 *
 * Indicator series type for Highstock
 *
 * (c) 2010-2019 Paweł Fus
 *
 * License: www.highcharts.com/license
 */
'use strict';
(function (factory) {
    if (typeof module === 'object' && module.exports) {
        factory['default'] = factory;
        module.exports = factory;
    } else if (typeof define === 'function' && define.amd) {
        define('highcharts/indicators/bollinger-bands', ['highcharts', 'highcharts/modules/stock'], function (Highcharts) {
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
    _registerModule(_modules, 'Mixins/MultipleLines.js', [_modules['Core/Globals.js'], _modules['Core/Utilities.js']], function (H, U) {
        /**
         *
         *  (c) 2010-2020 Wojciech Chmiel
         *
         *  License: www.highcharts.com/license
         *
         *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
         *
         * */
        var defined = U.defined,
            error = U.error,
            merge = U.merge;
        var SMA = H.seriesTypes.sma;
        /**
         * Mixin useful for all indicators that have more than one line.
         * Merge it with your implementation where you will provide
         * getValues method appropriate to your indicator and pointArrayMap,
         * pointValKey, linesApiNames properites. Notice that pointArrayMap
         * should be consistent with amount of lines calculated in getValues method.
         *
         * @private
         * @mixin multipleLinesMixin
         */
        var multipleLinesMixin = {
                /* eslint-disable valid-jsdoc */
                /**
                 * Lines ids. Required to plot appropriate amount of lines.
                 * Notice that pointArrayMap should have more elements than
                 * linesApiNames, because it contains main line and additional lines ids.
                 * Also it should be consistent with amount of lines calculated in
                 * getValues method from your implementation.
                 *
                 * @private
                 * @name multipleLinesMixin.pointArrayMap
                 * @type {Array<string>}
                 */
                pointArrayMap: ['top', 'bottom'],
                /**
                 * Main line id.
                 *
                 * @private
                 * @name multipleLinesMixin.pointValKey
                 * @type {string}
                 */
                pointValKey: 'top',
                /**
                 * Additional lines DOCS names. Elements of linesApiNames array should
                 * be consistent with DOCS line names defined in your implementation.
                 * Notice that linesApiNames should have decreased amount of elements
                 * relative to pointArrayMap (without pointValKey).
                 *
                 * @private
                 * @name multipleLinesMixin.linesApiNames
                 * @type {Array<string>}
                 */
                linesApiNames: ['bottomLine'],
                /**
                 * Create translatedLines Collection based on pointArrayMap.
                 *
                 * @private
                 * @function multipleLinesMixin.getTranslatedLinesNames
                 * @param {string} [excludedValue]
                 *        Main line id
                 * @return {Array<string>}
                 *         Returns translated lines names without excluded value.
                 */
                getTranslatedLinesNames: function (excludedValue) {
                    var translatedLines = [];
                (this.pointArrayMap || []).forEach(function (propertyName) {
                    if (propertyName !== excludedValue) {
                        translatedLines.push('plot' +
                            propertyName.charAt(0).toUpperCase() +
                            propertyName.slice(1));
                    }
                });
                return translatedLines;
            },
            /**
             * @private
             * @function multipleLinesMixin.toYData
             * @param {Highcharts.Point} point
             *        Indicator point
             * @return {Array<number>}
             *         Returns point Y value for all lines
             */
            toYData: function (point) {
                var pointColl = [];
                (this.pointArrayMap || []).forEach(function (propertyName) {
                    pointColl.push(point[propertyName]);
                });
                return pointColl;
            },
            /**
             * Add lines plot pixel values.
             *
             * @private
             * @function multipleLinesMixin.translate
             * @return {void}
             */
            translate: function () {
                var indicator = this,
                    pointArrayMap = indicator.pointArrayMap,
                    LinesNames = [],
                    value;
                LinesNames = indicator.getTranslatedLinesNames();
                SMA.prototype.translate.apply(indicator, arguments);
                indicator.points.forEach(function (point) {
                    pointArrayMap.forEach(function (propertyName, i) {
                        value = point[propertyName];
                        if (value !== null) {
                            point[LinesNames[i]] = indicator.yAxis.toPixels(value, true);
                        }
                    });
                });
            },
            /**
             * Draw main and additional lines.
             *
             * @private
             * @function multipleLinesMixin.drawGraph
             * @return {void}
             */
            drawGraph: function () {
                var indicator = this,
                    pointValKey = indicator.pointValKey,
                    linesApiNames = indicator.linesApiNames,
                    mainLinePoints = indicator.points,
                    pointsLength = mainLinePoints.length,
                    mainLineOptions = indicator.options,
                    mainLinePath = indicator.graph,
                    gappedExtend = {
                        options: {
                            gapSize: mainLineOptions.gapSize
                        }
                    }, 
                    // additional lines point place holders:
                    secondaryLines = [],
                    secondaryLinesNames = indicator.getTranslatedLinesNames(pointValKey),
                    point;
                // Generate points for additional lines:
                secondaryLinesNames.forEach(function (plotLine, index) {
                    // create additional lines point place holders
                    secondaryLines[index] = [];
                    while (pointsLength--) {
                        point = mainLinePoints[pointsLength];
                        secondaryLines[index].push({
                            x: point.x,
                            plotX: point.plotX,
                            plotY: point[plotLine],
                            isNull: !defined(point[plotLine])
                        });
                    }
                    pointsLength = mainLinePoints.length;
                });
                // Modify options and generate additional lines:
                linesApiNames.forEach(function (lineName, i) {
                    if (secondaryLines[i]) {
                        indicator.points = secondaryLines[i];
                        if (mainLineOptions[lineName]) {
                            indicator.options = merge(mainLineOptions[lineName].styles, gappedExtend);
                        }
                        else {
                            error('Error: "There is no ' + lineName +
                                ' in DOCS options declared. Check if linesApiNames' +
                                ' are consistent with your DOCS line names."' +
                                ' at mixin/multiple-line.js:34');
                        }
                        indicator.graph = indicator['graph' + lineName];
                        SMA.prototype.drawGraph.call(indicator);
                        // Now save lines:
                        indicator['graph' + lineName] = indicator.graph;
                    }
                    else {
                        error('Error: "' + lineName + ' doesn\'t have equivalent ' +
                            'in pointArrayMap. To many elements in linesApiNames ' +
                            'relative to pointArrayMap."');
                    }
                });
                // Restore options and draw a main line:
                indicator.points = mainLinePoints;
                indicator.options = mainLineOptions;
                indicator.graph = mainLinePath;
                SMA.prototype.drawGraph.call(indicator);
            }
        };

        return multipleLinesMixin;
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
    _registerModule(_modules, 'Stock/Indicators/BBIndicator.js', [_modules['Core/Series/Series.js'], _modules['Mixins/MultipleLines.js'], _modules['Core/Utilities.js']], function (BaseSeries, MultipleLinesMixin, U) {
        /**
         *
         *  License: www.highcharts.com/license
         *
         *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
         *
         * */
        var isArray = U.isArray,
            merge = U.merge;
        var SMA = BaseSeries.seriesTypes.sma;
        /* eslint-disable valid-jsdoc */
        // Utils:
        /**
         * @private
         */
        function getStandardDeviation(arr, index, isOHLC, mean) {
            var variance = 0,
                arrLen = arr.length,
                std = 0,
                i = 0,
                value;
            for (; i < arrLen; i++) {
                value = (isOHLC ? arr[i][index] : arr[i]) - mean;
                variance += value * value;
            }
            variance = variance / (arrLen - 1);
            std = Math.sqrt(variance);
            return std;
        }
        /* eslint-enable valid-jsdoc */
        /**
         * Bollinger Bands series type.
         *
         * @private
         * @class
         * @name Highcharts.seriesTypes.bb
         *
         * @augments Highcharts.Series
         */
        BaseSeries.seriesType('bb', 'sma', 
        /**
         * Bollinger bands (BB). This series requires the `linkedTo` option to be
         * set and should be loaded after the `stock/indicators/indicators.js` file.
         *
         * @sample stock/indicators/bollinger-bands
         *         Bollinger bands
         *
         * @extends      plotOptions.sma
         * @since        6.0.0
         * @product      highstock
         * @requires     stock/indicators/indicators
         * @requires     stock/indicators/bollinger-bands
         * @optionparent plotOptions.bb
         */
        {
            params: {
                period: 20,
                /**
                 * Standard deviation for top and bottom bands.
                 */
                standardDeviation: 2,
                index: 3
            },
            /**
             * Bottom line options.
             */
            bottomLine: {
                /**
                 * Styles for a bottom line.
                 */
                styles: {
                    /**
                     * Pixel width of the line.
                     */
                    lineWidth: 1,
                    /**
                     * Color of the line. If not set, it's inherited from
                     * [plotOptions.bb.color](#plotOptions.bb.color).
                     *
                     * @type  {Highcharts.ColorString}
                     */
                    lineColor: void 0
                }
            },
            /**
             * Top line options.
             *
             * @extends plotOptions.bb.bottomLine
             */
            topLine: {
                styles: {
                    lineWidth: 1,
                    /**
                     * @type {Highcharts.ColorString}
                     */
                    lineColor: void 0
                }
            },
            tooltip: {
                pointFormat: '<span style="color:{point.color}">\u25CF</span><b> {series.name}</b><br/>Top: {point.top}<br/>Middle: {point.middle}<br/>Bottom: {point.bottom}<br/>'
            },
            marker: {
                enabled: false
            },
            dataGrouping: {
                approximation: 'averages'
            }
        }, 
        /**
         * @lends Highcharts.Series#
         */
        merge(MultipleLinesMixin, {
            pointArrayMap: ['top', 'middle', 'bottom'],
            pointValKey: 'middle',
            nameComponents: ['period', 'standardDeviation'],
            linesApiNames: ['topLine', 'bottomLine'],
            init: function () {
                SMA.prototype.init.apply(this, arguments);
                // Set default color for lines:
                this.options = merge({
                    topLine: {
                        styles: {
                            lineColor: this.color
                        }
                    },
                    bottomLine: {
                        styles: {
                            lineColor: this.color
                        }
                    }
                }, this.options);
            },
            getValues: function (series, params) {
                var period = params.period,
                    standardDeviation = params.standardDeviation,
                    xVal = series.xData,
                    yVal = series.yData,
                    yValLen = yVal ? yVal.length : 0, 
                    // 0- date, 1-middle line, 2-top line, 3-bottom line
                    BB = [], 
                    // middle line, top line and bottom line
                    ML,
                    TL,
                    BL,
                    date,
                    xData = [],
                    yData = [],
                    slicedX,
                    slicedY,
                    stdDev,
                    isOHLC,
                    point,
                    i;
                if (xVal.length < period) {
                    return;
                }
                isOHLC = isArray(yVal[0]);
                for (i = period; i <= yValLen; i++) {
                    slicedX = xVal.slice(i - period, i);
                    slicedY = yVal.slice(i - period, i);
                    point = SMA.prototype.getValues.call(this, {
                        xData: slicedX,
                        yData: slicedY
                    }, params);
                    date = point.xData[0];
                    ML = point.yData[0];
                    stdDev = getStandardDeviation(slicedY, params.index, isOHLC, ML);
                    TL = ML + standardDeviation * stdDev;
                    BL = ML - standardDeviation * stdDev;
                    BB.push([date, TL, ML, BL]);
                    xData.push(date);
                    yData.push([TL, ML, BL]);
                }
                return {
                    values: BB,
                    xData: xData,
                    yData: yData
                };
            }
        }));
        /**
         * A bollinger bands indicator. If the [type](#series.bb.type) option is not
         * specified, it is inherited from [chart.type](#chart.type).
         *
         * @extends   series,plotOptions.bb
         * @since     6.0.0
         * @excluding dataParser, dataURL
         * @product   highstock
         * @requires  stock/indicators/indicators
         * @requires  stock/indicators/bollinger-bands
         * @apioption series.bb
         */
        ''; // to include the above in the js output

    });
    _registerModule(_modules, 'masters/indicators/bollinger-bands.src.js', [], function () {


    });
}));