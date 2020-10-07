/**
 * @license Highstock JS v8.2.0 (2020-10-07)
 *
 * Indicator series type for Highstock
 *
 * (c) 2010-2019 Rafal Sebestjanski
 *
 * License: www.highcharts.com/license
 */
'use strict';
(function (factory) {
    if (typeof module === 'object' && module.exports) {
        factory['default'] = factory;
        module.exports = factory;
    } else if (typeof define === 'function' && define.amd) {
        define('highcharts/indicators/trix', ['highcharts', 'highcharts/modules/stock'], function (Highcharts) {
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
    _registerModule(_modules, 'Stock/Indicators/TEMAIndicator.js', [_modules['Core/Series/Series.js'], _modules['Mixins/IndicatorRequired.js'], _modules['Core/Utilities.js']], function (BaseSeries, RequiredIndicatorMixin, U) {
        /* *
         *
         *  License: www.highcharts.com/license
         *
         *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
         *
         * */
        var correctFloat = U.correctFloat,
            isArray = U.isArray;
        var EMAindicator = BaseSeries.seriesTypes.ema;
        /**
         * The TEMA series type.
         *
         * @private
         * @class
         * @name Highcharts.seriesTypes.tema
         *
         * @augments Highcharts.Series
         */
        BaseSeries.seriesType('tema', 'ema', 
        /**
         * Triple exponential moving average (TEMA) indicator. This series requires
         * `linkedTo` option to be set and should be loaded after the
         * `stock/indicators/indicators.js` and `stock/indicators/ema.js`.
         *
         * @sample {highstock} stock/indicators/tema
         *         TEMA indicator
         *
         * @extends      plotOptions.ema
         * @since        7.0.0
         * @product      highstock
         * @excluding    allAreas, colorAxis, compare, compareBase, joinBy, keys,
         *               navigatorOptions, pointInterval, pointIntervalUnit,
         *               pointPlacement, pointRange, pointStart, showInNavigator,
         *               stacking
         * @requires     stock/indicators/indicators
         * @requires     stock/indicators/ema
         * @requires     stock/indicators/tema
         * @optionparent plotOptions.tema
         */
        {}, 
        /**
         * @lends Highcharts.Series#
         */
        {
            init: function () {
                var args = arguments,
                    ctx = this;
                RequiredIndicatorMixin.isParentLoaded(EMAindicator, 'ema', ctx.type, function (indicator) {
                    indicator.prototype.init.apply(ctx, args);
                    return;
                });
            },
            getEMA: function (yVal, prevEMA, SMA, index, i, xVal) {
                return EMAindicator.prototype.calculateEma(xVal || [], yVal, typeof i === 'undefined' ? 1 : i, this.chart.series[0].EMApercent, prevEMA, typeof index === 'undefined' ? -1 : index, SMA);
            },
            getTemaPoint: function (xVal, tripledPeriod, EMAlevels, i) {
                var TEMAPoint = [
                        xVal[i - 3],
                        correctFloat(3 * EMAlevels.level1 -
                            3 * EMAlevels.level2 + EMAlevels.level3)
                    ];
                return TEMAPoint;
            },
            getValues: function (series, params) {
                var period = params.period,
                    doubledPeriod = 2 * period,
                    tripledPeriod = 3 * period,
                    xVal = series.xData,
                    yVal = series.yData,
                    yValLen = yVal ? yVal.length : 0,
                    index = -1,
                    accumulatePeriodPoints = 0,
                    SMA = 0,
                    TEMA = [],
                    xDataTema = [],
                    yDataTema = [], 
                    // EMA of previous point
                    prevEMA,
                    prevEMAlevel2, 
                    // EMA values array
                    EMAvalues = [],
                    EMAlevel2values = [],
                    i,
                    TEMAPoint, 
                    // This object contains all EMA EMAlevels calculated like below
                    // EMA = level1
                    // EMA(EMA) = level2,
                    // EMA(EMA(EMA)) = level3,
                    EMAlevels = {};
                series.EMApercent = (2 / (period + 1));
                // Check period, if bigger than EMA points length, skip
                if (yValLen < 3 * period - 2) {
                    return;
                }
                // Switch index for OHLC / Candlestick / Arearange
                if (isArray(yVal[0])) {
                    index = params.index ? params.index : 0;
                }
                // Accumulate first N-points
                accumulatePeriodPoints =
                    EMAindicator.prototype.accumulatePeriodPoints(period, index, yVal);
                // first point
                SMA = accumulatePeriodPoints / period;
                accumulatePeriodPoints = 0;
                // Calculate value one-by-one for each period in visible data
                for (i = period; i < yValLen + 3; i++) {
                    if (i < yValLen + 1) {
                        EMAlevels.level1 = this.getEMA(yVal, prevEMA, SMA, index, i)[1];
                        EMAvalues.push(EMAlevels.level1);
                    }
                    prevEMA = EMAlevels.level1;
                    // Summing first period points for ema(ema)
                    if (i < doubledPeriod) {
                        accumulatePeriodPoints += EMAlevels.level1;
                    }
                    else {
                        // Calculate dema
                        // First dema point
                        if (i === doubledPeriod) {
                            SMA = accumulatePeriodPoints / period;
                            accumulatePeriodPoints = 0;
                        }
                        EMAlevels.level1 = EMAvalues[i - period - 1];
                        EMAlevels.level2 = this.getEMA([EMAlevels.level1], prevEMAlevel2, SMA)[1];
                        EMAlevel2values.push(EMAlevels.level2);
                        prevEMAlevel2 = EMAlevels.level2;
                        // Summing first period points for ema(ema(ema))
                        if (i < tripledPeriod) {
                            accumulatePeriodPoints += EMAlevels.level2;
                        }
                        else {
                            // Calculate tema
                            // First tema point
                            if (i === tripledPeriod) {
                                SMA = accumulatePeriodPoints / period;
                            }
                            if (i === yValLen + 1) {
                                // Calculate the last ema and emaEMA points
                                EMAlevels.level1 = EMAvalues[i - period - 1];
                                EMAlevels.level2 = this.getEMA([EMAlevels.level1], prevEMAlevel2, SMA)[1];
                                EMAlevel2values.push(EMAlevels.level2);
                            }
                            EMAlevels.level1 = EMAvalues[i - period - 2];
                            EMAlevels.level2 = EMAlevel2values[i - 2 * period - 1];
                            EMAlevels.level3 = this.getEMA([EMAlevels.level2], EMAlevels.prevLevel3, SMA)[1];
                            TEMAPoint = this.getTemaPoint(xVal, tripledPeriod, EMAlevels, i);
                            // Make sure that point exists (for TRIX oscillator)
                            if (TEMAPoint) {
                                TEMA.push(TEMAPoint);
                                xDataTema.push(TEMAPoint[0]);
                                yDataTema.push(TEMAPoint[1]);
                            }
                            EMAlevels.prevLevel3 = EMAlevels.level3;
                        }
                    }
                }
                return {
                    values: TEMA,
                    xData: xDataTema,
                    yData: yDataTema
                };
            }
        });
        /**
         * A `TEMA` series. If the [type](#series.ema.type) option is not
         * specified, it is inherited from [chart.type](#chart.type).
         *
         * @extends   series,plotOptions.ema
         * @since     7.0.0
         * @product   highstock
         * @excluding allAreas, colorAxis, compare, compareBase, dataParser, dataURL,
         *            joinBy, keys, navigatorOptions, pointInterval, pointIntervalUnit,
         *            pointPlacement, pointRange, pointStart, showInNavigator, stacking
         * @requires  stock/indicators/indicators
         * @requires  stock/indicators/ema
         * @requires  stock/indicators/tema
         * @apioption series.tema
         */
        ''; // to include the above in the js output

    });
    _registerModule(_modules, 'Stock/Indicators/TRIXIndicator.js', [_modules['Core/Series/Series.js'], _modules['Mixins/IndicatorRequired.js'], _modules['Core/Utilities.js']], function (BaseSeries, RequiredIndicatorMixin, U) {
        /* *
         *
         *  License: www.highcharts.com/license
         *
         *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
         *
         * */
        var correctFloat = U.correctFloat;
        var TEMA = BaseSeries.seriesTypes.tema;
        /**
         * The TRIX series type.
         *
         * @private
         * @class
         * @name Highcharts.seriesTypes.trix
         *
         * @augments Highcharts.Series
         */
        BaseSeries.seriesType('trix', 'tema', 
        /**
         * Triple exponential average (TRIX) oscillator. This series requires
         * `linkedTo` option to be set.
         *
         * Requires https://code.highcharts.com/stock/indicators/ema.js
         * and https://code.highcharts.com/stock/indicators/tema.js.
         *
         * @sample {highstock} stock/indicators/trix
         *         TRIX indicator
         *
         * @extends      plotOptions.tema
         * @since        7.0.0
         * @product      highstock
         * @excluding    allAreas, colorAxis, compare, compareBase, joinBy, keys,
         *               navigatorOptions, pointInterval, pointIntervalUnit,
         *               pointPlacement, pointRange, pointStart, showInNavigator,
         *               stacking
         * @optionparent plotOptions.trix
         */
        {}, 
        /**
         * @lends Highcharts.Series#
         */
        {
            init: function () {
                var args = arguments,
                    ctx = this;
                RequiredIndicatorMixin.isParentLoaded(TEMA, 'tema', ctx.type, function (indicator) {
                    indicator.prototype.init.apply(ctx, args);
                    return;
                });
            },
            // TRIX is calculated using TEMA so we just extend getTemaPoint method.
            getTemaPoint: function (xVal, tripledPeriod, EMAlevels, i) {
                if (i > tripledPeriod) {
                    var TRIXPoint = [
                            xVal[i - 3],
                            EMAlevels.prevLevel3 !== 0 ?
                                correctFloat(EMAlevels.level3 - EMAlevels.prevLevel3) /
                                    EMAlevels.prevLevel3 * 100 : null
                        ];
                }
                return TRIXPoint;
            }
        });
        /**
         * A `TRIX` series. If the [type](#series.tema.type) option is not specified, it
         * is inherited from [chart.type](#chart.type).
         *
         * @extends   series,plotOptions.tema
         * @since     7.0.0
         * @product   highstock
         * @excluding allAreas, colorAxis, compare, compareBase, dataParser, dataURL,
         *            joinBy, keys, navigatorOptions, pointInterval, pointIntervalUnit,
         *            pointPlacement, pointRange, pointStart, showInNavigator, stacking
         * @apioption series.trix
         */
        ''; // to include the above in the js output

    });
    _registerModule(_modules, 'masters/indicators/trix.src.js', [], function () {


    });
}));