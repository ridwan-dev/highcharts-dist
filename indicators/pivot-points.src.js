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
        define('highcharts/indicators/pivot-points', ['highcharts', 'highcharts/modules/stock'], function (Highcharts) {
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
    _registerModule(_modules, 'Stock/Indicators/PivotPointsIndicator.js', [_modules['Core/Series/Series.js'], _modules['Core/Utilities.js']], function (BaseSeries, U) {
        /* *
         *
         *  License: www.highcharts.com/license
         *
         *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
         *
         * */
        var defined = U.defined,
            isArray = U.isArray;
        var SMA = BaseSeries.seriesTypes.sma;
        /* eslint-disable valid-jsdoc */
        /**
         * @private
         */
        function destroyExtraLabels(point, functionName) {
            var props = point.series.pointArrayMap,
                prop,
                i = props.length;
            SMA.prototype.pointClass.prototype[functionName].call(point);
            while (i--) {
                prop = 'dataLabel' + props[i];
                // S4 dataLabel could be removed by parent method:
                if (point[prop] && point[prop].element) {
                    point[prop].destroy();
                }
                point[prop] = null;
            }
        }
        /* eslint-enable valid-jsdoc */
        /**
         * The Pivot Points series type.
         *
         * @private
         * @class
         * @name Highcharts.seriesTypes.pivotpoints
         *
         * @augments Highcharts.Series
         */
        BaseSeries.seriesType('pivotpoints', 'sma', 
        /**
         * Pivot points indicator. This series requires the `linkedTo` option to be
         * set and should be loaded after `stock/indicators/indicators.js` file.
         *
         * @sample stock/indicators/pivot-points
         *         Pivot points
         *
         * @extends      plotOptions.sma
         * @since        6.0.0
         * @product      highstock
         * @requires     stock/indicators/indicators
         * @requires     stock/indicators/pivotpoints
         * @optionparent plotOptions.pivotpoints
         */
        {
            /**
             * @excluding index
             */
            params: {
                period: 28,
                /**
                 * Algorithm used to calculate ressistance and support lines based
                 * on pivot points. Implemented algorithms: `'standard'`,
                 * `'fibonacci'` and `'camarilla'`
                 */
                algorithm: 'standard'
            },
            marker: {
                enabled: false
            },
            enableMouseTracking: false,
            dataLabels: {
                enabled: true,
                format: '{point.pivotLine}'
            },
            dataGrouping: {
                approximation: 'averages'
            }
        }, 
        /**
         * @lends Highcharts.Series#
         */
        {
            nameBase: 'Pivot Points',
            pointArrayMap: ['R4', 'R3', 'R2', 'R1', 'P', 'S1', 'S2', 'S3', 'S4'],
            pointValKey: 'P',
            toYData: function (point) {
                return [point.P]; // The rest should not affect extremes
            },
            translate: function () {
                var indicator = this;
                SMA.prototype.translate.apply(indicator);
                indicator.points.forEach(function (point) {
                    indicator.pointArrayMap.forEach(function (value) {
                        if (defined(point[value])) {
                            point['plot' + value] = (indicator.yAxis.toPixels(point[value], true));
                        }
                    });
                });
                // Pivot points are rendered as horizontal lines
                // And last point start not from the next one (as it's the last one)
                // But from the approximated last position in a given range
                indicator.plotEndPoint = indicator.xAxis.toPixels(indicator.endPoint, true);
            },
            getGraphPath: function (points) {
                var indicator = this,
                    pointsLength = points.length,
                    allPivotPoints = ([[],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    []]),
                    path = [],
                    endPoint = indicator.plotEndPoint,
                    pointArrayMapLength = indicator.pointArrayMap.length,
                    position,
                    point,
                    i;
                while (pointsLength--) {
                    point = points[pointsLength];
                    for (i = 0; i < pointArrayMapLength; i++) {
                        position = indicator.pointArrayMap[i];
                        if (defined(point[position])) {
                            allPivotPoints[i].push({
                                // Start left:
                                plotX: point.plotX,
                                plotY: point['plot' + position],
                                isNull: false
                            }, {
                                // Go to right:
                                plotX: endPoint,
                                plotY: point['plot' + position],
                                isNull: false
                            }, {
                                // And add null points in path to generate breaks:
                                plotX: endPoint,
                                plotY: null,
                                isNull: true
                            });
                        }
                    }
                    endPoint = point.plotX;
                }
                allPivotPoints.forEach(function (pivotPoints) {
                    path = path.concat(SMA.prototype.getGraphPath.call(indicator, pivotPoints));
                });
                return path;
            },
            // TODO: Rewrite this logic to use multiple datalabels
            drawDataLabels: function () {
                var indicator = this,
                    pointMapping = indicator.pointArrayMap,
                    currentLabel,
                    pointsLength,
                    point,
                    i;
                if (indicator.options.dataLabels.enabled) {
                    pointsLength = indicator.points.length;
                    // For every Ressitance/Support group we need to render labels.
                    // Add one more item, which will just store dataLabels from
                    // previous iteration
                    pointMapping.concat([false]).forEach(function (position, k) {
                        i = pointsLength;
                        while (i--) {
                            point = indicator.points[i];
                            if (!position) {
                                // Store S4 dataLabel too:
                                point['dataLabel' + pointMapping[k - 1]] =
                                    point.dataLabel;
                            }
                            else {
                                point.y = point[position];
                                point.pivotLine = position;
                                point.plotY = point['plot' + position];
                                currentLabel = point['dataLabel' + position];
                                // Store previous label
                                if (k) {
                                    point['dataLabel' + pointMapping[k - 1]] = point.dataLabel;
                                }
                                if (!point.dataLabels) {
                                    point.dataLabels = [];
                                }
                                point.dataLabels[0] = point.dataLabel =
                                    currentLabel =
                                        currentLabel && currentLabel.element ?
                                            currentLabel :
                                            null;
                            }
                        }
                        SMA.prototype.drawDataLabels.apply(indicator, arguments);
                    });
                }
            },
            getValues: function (series, params) {
                var period = params.period,
                    xVal = series.xData,
                    yVal = series.yData,
                    yValLen = yVal ? yVal.length : 0,
                    placement = this[params.algorithm + 'Placement'], 
                    // 0- from, 1- to, 2- R1, 3- R2, 4- pivot, 5- S1 etc.
                    PP = [],
                    endTimestamp,
                    xData = [],
                    yData = [],
                    slicedXLen,
                    slicedX,
                    slicedY,
                    lastPP,
                    pivot,
                    avg,
                    i;
                // Pivot Points requires high, low and close values
                if (xVal.length < period ||
                    !isArray(yVal[0]) ||
                    yVal[0].length !== 4) {
                    return;
                }
                for (i = period + 1; i <= yValLen + period; i += period) {
                    slicedX = xVal.slice(i - period - 1, i);
                    slicedY = yVal.slice(i - period - 1, i);
                    slicedXLen = slicedX.length;
                    endTimestamp = slicedX[slicedXLen - 1];
                    pivot = this.getPivotAndHLC(slicedY);
                    avg = placement(pivot);
                    lastPP = PP.push([endTimestamp]
                        .concat(avg));
                    xData.push(endTimestamp);
                    yData.push(PP[lastPP - 1].slice(1));
                }
                // We don't know exact position in ordinal axis
                // So we use simple logic:
                // Get first point in last range, calculate visible average range
                // and multiply by period
                this.endPoint = slicedX[0] + ((endTimestamp - slicedX[0]) /
                    slicedXLen) * period;
                return {
                    values: PP,
                    xData: xData,
                    yData: yData
                };
            },
            getPivotAndHLC: function (values) {
                var high = -Infinity,
                    low = Infinity,
                    close = values[values.length - 1][3],
                    pivot;
                values.forEach(function (p) {
                    high = Math.max(high, p[1]);
                    low = Math.min(low, p[2]);
                });
                pivot = (high + low + close) / 3;
                return [pivot, high, low, close];
            },
            standardPlacement: function (values) {
                var diff = values[1] - values[2],
                    avg = [
                        null,
                        null,
                        values[0] + diff,
                        values[0] * 2 - values[2],
                        values[0],
                        values[0] * 2 - values[1],
                        values[0] - diff,
                        null,
                        null
                    ];
                return avg;
            },
            camarillaPlacement: function (values) {
                var diff = values[1] - values[2],
                    avg = [
                        values[3] + diff * 1.5,
                        values[3] + diff * 1.25,
                        values[3] + diff * 1.1666,
                        values[3] + diff * 1.0833,
                        values[0],
                        values[3] - diff * 1.0833,
                        values[3] - diff * 1.1666,
                        values[3] - diff * 1.25,
                        values[3] - diff * 1.5
                    ];
                return avg;
            },
            fibonacciPlacement: function (values) {
                var diff = values[1] - values[2],
                    avg = [
                        null,
                        values[0] + diff,
                        values[0] + diff * 0.618,
                        values[0] + diff * 0.382,
                        values[0],
                        values[0] - diff * 0.382,
                        values[0] - diff * 0.618,
                        values[0] - diff,
                        null
                    ];
                return avg;
            }
        }, 
        /**
         * @lends Highcharts.Point#
         */
        {
            // Destroy labels:
            // This method is called when cropping data:
            destroyElements: function () {
                destroyExtraLabels(this, 'destroyElements');
            },
            // This method is called when removing points, e.g. series.update()
            destroy: function () {
                destroyExtraLabels(this, 'destroyElements');
            }
        });
        /**
         * A pivot points indicator. If the [type](#series.pivotpoints.type) option is
         * not specified, it is inherited from [chart.type](#chart.type).
         *
         * @extends   series,plotOptions.pivotpoints
         * @since     6.0.0
         * @product   highstock
         * @excluding dataParser, dataURL
         * @requires  stock/indicators/indicators
         * @requires  stock/indicators/pivotpoints
         * @apioption series.pivotpoints
         */
        ''; // to include the above in the js output'

    });
    _registerModule(_modules, 'masters/indicators/pivot-points.src.js', [], function () {


    });
}));