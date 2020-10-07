/*
 Highstock JS v8.2.0 (2020-10-07)

 Indicator series type for Highstock

 (c) 2010-2019 Rafa Sebestjaski

 License: www.highcharts.com/license
*/
(function(a){"object"===typeof module&&module.exports?(a["default"]=a,module.exports=a):"function"===typeof define&&define.amd?define("highcharts/indicators/dema",["highcharts","highcharts/modules/stock"],function(g){a(g);a.Highcharts=g;return a}):a("undefined"!==typeof Highcharts?Highcharts:void 0)})(function(a){function g(a,c,r,m){a.hasOwnProperty(c)||(a[c]=m.apply(null,r))}a=a?a._modules:{};g(a,"Mixins/IndicatorRequired.js",[a["Core/Utilities.js"]],function(a){var c=a.error;return{isParentLoaded:function(a,
m,h,e,b){if(a)return e?e(a):!0;c(b||this.generateMessage(h,m));return!1},generateMessage:function(a,c){return'Error: "'+a+'" indicator type requires "'+c+'" indicator loaded before. Please read docs: https://api.highcharts.com/highstock/plotOptions.'+a}}});g(a,"Stock/Indicators/EMAIndicator.js",[a["Core/Series/Series.js"],a["Core/Utilities.js"]],function(a,c){var g=c.correctFloat,m=c.isArray;a.seriesType("ema","sma",{params:{index:3,period:9}},{accumulatePeriodPoints:function(a,e,b){for(var d=0,f=
0,h;f<a;)h=0>e?b[f]:b[f][e],d+=h,f++;return d},calculateEma:function(a,e,b,d,f,c,z){a=a[b-1];e=0>c?e[b-1]:e[b-1][c];d="undefined"===typeof f?z:g(e*d+f*(1-d));return[a,d]},getValues:function(a,e){var b=e.period,d=a.xData,f=(a=a.yData)?a.length:0,c=2/(b+1),g=[],q=[],h=[],n=-1;if(!(f<b)){m(a[0])&&(n=e.index?e.index:0);e=this.accumulatePeriodPoints(b,n,a);for(e/=b;b<f+1;b++){var k=this.calculateEma(d,a,b,c,k,n,e);g.push(k);q.push(k[0]);h.push(k[1]);k=k[1]}return{values:g,xData:q,yData:h}}}});""});g(a,
"Stock/Indicators/DEMAIndicator.js",[a["Core/Series/Series.js"],a["Mixins/IndicatorRequired.js"],a["Core/Utilities.js"]],function(a,c,g){var m=g.correctFloat,h=g.isArray,e=a.seriesTypes.ema;a.seriesType("dema","ema",{},{init:function(){var a=arguments,d=this;c.isParentLoaded(e,"ema",d.type,function(b){b.prototype.init.apply(d,a)})},getEMA:function(a,d,f,c,g,q){return e.prototype.calculateEma(q||[],a,"undefined"===typeof g?1:g,this.chart.series[0].EMApercent,d,"undefined"===typeof c?-1:c,f)},getValues:function(a,
d){var f=d.period,c=2*f,g=a.xData,b=a.yData,t=b?b.length:0,n=-1,k=[],v=[],w=[],p=0,x=[],l;a.EMApercent=2/(f+1);if(!(t<2*f-1)){h(b[0])&&(n=d.index?d.index:0);a=e.prototype.accumulatePeriodPoints(f,n,b);d=a/f;a=0;for(l=f;l<t+2;l++){l<t+1&&(p=this.getEMA(b,r,d,n,l)[1],x.push(p));var r=p;if(l<c)a+=p;else{l===c&&(d=a/f);p=x[l-f-1];var y=this.getEMA([p],y,d)[1];var u=[g[l-2],m(2*p-y)];k.push(u);v.push(u[0]);w.push(u[1])}}return{values:k,xData:v,yData:w}}}});""});g(a,"masters/indicators/dema.src.js",[],
function(){})});
//# sourceMappingURL=dema.js.map