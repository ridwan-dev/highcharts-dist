/*
 Highstock JS v8.2.0 (2020-10-07)

 Slow Stochastic series type for Highstock

 (c) 2010-2019 Pawel Fus

 License: www.highcharts.com/license
*/
(function(a){"object"===typeof module&&module.exports?(a["default"]=a,module.exports=a):"function"===typeof define&&define.amd?define("highcharts/indicators/indicators",["highcharts","highcharts/modules/stock"],function(h){a(h);a.Highcharts=h;return a}):a("undefined"!==typeof Highcharts?Highcharts:void 0)})(function(a){function h(a,d,n,b){a.hasOwnProperty(d)||(a[d]=b.apply(null,n))}a=a?a._modules:{};h(a,"Mixins/IndicatorRequired.js",[a["Core/Utilities.js"]],function(a){var d=a.error;return{isParentLoaded:function(a,
b,e,g,k){if(a)return g?g(a):!0;d(k||this.generateMessage(e,b));return!1},generateMessage:function(a,b){return'Error: "'+a+'" indicator type requires "'+b+'" indicator loaded before. Please read docs: https://api.highcharts.com/highstock/plotOptions.'+a}}});h(a,"Mixins/MultipleLines.js",[a["Core/Globals.js"],a["Core/Utilities.js"]],function(a,d){var n=d.defined,b=d.error,e=d.merge,g=a.seriesTypes.sma;return{pointArrayMap:["top","bottom"],pointValKey:"top",linesApiNames:["bottomLine"],getTranslatedLinesNames:function(a){var k=
[];(this.pointArrayMap||[]).forEach(function(b){b!==a&&k.push("plot"+b.charAt(0).toUpperCase()+b.slice(1))});return k},toYData:function(a){var k=[];(this.pointArrayMap||[]).forEach(function(b){k.push(a[b])});return k},translate:function(){var a=this,b=a.pointArrayMap,e=[],d;e=a.getTranslatedLinesNames();g.prototype.translate.apply(a,arguments);a.points.forEach(function(k){b.forEach(function(b,g){d=k[b];null!==d&&(k[e[g]]=a.yAxis.toPixels(d,!0))})})},drawGraph:function(){var a=this,d=a.linesApiNames,
m=a.points,l=m.length,p=a.options,h=a.graph,q={options:{gapSize:p.gapSize}},r=[],f;a.getTranslatedLinesNames(a.pointValKey).forEach(function(a,b){for(r[b]=[];l--;)f=m[l],r[b].push({x:f.x,plotX:f.plotX,plotY:f[a],isNull:!n(f[a])});l=m.length});d.forEach(function(f,d){r[d]?(a.points=r[d],p[f]?a.options=e(p[f].styles,q):b('Error: "There is no '+f+' in DOCS options declared. Check if linesApiNames are consistent with your DOCS line names." at mixin/multiple-line.js:34'),a.graph=a["graph"+f],g.prototype.drawGraph.call(a),
a["graph"+f]=a.graph):b('Error: "'+f+" doesn't have equivalent in pointArrayMap. To many elements in linesApiNames relative to pointArrayMap.\"")});a.points=m;a.options=p;a.graph=h;g.prototype.drawGraph.call(a)}}});h(a,"Mixins/ReduceArray.js",[],function(){return{minInArray:function(a,d){return a.reduce(function(a,b){return Math.min(a,b[d])},Number.MAX_VALUE)},maxInArray:function(a,d){return a.reduce(function(a,b){return Math.max(a,b[d])},-Number.MAX_VALUE)},getArrayExtremes:function(a,d,n){return a.reduce(function(a,
e){return[Math.min(a[0],e[d]),Math.max(a[1],e[n])]},[Number.MAX_VALUE,-Number.MAX_VALUE])}}});h(a,"Stock/Indicators/SMAIndicator.js",[a["Core/Series/Series.js"],a["Core/Globals.js"],a["Mixins/IndicatorRequired.js"],a["Core/Utilities.js"]],function(a,d,n,b){var e=a.seriesTypes,g=b.addEvent,k=b.error,h=b.extend,m=b.isArray,l=b.pick,p=b.splat,v=d.Series,q=e.ohlc.prototype,r=n.generateMessage;g(d.Series,"init",function(a){a=a.options;a.useOhlcData&&"highcharts-navigator-series"!==a.id&&h(this,{pointValKey:q.pointValKey,
keys:q.keys,pointArrayMap:q.pointArrayMap,toYData:q.toYData})});g(v,"afterSetOptions",function(a){a=a.options;var b=a.dataGrouping;b&&a.useOhlcData&&"highcharts-navigator-series"!==a.id&&(b.approximation="ohlc")});a.seriesType("sma","line",{name:void 0,tooltip:{valueDecimals:4},linkedTo:void 0,compareToMain:!1,params:{index:0,period:14}},{processData:function(){var a=this.options.compareToMain,b=this.linkedParent;v.prototype.processData.apply(this,arguments);b&&b.compareValue&&a&&(this.compareValue=
b.compareValue)},bindTo:{series:!0,eventName:"updatedData"},hasDerivedData:!0,useCommonDataGrouping:!0,nameComponents:["period"],nameSuffixes:[],calculateOn:"init",requiredIndicators:[],requireIndicators:function(){var a={allLoaded:!0};this.requiredIndicators.forEach(function(b){e[b]?e[b].prototype.requireIndicators():(a.allLoaded=!1,a.needed=b)});return a},init:function(a,b){function f(){var a=c.points||[],b=(c.xData||[]).length,f=c.getValues(c.linkedParent,c.options.params)||{values:[],xData:[],
yData:[]},e=[],d=!0;if(b&&!c.hasGroupedData&&c.visible&&c.points)if(c.cropped){if(c.xAxis){var g=c.xAxis.min;var k=c.xAxis.max}b=c.cropData(f.xData,f.yData,g,k);for(g=0;g<b.xData.length;g++)e.push([b.xData[g]].concat(p(b.yData[g])));b=f.xData.indexOf(c.xData[0]);g=f.xData.indexOf(c.xData[c.xData.length-1]);-1===b&&g===f.xData.length-2&&e[0][0]===a[0].x&&e.shift();c.updateData(e)}else f.xData.length!==b-1&&f.xData.length!==b+1&&(d=!1,c.updateData(f.values));d&&(c.xData=f.xData,c.yData=f.yData,c.options.data=
f.values);!1===c.bindTo.series&&(delete c.processedXData,c.isDirty=!0,c.redraw());c.isDirtyData=!1}var c=this,e=c.requireIndicators();if(!e.allLoaded)return k(r(c.type,e.needed));v.prototype.init.call(c,a,b);a.linkSeries();c.dataEventsToUnbind=[];if(!c.linkedParent)return k("Series "+c.options.linkedTo+" not found! Check `linkedTo`.",!1,a);c.dataEventsToUnbind.push(g(c.bindTo.series?c.linkedParent:c.linkedParent.xAxis,c.bindTo.eventName,f));if("init"===c.calculateOn)f();else var d=g(c.chart,c.calculateOn,
function(){f();d()});return c},getName:function(){var a=this.name,b=[];a||((this.nameComponents||[]).forEach(function(a,c){b.push(this.options.params[a]+l(this.nameSuffixes[c],""))},this),a=(this.nameBase||this.type.toUpperCase())+(this.nameComponents?" ("+b.join(", ")+")":""));return a},getValues:function(a,b){var e=b.period,c=a.xData;a=a.yData;var d=a.length,f=0,g=0,k=[],h=[],n=[],l=-1;if(!(c.length<e)){for(m(a[0])&&(l=b.index?b.index:0);f<e-1;)g+=0>l?a[f]:a[f][l],f++;for(b=f;b<d;b++){g+=0>l?a[b]:
a[b][l];var p=[c[b],g/e];k.push(p);h.push(p[0]);n.push(p[1]);g-=0>l?a[b-f]:a[b-f][l]}return{values:k,xData:h,yData:n}}},destroy:function(){this.dataEventsToUnbind.forEach(function(a){a()});v.prototype.destroy.apply(this,arguments)}});""});h(a,"Stock/Indicators/StochasticIndicator.js",[a["Core/Series/Series.js"],a["Mixins/MultipleLines.js"],a["Mixins/ReduceArray.js"],a["Core/Utilities.js"]],function(a,d,h,b){var e=b.isArray,g=b.merge,k=a.seriesTypes.sma,l=h.getArrayExtremes;a.seriesType("stochastic",
"sma",{params:{periods:[14,3]},marker:{enabled:!1},tooltip:{pointFormat:'<span style="color:{point.color}">\u25cf</span><b> {series.name}</b><br/>%K: {point.y}<br/>%D: {point.smoothed}<br/>'},smoothedLine:{styles:{lineWidth:1,lineColor:void 0}},dataGrouping:{approximation:"averages"}},g(d,{nameComponents:["periods"],nameBase:"Stochastic",pointArrayMap:["y","smoothed"],parallelArrays:["x","y","smoothed"],pointValKey:"y",linesApiNames:["smoothedLine"],init:function(){k.prototype.init.apply(this,arguments);
this.options=g({smoothedLine:{styles:{lineColor:this.color}}},this.options)},getValues:function(a,b){var g=b.periods[0];b=b.periods[1];var d=a.xData,h=(a=a.yData)?a.length:0,n=[],f=[],m=[],u=null,c;if(!(h<g)&&e(a[0])&&4===a[0].length){for(c=g-1;c<h;c++){var t=a.slice(c-g+1,c+1);var x=l(t,2,1);var w=x[0];t=a[c][3]-w;w=x[1]-w;t=t/w*100;f.push(d[c]);m.push([t,null]);c>=g-1+(b-1)&&(u=k.prototype.getValues.call(this,{xData:f.slice(-b),yData:m.slice(-b)},{period:b}),u=u.yData[0]);n.push([d[c],t,u]);m[m.length-
1][1]=u}return{values:n,xData:f,yData:m}}}}));""});h(a,"Stock/Indicators/SlowStochasticIndicator.js",[a["Core/Series/Series.js"],a["Mixins/IndicatorRequired.js"]],function(a,d){var h=a.seriesTypes;a.seriesType("slowstochastic","stochastic",{params:{periods:[14,3,3]}},{nameBase:"Slow Stochastic",init:function(){var a=arguments,e=this;d.isParentLoaded(h.stochastic,"stochastic",e.type,function(b){b.prototype.init.apply(e,a)})},getValues:function(a,e){var b=e.periods,d=h.stochastic.prototype.getValues.call(this,
a,e);a={values:[],xData:[],yData:[]};e=0;if(d){a.xData=d.xData.slice(b[1]-1);d=d.yData.slice(b[1]-1);var l=h.sma.prototype.getValues.call(this,{xData:a.xData,yData:d},{index:1,period:b[2]});if(l){for(var m=a.xData.length;e<m;e++)a.yData[e]=[d[e][1],l.yData[e-b[2]+1]||null],a.values[e]=[a.xData[e],d[e][1],l.yData[e-b[2]+1]||null];return a}}}});""});h(a,"masters/indicators/slow-stochastic.src.js",[],function(){})});
//# sourceMappingURL=slow-stochastic.js.map