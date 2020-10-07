/*
 Highstock JS v8.2.0 (2020-10-07)

 Indicator series type for Highstock

 (c) 2010-2019 Pawe Fus

 License: www.highcharts.com/license
*/
(function(a){"object"===typeof module&&module.exports?(a["default"]=a,module.exports=a):"function"===typeof define&&define.amd?define("highcharts/indicators/bollinger-bands",["highcharts","highcharts/modules/stock"],function(h){a(h);a.Highcharts=h;return a}):a("undefined"!==typeof Highcharts?Highcharts:void 0)})(function(a){function h(a,k,m,e){a.hasOwnProperty(k)||(a[k]=e.apply(null,m))}a=a?a._modules:{};h(a,"Mixins/MultipleLines.js",[a["Core/Globals.js"],a["Core/Utilities.js"]],function(a,k){var m=
k.defined,e=k.error,x=k.merge,l=a.seriesTypes.sma;return{pointArrayMap:["top","bottom"],pointValKey:"top",linesApiNames:["bottomLine"],getTranslatedLinesNames:function(f){var a=[];(this.pointArrayMap||[]).forEach(function(g){g!==f&&a.push("plot"+g.charAt(0).toUpperCase()+g.slice(1))});return a},toYData:function(f){var a=[];(this.pointArrayMap||[]).forEach(function(g){a.push(f[g])});return a},translate:function(){var f=this,a=f.pointArrayMap,g=[],e;g=f.getTranslatedLinesNames();l.prototype.translate.apply(f,
arguments);f.points.forEach(function(m){a.forEach(function(a,l){e=m[a];null!==e&&(m[g[l]]=f.yAxis.toPixels(e,!0))})})},drawGraph:function(){var a=this,k=a.linesApiNames,g=a.points,h=g.length,n=a.options,v=a.graph,p={options:{gapSize:n.gapSize}},q=[],c;a.getTranslatedLinesNames(a.pointValKey).forEach(function(a,e){for(q[e]=[];h--;)c=g[h],q[e].push({x:c.x,plotX:c.plotX,plotY:c[a],isNull:!m(c[a])});h=g.length});k.forEach(function(c,f){q[f]?(a.points=q[f],n[c]?a.options=x(n[c].styles,p):e('Error: "There is no '+
c+' in DOCS options declared. Check if linesApiNames are consistent with your DOCS line names." at mixin/multiple-line.js:34'),a.graph=a["graph"+c],l.prototype.drawGraph.call(a),a["graph"+c]=a.graph):e('Error: "'+c+" doesn't have equivalent in pointArrayMap. To many elements in linesApiNames relative to pointArrayMap.\"")});a.points=g;a.options=n;a.graph=v;l.prototype.drawGraph.call(a)}}});h(a,"Mixins/IndicatorRequired.js",[a["Core/Utilities.js"]],function(a){var k=a.error;return{isParentLoaded:function(a,
e,h,l,f){if(a)return l?l(a):!0;k(f||this.generateMessage(h,e));return!1},generateMessage:function(a,e){return'Error: "'+a+'" indicator type requires "'+e+'" indicator loaded before. Please read docs: https://api.highcharts.com/highstock/plotOptions.'+a}}});h(a,"Stock/Indicators/SMAIndicator.js",[a["Core/Series/Series.js"],a["Core/Globals.js"],a["Mixins/IndicatorRequired.js"],a["Core/Utilities.js"]],function(a,k,h,e){var m=a.seriesTypes,l=e.addEvent,f=e.error,A=e.extend,g=e.isArray,B=e.pick,n=e.splat,
v=k.Series,p=m.ohlc.prototype,q=h.generateMessage;l(k.Series,"init",function(a){a=a.options;a.useOhlcData&&"highcharts-navigator-series"!==a.id&&A(this,{pointValKey:p.pointValKey,keys:p.keys,pointArrayMap:p.pointArrayMap,toYData:p.toYData})});l(v,"afterSetOptions",function(a){a=a.options;var c=a.dataGrouping;c&&a.useOhlcData&&"highcharts-navigator-series"!==a.id&&(c.approximation="ohlc")});a.seriesType("sma","line",{name:void 0,tooltip:{valueDecimals:4},linkedTo:void 0,compareToMain:!1,params:{index:0,
period:14}},{processData:function(){var a=this.options.compareToMain,d=this.linkedParent;v.prototype.processData.apply(this,arguments);d&&d.compareValue&&a&&(this.compareValue=d.compareValue)},bindTo:{series:!0,eventName:"updatedData"},hasDerivedData:!0,useCommonDataGrouping:!0,nameComponents:["period"],nameSuffixes:[],calculateOn:"init",requiredIndicators:[],requireIndicators:function(){var a={allLoaded:!0};this.requiredIndicators.forEach(function(c){m[c]?m[c].prototype.requireIndicators():(a.allLoaded=
!1,a.needed=c)});return a},init:function(a,d){function c(){var a=b.points||[],c=(b.xData||[]).length,d=b.getValues(b.linkedParent,b.options.params)||{values:[],xData:[],yData:[]},e=[],f=!0;if(c&&!b.hasGroupedData&&b.visible&&b.points)if(b.cropped){if(b.xAxis){var g=b.xAxis.min;var h=b.xAxis.max}c=b.cropData(d.xData,d.yData,g,h);for(g=0;g<c.xData.length;g++)e.push([c.xData[g]].concat(n(c.yData[g])));c=d.xData.indexOf(b.xData[0]);g=d.xData.indexOf(b.xData[b.xData.length-1]);-1===c&&g===d.xData.length-
2&&e[0][0]===a[0].x&&e.shift();b.updateData(e)}else d.xData.length!==c-1&&d.xData.length!==c+1&&(f=!1,b.updateData(d.values));f&&(b.xData=d.xData,b.yData=d.yData,b.options.data=d.values);!1===b.bindTo.series&&(delete b.processedXData,b.isDirty=!0,b.redraw());b.isDirtyData=!1}var b=this,e=b.requireIndicators();if(!e.allLoaded)return f(q(b.type,e.needed));v.prototype.init.call(b,a,d);a.linkSeries();b.dataEventsToUnbind=[];if(!b.linkedParent)return f("Series "+b.options.linkedTo+" not found! Check `linkedTo`.",
!1,a);b.dataEventsToUnbind.push(l(b.bindTo.series?b.linkedParent:b.linkedParent.xAxis,b.bindTo.eventName,c));if("init"===b.calculateOn)c();else var g=l(b.chart,b.calculateOn,function(){c();g()});return b},getName:function(){var a=this.name,d=[];a||((this.nameComponents||[]).forEach(function(a,b){d.push(this.options.params[a]+B(this.nameSuffixes[b],""))},this),a=(this.nameBase||this.type.toUpperCase())+(this.nameComponents?" ("+d.join(", ")+")":""));return a},getValues:function(a,d){var c=d.period,
b=a.xData;a=a.yData;var e=a.length,f=0,h=0,l=[],k=[],m=[],n=-1;if(!(b.length<c)){for(g(a[0])&&(n=d.index?d.index:0);f<c-1;)h+=0>n?a[f]:a[f][n],f++;for(d=f;d<e;d++){h+=0>n?a[d]:a[d][n];var p=[b[d],h/c];l.push(p);k.push(p[0]);m.push(p[1]);h-=0>n?a[d-f]:a[d-f][n]}return{values:l,xData:k,yData:m}}},destroy:function(){this.dataEventsToUnbind.forEach(function(a){a()});v.prototype.destroy.apply(this,arguments)}});""});h(a,"Stock/Indicators/BBIndicator.js",[a["Core/Series/Series.js"],a["Mixins/MultipleLines.js"],
a["Core/Utilities.js"]],function(a,h,m){var e=m.isArray,k=m.merge,l=a.seriesTypes.sma;a.seriesType("bb","sma",{params:{period:20,standardDeviation:2,index:3},bottomLine:{styles:{lineWidth:1,lineColor:void 0}},topLine:{styles:{lineWidth:1,lineColor:void 0}},tooltip:{pointFormat:'<span style="color:{point.color}">\u25cf</span><b> {series.name}</b><br/>Top: {point.top}<br/>Middle: {point.middle}<br/>Bottom: {point.bottom}<br/>'},marker:{enabled:!1},dataGrouping:{approximation:"averages"}},k(h,{pointArrayMap:["top",
"middle","bottom"],pointValKey:"middle",nameComponents:["period","standardDeviation"],linesApiNames:["topLine","bottomLine"],init:function(){l.prototype.init.apply(this,arguments);this.options=k({topLine:{styles:{lineColor:this.color}},bottomLine:{styles:{lineColor:this.color}}},this.options)},getValues:function(a,h){var g=h.period,f=h.standardDeviation,k=a.xData,m=(a=a.yData)?a.length:0,p=[],q=[],c=[],d;if(!(k.length<g)){var x=e(a[0]);for(d=g;d<=m;d++){var b=k.slice(d-g,d);var u=a.slice(d-g,d);var t=
l.prototype.getValues.call(this,{xData:b,yData:u},h);b=t.xData[0];t=t.yData[0];for(var y=0,z=u.length,w=0;w<z;w++){var r=(x?u[w][h.index]:u[w])-t;y+=r*r}r=Math.sqrt(y/(z-1));u=t+f*r;r=t-f*r;p.push([b,u,t,r]);q.push(b);c.push([u,t,r])}return{values:p,xData:q,yData:c}}}}));""});h(a,"masters/indicators/bollinger-bands.src.js",[],function(){})});
//# sourceMappingURL=bollinger-bands.js.map