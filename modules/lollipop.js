/*
 Highcharts JS v8.2.0 (2020-10-07)

 (c) 2009-2019 Sebastian Bochan, Rafal Sebestjanski

 License: www.highcharts.com/license
*/
(function(c){"object"===typeof module&&module.exports?(c["default"]=c,module.exports=c):"function"===typeof define&&define.amd?define("highcharts/modules/lollipop",["highcharts"],function(q){c(q);c.Highcharts=q;return c}):c("undefined"!==typeof Highcharts?Highcharts:void 0)})(function(c){function q(c,p,r,h){c.hasOwnProperty(p)||(c[p]=h.apply(null,r))}c=c?c._modules:{};q(c,"Series/AreaRangeSeries.js",[c["Core/Series/Series.js"],c["Core/Globals.js"],c["Core/Series/Point.js"],c["Core/Utilities.js"]],
function(c,p,r,h){var v=h.defined,n=h.extend,u=h.isArray,e=h.isNumber,w=h.pick,y=c.seriesTypes.area.prototype,b=c.seriesTypes.column.prototype,l=r.prototype,t=p.Series.prototype;c.seriesType("arearange","area",{lineWidth:1,threshold:null,tooltip:{pointFormat:'<span style="color:{series.color}">\u25cf</span> {series.name}: <b>{point.low}</b> - <b>{point.high}</b><br/>'},trackByArea:!0,dataLabels:{align:void 0,verticalAlign:void 0,xLow:0,xHigh:0,yLow:0,yHigh:0}},{pointArrayMap:["low","high"],pointValKey:"low",
deferTranslatePolar:!0,toYData:function(f){return[f.low,f.high]},highToXY:function(f){var b=this.chart,a=this.xAxis.postTranslate(f.rectPlotX,this.yAxis.len-f.plotHigh);f.plotHighX=a.x-b.plotLeft;f.plotHigh=a.y-b.plotTop;f.plotLowX=f.plotX},translate:function(){var f=this,b=f.yAxis,a=!!f.modifyValue;y.translate.apply(f);f.points.forEach(function(d){var c=d.high,g=d.plotY;d.isNull?d.plotY=null:(d.plotLow=g,d.plotHigh=b.translate(a?f.modifyValue(c,d):c,0,1,0,1),a&&(d.yBottom=d.plotHigh))});this.chart.polar&&
this.points.forEach(function(a){f.highToXY(a);a.tooltipPos=[(a.plotHighX+a.plotLowX)/2,(a.plotHigh+a.plotLow)/2]})},getGraphPath:function(f){var b=[],a=[],c,x=y.getGraphPath;var g=this.options;var t=this.chart.polar,m=t&&!1!==g.connectEnds,k=g.connectNulls,h=g.step;f=f||this.points;for(c=f.length;c--;){var l=f[c];var e=t?{plotX:l.rectPlotX,plotY:l.yBottom,doCurve:!1}:{plotX:l.plotX,plotY:l.plotY,doCurve:!1};l.isNull||m||k||f[c+1]&&!f[c+1].isNull||a.push(e);var n={polarPlotY:l.polarPlotY,rectPlotX:l.rectPlotX,
yBottom:l.yBottom,plotX:w(l.plotHighX,l.plotX),plotY:l.plotHigh,isNull:l.isNull};a.push(n);b.push(n);l.isNull||m||k||f[c-1]&&!f[c-1].isNull||a.push(e)}f=x.call(this,f);h&&(!0===h&&(h="left"),g.step={left:"right",center:"center",right:"left"}[h]);b=x.call(this,b);a=x.call(this,a);g.step=h;g=[].concat(f,b);!this.chart.polar&&a[0]&&"M"===a[0][0]&&(a[0]=["L",a[0][1],a[0][2]]);this.graphPath=g;this.areaPath=f.concat(a);g.isArea=!0;g.xMap=f.xMap;this.areaPath.xMap=f.xMap;return g},drawDataLabels:function(){var b=
this.points,d=b.length,a,c=[],l=this.options.dataLabels,g,h=this.chart.inverted;if(u(l))if(1<l.length){var m=l[0];var k=l[1]}else m=l[0],k={enabled:!1};else m=n({},l),m.x=l.xHigh,m.y=l.yHigh,k=n({},l),k.x=l.xLow,k.y=l.yLow;if(m.enabled||this._hasPointLabels){for(a=d;a--;)if(g=b[a]){var e=m.inside?g.plotHigh<g.plotLow:g.plotHigh>g.plotLow;g.y=g.high;g._plotY=g.plotY;g.plotY=g.plotHigh;c[a]=g.dataLabel;g.dataLabel=g.dataLabelUpper;g.below=e;h?m.align||(m.align=e?"right":"left"):m.verticalAlign||(m.verticalAlign=
e?"top":"bottom")}this.options.dataLabels=m;t.drawDataLabels&&t.drawDataLabels.apply(this,arguments);for(a=d;a--;)if(g=b[a])g.dataLabelUpper=g.dataLabel,g.dataLabel=c[a],delete g.dataLabels,g.y=g.low,g.plotY=g._plotY}if(k.enabled||this._hasPointLabels){for(a=d;a--;)if(g=b[a])e=k.inside?g.plotHigh<g.plotLow:g.plotHigh>g.plotLow,g.below=!e,h?k.align||(k.align=e?"left":"right"):k.verticalAlign||(k.verticalAlign=e?"bottom":"top");this.options.dataLabels=k;t.drawDataLabels&&t.drawDataLabels.apply(this,
arguments)}if(m.enabled)for(a=d;a--;)if(g=b[a])g.dataLabels=[g.dataLabelUpper,g.dataLabel].filter(function(a){return!!a});this.options.dataLabels=l},alignDataLabel:function(){b.alignDataLabel.apply(this,arguments)},drawPoints:function(){var b=this.points.length,d;t.drawPoints.apply(this,arguments);for(d=0;d<b;){var a=this.points[d];a.origProps={plotY:a.plotY,plotX:a.plotX,isInside:a.isInside,negative:a.negative,zone:a.zone,y:a.y};a.lowerGraphic=a.graphic;a.graphic=a.upperGraphic;a.plotY=a.plotHigh;
v(a.plotHighX)&&(a.plotX=a.plotHighX);a.y=a.high;a.negative=a.high<(this.options.threshold||0);a.zone=this.zones.length&&a.getZone();this.chart.polar||(a.isInside=a.isTopInside="undefined"!==typeof a.plotY&&0<=a.plotY&&a.plotY<=this.yAxis.len&&0<=a.plotX&&a.plotX<=this.xAxis.len);d++}t.drawPoints.apply(this,arguments);for(d=0;d<b;)a=this.points[d],a.upperGraphic=a.graphic,a.graphic=a.lowerGraphic,n(a,a.origProps),delete a.origProps,d++},setStackedPoints:p.noop},{setState:function(){var b=this.state,
d=this.series,a=d.chart.polar;v(this.plotHigh)||(this.plotHigh=d.yAxis.toPixels(this.high,!0));v(this.plotLow)||(this.plotLow=this.plotY=d.yAxis.toPixels(this.low,!0));d.stateMarkerGraphic&&(d.lowerStateMarkerGraphic=d.stateMarkerGraphic,d.stateMarkerGraphic=d.upperStateMarkerGraphic);this.graphic=this.upperGraphic;this.plotY=this.plotHigh;a&&(this.plotX=this.plotHighX);l.setState.apply(this,arguments);this.state=b;this.plotY=this.plotLow;this.graphic=this.lowerGraphic;a&&(this.plotX=this.plotLowX);
d.stateMarkerGraphic&&(d.upperStateMarkerGraphic=d.stateMarkerGraphic,d.stateMarkerGraphic=d.lowerStateMarkerGraphic,d.lowerStateMarkerGraphic=void 0);l.setState.apply(this,arguments)},haloPath:function(){var b=this.series.chart.polar,d=[];this.plotY=this.plotLow;b&&(this.plotX=this.plotLowX);this.isInside&&(d=l.haloPath.apply(this,arguments));this.plotY=this.plotHigh;b&&(this.plotX=this.plotHighX);this.isTopInside&&(d=d.concat(l.haloPath.apply(this,arguments)));return d},destroyElements:function(){["lowerGraphic",
"upperGraphic"].forEach(function(b){this[b]&&(this[b]=this[b].destroy())},this);this.graphic=null;return l.destroyElements.apply(this,arguments)},isValid:function(){return e(this.low)&&e(this.high)}});""});q(c,"Series/ColumnRangeSeries.js",[c["Core/Series/Series.js"],c["Core/Globals.js"],c["Core/Options.js"],c["Core/Utilities.js"]],function(c,p,r,h){p=p.noop;r=r.defaultOptions;var v=h.clamp,n=h.merge,u=h.pick,e=c.seriesTypes.column.prototype;c.seriesType("columnrange","arearange",n(r.plotOptions.column,
r.plotOptions.arearange,{pointRange:null,marker:null,states:{hover:{halo:!1}}}),{translate:function(){var c=this,h=c.yAxis,b=c.xAxis,l=b.startAngleRad,t,f=c.chart,d=c.xAxis.isRadial,a=Math.max(f.chartWidth,f.chartHeight)+999,n;e.translate.apply(c);c.points.forEach(function(e){var g=e.shapeArgs,p=c.options.minPointLength;e.plotHigh=n=v(h.translate(e.high,0,1,0,1),-a,a);e.plotLow=v(e.plotY,-a,a);var m=n;var k=u(e.rectPlotY,e.plotY)-n;Math.abs(k)<p?(p-=k,k+=p,m-=p/2):0>k&&(k*=-1,m-=k);d?(t=e.barX+l,
e.shapeType="arc",e.shapeArgs=c.polarArc(m+k,m,t,t+e.pointWidth)):(g.height=k,g.y=m,e.tooltipPos=f.inverted?[h.len+h.pos-f.plotLeft-m-k/2,b.len+b.pos-f.plotTop-g.x-g.width/2,k]:[b.left-f.plotLeft+g.x+g.width/2,h.pos-f.plotTop+m+k/2,k])})},directTouch:!0,trackerGroups:["group","dataLabelsGroup"],drawGraph:p,getSymbol:p,crispCol:function(){return e.crispCol.apply(this,arguments)},drawPoints:function(){return e.drawPoints.apply(this,arguments)},drawTracker:function(){return e.drawTracker.apply(this,
arguments)},getColumnMetrics:function(){return e.getColumnMetrics.apply(this,arguments)},pointAttribs:function(){return e.pointAttribs.apply(this,arguments)},animate:function(){return e.animate.apply(this,arguments)},polarArc:function(){return e.polarArc.apply(this,arguments)},translate3dPoints:function(){return e.translate3dPoints.apply(this,arguments)},translate3dShapes:function(){return e.translate3dShapes.apply(this,arguments)}},{setState:e.pointClass.prototype.setState});""});q(c,"Series/DumbbellSeries.js",
[c["Core/Series/Series.js"],c["Core/Renderer/SVG/SVGRenderer.js"],c["Core/Globals.js"],c["Core/Utilities.js"]],function(c,p,r,h){var v=h.extend,n=h.pick,u=r.Series.prototype;h=c.seriesTypes;var e=h.arearange.prototype,w=h.column.prototype,q=e.pointClass.prototype;c.seriesType("dumbbell","arearange",{trackByArea:!1,fillColor:"none",lineWidth:0,pointRange:1,connectorWidth:1,stickyTracking:!1,groupPadding:.2,crisp:!1,pointPadding:.1,lowColor:"#333333",states:{hover:{lineWidthPlus:0,connectorWidthPlus:1,
halo:!1}}},{trackerGroups:["group","markerGroup","dataLabelsGroup"],drawTracker:r.TrackerMixin.drawTrackerPoint,drawGraph:r.noop,crispCol:w.crispCol,getConnectorAttribs:function(b){var c=this.chart,e=b.options,f=this.options,d=this.xAxis,a=this.yAxis,h=n(e.connectorWidth,f.connectorWidth),r=n(e.connectorColor,f.connectorColor,e.color,b.zone?b.zone.color:void 0,b.color),g=n(f.states&&f.states.hover&&f.states.hover.connectorWidthPlus,1),q=n(e.dashStyle,f.dashStyle),m=n(b.plotLow,b.plotY),k=a.toPixels(f.threshold||
0,!0);k=n(b.plotHigh,c.inverted?a.len-k:k);b.state&&(h+=g);0>m?m=0:m>=a.len&&(m=a.len);0>k?k=0:k>=a.len&&(k=a.len);if(0>b.plotX||b.plotX>d.len)h=0;b.upperGraphic&&(d={y:b.y,zone:b.zone},b.y=b.high,b.zone=b.zone?b.getZone():void 0,r=n(e.connectorColor,f.connectorColor,e.color,b.zone?b.zone.color:void 0,b.color),v(b,d));b={d:p.prototype.crispLine([["M",b.plotX,m],["L",b.plotX,k]],h,"ceil")};c.styledMode||(b.stroke=r,b["stroke-width"]=h,q&&(b.dashstyle=q));return b},drawConnector:function(b){var c=n(this.options.animationLimit,
250);c=b.connector&&this.chart.pointCount<c?"animate":"attr";b.connector||(b.connector=this.chart.renderer.path().addClass("highcharts-lollipop-stem").attr({zIndex:-1}).add(this.markerGroup));b.connector[c](this.getConnectorAttribs(b))},getColumnMetrics:function(){var b=w.getColumnMetrics.apply(this,arguments);b.offset+=b.width/2;return b},translatePoint:e.translate,setShapeArgs:h.columnrange.prototype.translate,translate:function(){this.setShapeArgs.apply(this);this.translatePoint.apply(this,arguments);
this.points.forEach(function(b){var c=b.shapeArgs,e=b.pointWidth;b.plotX=c.x;c.x=b.plotX-e/2;b.tooltipPos=null});this.columnMetrics.offset-=this.columnMetrics.width/2},seriesDrawPoints:e.drawPoints,drawPoints:function(){var b=this.chart,c=this.points.length,e=this.lowColor=this.options.lowColor,f=0;for(this.seriesDrawPoints.apply(this,arguments);f<c;){var d=this.points[f];this.drawConnector(d);d.upperGraphic&&(d.upperGraphic.element.point=d,d.upperGraphic.addClass("highcharts-lollipop-high"));d.connector.element.point=
d;if(d.lowerGraphic){var a=d.zone&&d.zone.color;a=n(d.options.lowColor,e,d.options.color,a,d.color,this.color);b.styledMode||d.lowerGraphic.attr({fill:a});d.lowerGraphic.addClass("highcharts-lollipop-low")}f++}},markerAttribs:function(){var b=e.markerAttribs.apply(this,arguments);b.x=Math.floor(b.x);b.y=Math.floor(b.y);return b},pointAttribs:function(b,c){var e=u.pointAttribs.apply(this,arguments);"hover"===c&&delete e.fill;return e}},{destroyElements:q.destroyElements,isValid:q.isValid,pointSetState:q.setState,
setState:function(){var b=this.series,c=b.chart,e=b.options.marker,f=this.options,d=n(f.lowColor,b.options.lowColor,f.color,this.zone&&this.zone.color,this.color,b.color),a="attr";this.pointSetState.apply(this,arguments);this.state||(a="animate",this.lowerGraphic&&!c.styledMode&&(this.lowerGraphic.attr({fill:d}),this.upperGraphic&&(c={y:this.y,zone:this.zone},this.y=this.high,this.zone=this.zone?this.getZone():void 0,e=n(this.marker?this.marker.fillColor:void 0,e?e.fillColor:void 0,f.color,this.zone?
this.zone.color:void 0,this.color),this.upperGraphic.attr({fill:e}),v(this,c))));this.connector[a](b.getConnectorAttribs(this))}});""});q(c,"Series/LollipopSeries.js",[c["Core/Series/Point.js"],c["Core/Series/Series.js"],c["Core/Globals.js"],c["Core/Utilities.js"]],function(c,p,r,h){var q=h.isObject,n=h.pick,u=p.seriesTypes;h=u.area.prototype;u=u.column.prototype;p.seriesType("lollipop","dumbbell",{lowColor:void 0,threshold:0,connectorWidth:1,groupPadding:.2,pointPadding:.1,states:{hover:{lineWidthPlus:0,
connectorWidthPlus:1,halo:!1}},tooltip:{pointFormat:'<span style="color:{series.color}">\u25cf</span> {series.name}: <b>{point.y}</b><br/>'}},{pointArrayMap:["y"],pointValKey:"y",toYData:function(c){return[n(c.y,c.low)]},translatePoint:h.translate,drawPoint:h.drawPoints,drawDataLabels:u.drawDataLabels,setShapeArgs:u.translate},{pointSetState:h.pointClass.prototype.setState,setState:r.seriesTypes.dumbbell.prototype.pointClass.prototype.setState,init:function(e,h,n){q(h)&&"low"in h&&(h.y=h.low,delete h.low);
return c.prototype.init.apply(this,arguments)}});""});q(c,"masters/modules/lollipop.src.js",[],function(){})});
//# sourceMappingURL=lollipop.js.map