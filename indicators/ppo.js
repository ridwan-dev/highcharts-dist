/*
 Highstock JS v8.2.0 (2020-10-07)

 Indicator series type for Highstock

 (c) 2010-2019 Wojciech Chmiel

 License: www.highcharts.com/license
*/
(function(a){"object"===typeof module&&module.exports?(a["default"]=a,module.exports=a):"function"===typeof define&&define.amd?define("highcharts/indicators/ppo",["highcharts","highcharts/modules/stock"],function(f){a(f);a.Highcharts=f;return a}):a("undefined"!==typeof Highcharts?Highcharts:void 0)})(function(a){function f(a,e,p,k){a.hasOwnProperty(e)||(a[e]=k.apply(null,p))}a=a?a._modules:{};f(a,"Mixins/IndicatorRequired.js",[a["Core/Utilities.js"]],function(a){var e=a.error;return{isParentLoaded:function(a,
k,l,c,b){if(a)return c?c(a):!0;e(b||this.generateMessage(l,k));return!1},generateMessage:function(a,e){return'Error: "'+a+'" indicator type requires "'+e+'" indicator loaded before. Please read docs: https://api.highcharts.com/highstock/plotOptions.'+a}}});f(a,"Stock/Indicators/EMAIndicator.js",[a["Core/Series/Series.js"],a["Core/Utilities.js"]],function(a,e){var f=e.correctFloat,k=e.isArray;a.seriesType("ema","sma",{params:{index:3,period:9}},{accumulatePeriodPoints:function(a,c,b){for(var g=0,d=
0,l;d<a;)l=0>c?b[d]:b[d][c],g+=l,d++;return g},calculateEma:function(a,c,b,g,d,e,k){a=a[b-1];c=0>e?c[b-1]:c[b-1][e];g="undefined"===typeof d?k:f(c*g+d*(1-g));return[a,g]},getValues:function(a,c){var b=c.period,g=a.xData,d=(a=a.yData)?a.length:0,e=2/(b+1),f=[],l=[],h=[],m=-1;if(!(d<b)){k(a[0])&&(m=c.index?c.index:0);c=this.accumulatePeriodPoints(b,m,a);for(c/=b;b<d+1;b++){var n=this.calculateEma(g,a,b,e,n,m,c);f.push(n);l.push(n[0]);h.push(n[1]);n=n[1]}return{values:f,xData:l,yData:h}}}});""});f(a,
"Stock/Indicators/PPOIndicator.js",[a["Core/Globals.js"],a["Mixins/IndicatorRequired.js"],a["Core/Utilities.js"]],function(a,e,f){var k=f.correctFloat,l=f.error,c=a.seriesTypes.ema;a.seriesType("ppo","ema",{params:{periods:[12,26]}},{nameBase:"PPO",nameComponents:["periods"],init:function(){var a=arguments,g=this;e.isParentLoaded(c,"ema",g.type,function(b){b.prototype.init.apply(g,a)})},getValues:function(a,g){var d=g.periods,b=g.index;g=[];var e=[],f=[],h;if(2!==d.length||d[1]<=d[0])l('Error: "PPO requires two periods. Notice, first period should be lower than the second one."');
else{var m=c.prototype.getValues.call(this,a,{index:b,period:d[0]});a=c.prototype.getValues.call(this,a,{index:b,period:d[1]});if(m&&a){d=d[1]-d[0];for(h=0;h<a.yData.length;h++)b=k((m.yData[h+d]-a.yData[h])/a.yData[h]*100),g.push([a.xData[h],b]),e.push(a.xData[h]),f.push(b);return{values:g,xData:e,yData:f}}}}});""});f(a,"masters/indicators/ppo.src.js",[],function(){})});
//# sourceMappingURL=ppo.js.map