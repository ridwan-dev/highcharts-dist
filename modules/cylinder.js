/*
 Highcharts JS v8.2.0 (2020-10-07)

 Highcharts cylinder module

 (c) 2010-2019 Kacper Madej

 License: www.highcharts.com/license
*/
(function(c){"object"===typeof module&&module.exports?(c["default"]=c,module.exports=c):"function"===typeof define&&define.amd?define("highcharts/modules/cylinder",["highcharts","highcharts/highcharts-3d"],function(f){c(f);c.Highcharts=f;return c}):c("undefined"!==typeof Highcharts?Highcharts:void 0)})(function(c){function f(c,g,f,k){c.hasOwnProperty(g)||(c[g]=k.apply(null,f))}c=c?c._modules:{};f(c,"Series/CylinderSeries.js",[c["Core/Color/Color.js"],c["Core/Globals.js"],c["Extensions/Math3D.js"],
c["Core/Series/Series.js"],c["Core/Utilities.js"]],function(c,g,f,k,l){var m=c.parse,t=g.charts,u=g.deg2rad;c=g.Renderer.prototype;var v=f.perspective;f=l.merge;var w=l.pick,x=c.cuboidPath,n=function(a){return!a.some(function(a){return"C"===a[0]})};k.seriesType("cylinder","column",{},{},{shapeType:"cylinder",hasNewShapeType:g.seriesTypes.column.prototype.pointClass.prototype.hasNewShapeType});g=f(c.elements3d.cuboid,{parts:["top","bottom","front","back"],pathType:"cylinder",fillSetter:function(a){this.singleSetterForParts("fill",
null,{front:a,back:a,top:m(a).brighten(.1).get(),bottom:m(a).brighten(-.1).get()});this.color=this.fill=a;return this}});c.elements3d.cylinder=g;c.cylinder=function(a){return this.element3d("cylinder",a)};c.cylinderPath=function(a){var b=t[this.chartIndex],d=x.call(this,a),e=!d.isTop,c=!d.isFront,f=this.getCylinderEnd(b,a);a=this.getCylinderEnd(b,a,!0);return{front:this.getCylinderFront(f,a),back:this.getCylinderBack(f,a),top:f,bottom:a,zIndexes:{top:e?3:0,bottom:e?0:3,front:c?2:1,back:c?1:2,group:d.zIndexes.group}}};
c.getCylinderFront=function(a,b){a=a.slice(0,3);if(n(b)){var d=b[0];"M"===d[0]&&(a.push(b[2]),a.push(b[1]),a.push(["L",d[1],d[2]]))}else{d=b[0];var e=b[1];b=b[2];"M"===d[0]&&"C"===e[0]&&"C"===b[0]&&(a.push(["L",b[5],b[6]]),a.push(["C",b[3],b[4],b[1],b[2],e[5],e[6]]),a.push(["C",e[3],e[4],e[1],e[2],d[1],d[2]]))}a.push(["Z"]);return a};c.getCylinderBack=function(a,b){var d=[];if(n(a)){var e=a[0],c=a[2];"M"===e[0]&&"L"===c[0]&&(d.push(["M",c[1],c[2]]),d.push(a[3]),d.push(["L",e[1],e[2]]))}else"C"===
a[2][0]&&d.push(["M",a[2][5],a[2][6]]),d.push(a[3],a[4]);n(b)?(e=b[0],"M"===e[0]&&(d.push(["L",e[1],e[2]]),d.push(b[3]),d.push(b[2]))):(a=b[2],e=b[3],b=b[4],"C"===a[0]&&"C"===e[0]&&"C"===b[0]&&(d.push(["L",b[5],b[6]]),d.push(["C",b[3],b[4],b[1],b[2],e[5],e[6]]),d.push(["C",e[3],e[4],e[1],e[2],a[5],a[6]])));d.push(["Z"]);return d};c.getCylinderEnd=function(a,b,d){var c=w(b.depth,b.width),f=Math.min(b.width,c)/2,g=u*(a.options.chart.options3d.beta-90+(b.alphaCorrection||0));d=b.y+(d?b.height:0);var h=
.5519*f,k=b.width/2+b.x,n=c/2+b.z,p=[{x:0,y:d,z:f},{x:h,y:d,z:f},{x:f,y:d,z:h},{x:f,y:d,z:0},{x:f,y:d,z:-h},{x:h,y:d,z:-f},{x:0,y:d,z:-f},{x:-h,y:d,z:-f},{x:-f,y:d,z:-h},{x:-f,y:d,z:0},{x:-f,y:d,z:h},{x:-h,y:d,z:f},{x:0,y:d,z:f}],l=Math.cos(g),m=Math.sin(g),q,r;p.forEach(function(a,b){q=a.x;r=a.z;p[b].x=q*l-r*m+k;p[b].z=r*l+q*m+n});a=v(p,a,!0);return 2.5>Math.abs(a[3].y-a[9].y)&&2.5>Math.abs(a[0].y-a[6].y)?this.toLinePath([a[0],a[3],a[6],a[9]],!0):this.getCurvedPath(a)};c.getCurvedPath=function(a){var b=
[["M",a[0].x,a[0].y]],c=a.length-2,e;for(e=1;e<c;e+=3)b.push(["C",a[e].x,a[e].y,a[e+1].x,a[e+1].y,a[e+2].x,a[e+2].y]);return b}});f(c,"masters/modules/cylinder.src.js",[],function(){})});
//# sourceMappingURL=cylinder.js.map