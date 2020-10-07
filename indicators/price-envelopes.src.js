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
        define('highcharts/indicators/price-envelopes', ['highcharts', 'highcharts/modules/stock'], function (Highcharts) {
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
    _registerModule(_modules, 'Stock/Indicators/PriceEnvelopesIndicator.js', [_modules['Core/Series/Series.js'], _modules['Core/Utilities.js']], function (BaseSeries, U) {
        /* *
         *
         *  License: www.highcharts.com/license
         *
         *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
         *
         * */
        var isArray = U.isArray,
            merge = U.merge;
        var SMA = BaseSeries.seriesTypes.sma;
        /**
         * The Price Envelopes series type.
         *
         * @private
         * @class
         * @name Highcharts.seriesTypes.priceenvelopes
         *
         * @augments Highcharts.Series
         */
        BaseSeries.seriesType('priceenvelopes', 'sma', 
        /**
         * Price envelopes indicator based on [SMA](#plotOptions.sma) calculations.
         * This series requires the `linkedTo` option to be set and should be loaded
         * after the `stock/indicators/indicators.js` file.
         *
         * @sample stock/indicators/price-envelopes
         *         Price envelopes
         *
         * @extends      plotOptions.sma
         * @since        6.0.0
         * @product      highstock
         * @requires     stock/indicators/indicators
         * @requires     stock/indicators/price-envelopes
         * @optionparent plotOptions.priceenvelopes
         */
        {
            marker: {
                enabled: false
            },
            tooltip: {
                pointFormat: '<span style="color:{point.color}">\u25CF</span><b> {series.name}</b><br/>Top: {point.top}<br/>Middle: {point.middle}<br/>Bottom: {point.bottom}<br/>'
            },
            params: {
                period: 20,
                /**
                 * Percentage above the moving average that should be displayed.
                 * 0.1 means 110%. Relative to the calculated value.
                 */
                topBand: 0.1,
                /**
                 * Percentage below the moving average that should be displayed.
                 * 0.1 means 90%. Relative to the calculated value.
                 */
                bottomBand: 0.1
            },
            /**
             * Bottom line options.
             */
            bottomLine: {
                styles: {
                    /**
                     * Pixel width of the line.
                     */
                    lineWidth: 1,
                    /**
                     * Color of the line. If not set, it's inherited from
                     * [plotOptions.priceenvelopes.color](
                     * #plotOptions.priceenvelopes.color).
                     *
                     * @type {Highcharts.ColorString}
                     */
                    lineColor: void 0
                }
            },
            /**
             * Top line options.
             *
             * @extends plotOptions.priceenvelopes.bottomLine
             */
            topLine: {
                styles: {
                    lineWidth: 1
                }
            },
            dataGrouping: {
                approximation: 'averages'
            }
        }, 
        /**
         * @lends Highcharts.Series#
         */
        {
            nameComponents: ['period', 'topBand', 'bottomBand'],
            nameBase: 'Price envelopes',
            pointArrayMap: ['top', 'middle', 'bottom'],
            parallelArrays: ['x', 'y', 'top', 'bottom'],
            pointValKey: 'middle',
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
            toYData: function (point) {
                return [point.top, point.middle, point.bottom];
            },
            translate: function () {
                var indicator = this, translatedEnvelopes = ['plotTop', 'plotMiddle', 'plotBottom'];
                SMA.prototype.translate.apply(indicator);
                indicator.points.forEach(function (point) {
                    [point.top, point.middle, point.bottom].forEach(function (value, i) {
                        if (value !== null) {
                            point[translatedEnvelopes[i]] =
                                indicator.yAxis.toPixels(value, true);
                        }
                    });
                });
            },
            drawGraph: function () {
                var indicator = this,
                    middleLinePoints = indicator.points,
                    pointsLength = middleLinePoints.length,
                    middleLineOptions = (indicator.options),
                    middleLinePath = indicator.graph,
                    gappedExtend = {
                        options: {
                            gapSize: middleLineOptions.gapSize
                        }
                    },
                    deviations = [[],
                    []], // top and bottom point place holders
                    point;
                // Generate points for top and bottom lines:
                while (pointsLength--) {
                    point = middleLinePoints[pointsLength];
                    deviations[0].push({
                        plotX: point.plotX,
                        plotY: point.plotTop,
                        isNull: point.isNull
                    });
                    deviations[1].push({
                        plotX: point.plotX,
                        plotY: point.plotBottom,
                        isNull: point.isNull
                    });
                }
                // Modify options and generate lines:
                ['topLine', 'bottomLine'].forEach(function (lineName, i) {
                    indicator.points = deviations[i];
                    indicator.options = merge(middleLineOptions[lineName].styles, gappedExtend);
                    indicator.graph = indicator['graph' + lineName];
                    SMA.prototype.drawGraph.call(indicator);
                    // Now save lines:
                    indicator['graph' + lineName] = indicator.graph;
                });
                // Restore options and draw a middle line:
                indicator.points = middleLinePoints;
                indicator.options = middleLineOptions;
                indicator.graph = middleLinePath;
                SMA.prototype.drawGraph.call(indicator);
            },
            getValues: function (series, params) {
                var period = params.period,
                    topPercent = params.topBand,
                    botPercent = params.bottomBand,
                    xVal = series.xData,
                    yVal = series.yData,
                    yValLen = yVal ? yVal.length : 0, 
                    // 0- date, 1-top line, 2-middle line, 3-bottom line
                    PE = [], 
                    // middle line, top line and bottom line
                    ML,
                    TL,
                    BL,
                    date,
                    xData = [],
                    yData = [],
                    slicedX,
                    slicedY,
                    point,
                    i;
                // Price envelopes requires close value
                if (xVal.length < period ||
                    !isArray(yVal[0]) ||
                    yVal[0].length !== 4) {
                    return;
                }
                for (i = period; i <= yValLen; i++) {
                    slicedX = xVal.slice(i - period, i);
                    slicedY = yVal.slice(i - period, i);
                    point = SMA.prototype.getValues.call(this, {
                        xData: slicedX,
                        yData: slicedY
                    }, params);
                    date = point.xData[0];
                    ML = point.yData[0];
                    TL = ML * (1 + topPercent);
                    BL = ML * (1 - botPercent);
                    PE.push([date, TL, ML, BL]);
                    xData.push(date);
                    yData.push([TL, ML, BL]);
                }
                return {
                    values: PE,
                    xData: xData,
                    yData: yData
                };
            }
        });
        /**
         * A price envelopes indicator. If the [type](#series.priceenvelopes.type)
         * option is not specified, it is inherited from [chart.type](#chart.type).
         *
         * @extends   series,plotOptions.priceenvelopes
         * @since     6.0.0
         * @excluding dataParser, dataURL
         * @product   highstock
         * @requires  stock/indicators/indicators
         * @requires  stock/indicators/price-envelopes
         * @apioption series.priceenvelopes
         */
        ''; // to include the above in the js output

    });
    _registerModule(_modules, 'masters/indicators/price-envelopes.src.js', [], function () {


    });
}));