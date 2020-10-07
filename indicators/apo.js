/*
 Highstock JS v8.2.0 (2020-10-07)

 Indicator series type for Highstock

 (c) 2010-2019 Wojciech Chmiel

 License: www.highcharts.com/license
*/
(function(a){"object"===typeof module&&module.exports?(a["default"]=a,module.exports=a):"function"===typeof define&&define.amd?define("highcharts/indicators/apo",["highcharts","highcharts/modules/stock"],function(e){a(e);a.Highcharts=e;return a}):a("undefined"!==typeof Highcharts?Highcharts:void 0)})(function(a){function e(a,b,l,g){a.hasOwnProperty(b)||(a[b]=g.apply(null,l))}a=a?a._modules:{};e(a,"Mixins/IndicatorRequired.js",[a["Core/Utilities.js"]],function(a){var b=a.error;return{isParentLoaded:function(a,
g,f,c,d){if(a)return c?c(a):!0;b(d||this.generateMessage(f,g));return!1},generateMessage:function(a,b){return'Error: "'+a+'" indicator type requires "'+b+'" indicator loaded before. Please read docs: https://api.highcharts.com/highstock/plotOptions.'+a}}});e(a,"Stock/Indicators/EMAIndicator.js",[a["Core/Series/Series.js"],a["Core/Utilities.js"]],function(a,b){var e=b.correctFloat,g=b.isArray;a.seriesType("ema","sma",{params:{index:3,period:9}},{accumulatePeriodPoints:function(a,c,d){for(var k=0,f=
0,b;f<a;)b=0>c?d[f]:d[f][c],k+=b,f++;return k},calculateEma:function(a,c,d,k,b,g,p){a=a[d-1];c=0>g?c[d-1]:c[d-1][g];k="undefined"===typeof b?p:e(c*k+b*(1-k));return[a,k]},getValues:function(a,c){var d=c.period,k=a.xData,b=(a=a.yData)?a.length:0,f=2/(d+1),e=[],h=[],n=[],l=-1;if(!(b<d)){g(a[0])&&(l=c.index?c.index:0);c=this.accumulatePeriodPoints(d,l,a);for(c/=d;d<b+1;d++){var m=this.calculateEma(k,a,d,f,m,l,c);e.push(m);h.push(m[0]);n.push(m[1]);m=m[1]}return{values:e,xData:h,yData:n}}}});""});e(a,
"Stock/Indicators/APOIndicator.js",[a["Core/Series/Series.js"],a["Mixins/IndicatorRequired.js"],a["Core/Utilities.js"]],function(a,b,e){var g=e.error,f=a.seriesTypes.ema;a.seriesType("apo","ema",{params:{periods:[10,20]}},{nameBase:"APO",nameComponents:["periods"],init:function(){var a=arguments,d=this;b.isParentLoaded(f,"ema",d.type,function(c){c.prototype.init.apply(d,a)})},getValues:function(a,d){var b=d.periods,c=d.index;d=[];var e=[],l=[],h;if(2!==b.length||b[1]<=b[0])g('Error: "APO requires two periods. Notice, first period should be lower than the second one."');
else{var n=f.prototype.getValues.call(this,a,{index:c,period:b[0]});a=f.prototype.getValues.call(this,a,{index:c,period:b[1]});if(n&&a){b=b[1]-b[0];for(h=0;h<a.yData.length;h++)c=n.yData[h+b]-a.yData[h],d.push([a.xData[h],c]),e.push(a.xData[h]),l.push(c);return{values:d,xData:e,yData:l}}}}});""});e(a,"masters/indicators/apo.src.js",[],function(){})});
//# sourceMappingURL=apo.js.map