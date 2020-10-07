/*
 Highcharts JS v8.2.0 (2020-10-07)

 Force directed graph module

 (c) 2010-2019 Torstein Honsi

 License: www.highcharts.com/license
*/
(function(d){"object"===typeof module&&module.exports?(d["default"]=d,module.exports=d):"function"===typeof define&&define.amd?define("highcharts/modules/networkgraph",["highcharts"],function(l){d(l);d.Highcharts=l;return d}):d("undefined"!==typeof Highcharts?Highcharts:void 0)})(function(d){function l(d,a,b,e){d.hasOwnProperty(a)||(d[a]=e.apply(null,b))}d=d?d._modules:{};l(d,"Mixins/Nodes.js",[d["Core/Globals.js"],d["Core/Series/Point.js"],d["Core/Utilities.js"]],function(d,a,b){var e=b.defined,
c=b.extend,g=b.find,m=b.pick;return d.NodesMixin={createNode:function(a){function b(h,f){return g(h,function(h){return h.id===f})}var e=b(this.nodes,a),h=this.pointClass;if(!e){var f=this.options.nodes&&b(this.options.nodes,a);e=(new h).init(this,c({className:"highcharts-node",isNode:!0,id:a,y:1},f));e.linksTo=[];e.linksFrom=[];e.formatPrefix="node";e.name=e.name||e.options.id||"";e.mass=m(e.options.mass,e.options.marker&&e.options.marker.radius,this.options.marker&&this.options.marker.radius,4);
e.getSum=function(){var h=0,f=0;e.linksTo.forEach(function(f){h+=f.weight});e.linksFrom.forEach(function(h){f+=h.weight});return Math.max(h,f)};e.offset=function(h,f){for(var q=0,c=0;c<e[f].length;c++){if(e[f][c]===h)return q;q+=e[f][c].weight}};e.hasShape=function(){var h=0;e.linksTo.forEach(function(f){f.outgoing&&h++});return!e.linksTo.length||h!==e.linksTo.length};this.nodes.push(e)}return e},generatePoints:function(){var c=this.chart,a={};d.Series.prototype.generatePoints.call(this);this.nodes||
(this.nodes=[]);this.colorCounter=0;this.nodes.forEach(function(a){a.linksFrom.length=0;a.linksTo.length=0;a.level=a.options.level});this.points.forEach(function(b){e(b.from)&&(a[b.from]||(a[b.from]=this.createNode(b.from)),a[b.from].linksFrom.push(b),b.fromNode=a[b.from],c.styledMode?b.colorIndex=m(b.options.colorIndex,a[b.from].colorIndex):b.color=b.options.color||a[b.from].color);e(b.to)&&(a[b.to]||(a[b.to]=this.createNode(b.to)),a[b.to].linksTo.push(b),b.toNode=a[b.to]);b.name=b.name||b.id},this);
this.nodeLookup=a},setData:function(){this.nodes&&(this.nodes.forEach(function(a){a.destroy()}),this.nodes.length=0);d.Series.prototype.setData.apply(this,arguments)},destroy:function(){this.data=[].concat(this.points||[],this.nodes);return d.Series.prototype.destroy.apply(this,arguments)},setNodeState:function(b){var c=arguments,e=this.isNode?this.linksTo.concat(this.linksFrom):[this.fromNode,this.toNode];"select"!==b&&e.forEach(function(h){h&&h.series&&(a.prototype.setState.apply(h,c),h.isNode||
(h.fromNode.graphic&&a.prototype.setState.apply(h.fromNode,c),h.toNode&&h.toNode.graphic&&a.prototype.setState.apply(h.toNode,c)))});a.prototype.setState.apply(this,c)}}});l(d,"Series/Networkgraph/Integrations.js",[d["Core/Globals.js"]],function(d){d.networkgraphIntegrations={verlet:{attractiveForceFunction:function(a,b){return(b-a)/a},repulsiveForceFunction:function(a,b){return(b-a)/a*(b>a?1:0)},barycenter:function(){var a=this.options.gravitationalConstant,b=this.barycenter.xFactor,e=this.barycenter.yFactor;
b=(b-(this.box.left+this.box.width)/2)*a;e=(e-(this.box.top+this.box.height)/2)*a;this.nodes.forEach(function(a){a.fixedPosition||(a.plotX-=b/a.mass/a.degree,a.plotY-=e/a.mass/a.degree)})},repulsive:function(a,b,e){b=b*this.diffTemperature/a.mass/a.degree;a.fixedPosition||(a.plotX+=e.x*b,a.plotY+=e.y*b)},attractive:function(a,b,e){var c=a.getMass(),g=-e.x*b*this.diffTemperature;b=-e.y*b*this.diffTemperature;a.fromNode.fixedPosition||(a.fromNode.plotX-=g*c.fromNode/a.fromNode.degree,a.fromNode.plotY-=
b*c.fromNode/a.fromNode.degree);a.toNode.fixedPosition||(a.toNode.plotX+=g*c.toNode/a.toNode.degree,a.toNode.plotY+=b*c.toNode/a.toNode.degree)},integrate:function(a,b){var e=-a.options.friction,c=a.options.maxSpeed,g=(b.plotX+b.dispX-b.prevX)*e;e*=b.plotY+b.dispY-b.prevY;var d=Math.abs,n=d(g)/(g||1);d=d(e)/(e||1);g=n*Math.min(c,Math.abs(g));e=d*Math.min(c,Math.abs(e));b.prevX=b.plotX+b.dispX;b.prevY=b.plotY+b.dispY;b.plotX+=g;b.plotY+=e;b.temperature=a.vectorLength({x:g,y:e})},getK:function(a){return Math.pow(a.box.width*
a.box.height/a.nodes.length,.5)}},euler:{attractiveForceFunction:function(a,b){return a*a/b},repulsiveForceFunction:function(a,b){return b*b/a},barycenter:function(){var a=this.options.gravitationalConstant,b=this.barycenter.xFactor,e=this.barycenter.yFactor;this.nodes.forEach(function(c){if(!c.fixedPosition){var g=c.getDegree();g*=1+g/2;c.dispX+=(b-c.plotX)*a*g/c.degree;c.dispY+=(e-c.plotY)*a*g/c.degree}})},repulsive:function(a,b,e,c){a.dispX+=e.x/c*b/a.degree;a.dispY+=e.y/c*b/a.degree},attractive:function(a,
b,e,c){var g=a.getMass(),d=e.x/c*b;b*=e.y/c;a.fromNode.fixedPosition||(a.fromNode.dispX-=d*g.fromNode/a.fromNode.degree,a.fromNode.dispY-=b*g.fromNode/a.fromNode.degree);a.toNode.fixedPosition||(a.toNode.dispX+=d*g.toNode/a.toNode.degree,a.toNode.dispY+=b*g.toNode/a.toNode.degree)},integrate:function(a,b){b.dispX+=b.dispX*a.options.friction;b.dispY+=b.dispY*a.options.friction;var e=b.temperature=a.vectorLength({x:b.dispX,y:b.dispY});0!==e&&(b.plotX+=b.dispX/e*Math.min(Math.abs(b.dispX),a.temperature),
b.plotY+=b.dispY/e*Math.min(Math.abs(b.dispY),a.temperature))},getK:function(a){return Math.pow(a.box.width*a.box.height/a.nodes.length,.3)}}}});l(d,"Series/Networkgraph/QuadTree.js",[d["Core/Globals.js"],d["Core/Utilities.js"]],function(d,a){a=a.extend;var b=d.QuadTreeNode=function(a){this.box=a;this.boxSize=Math.min(a.width,a.height);this.nodes=[];this.body=this.isInternal=!1;this.isEmpty=!0};a(b.prototype,{insert:function(a,c){this.isInternal?this.nodes[this.getBoxPosition(a)].insert(a,c-1):(this.isEmpty=
!1,this.body?c?(this.isInternal=!0,this.divideBox(),!0!==this.body&&(this.nodes[this.getBoxPosition(this.body)].insert(this.body,c-1),this.body=!0),this.nodes[this.getBoxPosition(a)].insert(a,c-1)):(c=new b({top:a.plotX,left:a.plotY,width:.1,height:.1}),c.body=a,c.isInternal=!1,this.nodes.push(c)):(this.isInternal=!1,this.body=a))},updateMassAndCenter:function(){var a=0,b=0,d=0;this.isInternal?(this.nodes.forEach(function(c){c.isEmpty||(a+=c.mass,b+=c.plotX*c.mass,d+=c.plotY*c.mass)}),b/=a,d/=a):
this.body&&(a=this.body.mass,b=this.body.plotX,d=this.body.plotY);this.mass=a;this.plotX=b;this.plotY=d},divideBox:function(){var a=this.box.width/2,c=this.box.height/2;this.nodes[0]=new b({left:this.box.left,top:this.box.top,width:a,height:c});this.nodes[1]=new b({left:this.box.left+a,top:this.box.top,width:a,height:c});this.nodes[2]=new b({left:this.box.left+a,top:this.box.top+c,width:a,height:c});this.nodes[3]=new b({left:this.box.left,top:this.box.top+c,width:a,height:c})},getBoxPosition:function(a){var b=
a.plotY<this.box.top+this.box.height/2;return a.plotX<this.box.left+this.box.width/2?b?0:3:b?1:2}});d=d.QuadTree=function(a,c,d,m){this.box={left:a,top:c,width:d,height:m};this.maxDepth=25;this.root=new b(this.box,"0");this.root.isInternal=!0;this.root.isRoot=!0;this.root.divideBox()};a(d.prototype,{insertNodes:function(a){a.forEach(function(a){this.root.insert(a,this.maxDepth)},this)},visitNodeRecursive:function(a,b,d){var c;a||(a=this.root);a===this.root&&b&&(c=b(a));!1!==c&&(a.nodes.forEach(function(a){if(a.isInternal){b&&
(c=b(a));if(!1===c)return;this.visitNodeRecursive(a,b,d)}else a.body&&b&&b(a.body);d&&d(a)},this),a===this.root&&d&&d(a))},calculateMassAndCenter:function(){this.visitNodeRecursive(null,null,function(a){a.updateMassAndCenter()})}})});l(d,"Series/Networkgraph/Layouts.js",[d["Core/Chart/Chart.js"],d["Core/Animation/AnimationUtilities.js"],d["Core/Globals.js"],d["Core/Utilities.js"]],function(d,a,b,e){var c=a.setAnimation;a=e.addEvent;var g=e.clamp,m=e.defined,n=e.extend,p=e.isFunction,k=e.pick;b.layouts=
{"reingold-fruchterman":function(){}};n(b.layouts["reingold-fruchterman"].prototype,{init:function(a){this.options=a;this.nodes=[];this.links=[];this.series=[];this.box={x:0,y:0,width:0,height:0};this.setInitialRendering(!0);this.integration=b.networkgraphIntegrations[a.integration];this.enableSimulation=a.enableSimulation;this.attractiveForce=k(a.attractiveForce,this.integration.attractiveForceFunction);this.repulsiveForce=k(a.repulsiveForce,this.integration.repulsiveForceFunction);this.approximation=
a.approximation},updateSimulation:function(a){this.enableSimulation=k(a,this.options.enableSimulation)},start:function(){var a=this.series,f=this.options;this.currentStep=0;this.forces=a[0]&&a[0].forces||[];this.chart=a[0]&&a[0].chart;this.initialRendering&&(this.initPositions(),a.forEach(function(a){a.finishedAnimating=!0;a.render()}));this.setK();this.resetSimulation(f);this.enableSimulation&&this.step()},step:function(){var a=this,f=this.series;a.currentStep++;"barnes-hut"===a.approximation&&(a.createQuadTree(),
a.quadTree.calculateMassAndCenter());a.forces.forEach(function(f){a[f+"Forces"](a.temperature)});a.applyLimits(a.temperature);a.temperature=a.coolDown(a.startTemperature,a.diffTemperature,a.currentStep);a.prevSystemTemperature=a.systemTemperature;a.systemTemperature=a.getSystemTemperature();a.enableSimulation&&(f.forEach(function(a){a.chart&&a.render()}),a.maxIterations--&&isFinite(a.temperature)&&!a.isStable()?(a.simulation&&b.win.cancelAnimationFrame(a.simulation),a.simulation=b.win.requestAnimationFrame(function(){a.step()})):
a.simulation=!1)},stop:function(){this.simulation&&b.win.cancelAnimationFrame(this.simulation)},setArea:function(a,f,b,c){this.box={left:a,top:f,width:b,height:c}},setK:function(){this.k=this.options.linkLength||this.integration.getK(this)},addElementsToCollection:function(a,f){a.forEach(function(a){-1===f.indexOf(a)&&f.push(a)})},removeElementFromCollection:function(a,f){a=f.indexOf(a);-1!==a&&f.splice(a,1)},clear:function(){this.nodes.length=0;this.links.length=0;this.series.length=0;this.resetSimulation()},
resetSimulation:function(){this.forcedStop=!1;this.systemTemperature=0;this.setMaxIterations();this.setTemperature();this.setDiffTemperature()},restartSimulation:function(){this.simulation?this.resetSimulation():(this.setInitialRendering(!1),this.enableSimulation?this.start():this.setMaxIterations(1),this.chart&&this.chart.redraw(),this.setInitialRendering(!0))},setMaxIterations:function(a){this.maxIterations=k(a,this.options.maxIterations)},setTemperature:function(){this.temperature=this.startTemperature=
Math.sqrt(this.nodes.length)},setDiffTemperature:function(){this.diffTemperature=this.startTemperature/(this.options.maxIterations+1)},setInitialRendering:function(a){this.initialRendering=a},createQuadTree:function(){this.quadTree=new b.QuadTree(this.box.left,this.box.top,this.box.width,this.box.height);this.quadTree.insertNodes(this.nodes)},initPositions:function(){var a=this.options.initialPositions;p(a)?(a.call(this),this.nodes.forEach(function(a){m(a.prevX)||(a.prevX=a.plotX);m(a.prevY)||(a.prevY=
a.plotY);a.dispX=0;a.dispY=0})):"circle"===a?this.setCircularPositions():this.setRandomPositions()},setCircularPositions:function(){function a(b){b.linksFrom.forEach(function(b){g[b.toNode.id]||(g[b.toNode.id]=!0,d.push(b.toNode),a(b.toNode))})}var b=this.box,c=this.nodes,r=2*Math.PI/(c.length+1),e=c.filter(function(a){return 0===a.linksTo.length}),d=[],g={},m=this.options.initialPositionRadius;e.forEach(function(b){d.push(b);a(b)});d.length?c.forEach(function(a){-1===d.indexOf(a)&&d.push(a)}):d=
c;d.forEach(function(a,f){a.plotX=a.prevX=k(a.plotX,b.width/2+m*Math.cos(f*r));a.plotY=a.prevY=k(a.plotY,b.height/2+m*Math.sin(f*r));a.dispX=0;a.dispY=0})},setRandomPositions:function(){function a(a){a=a*a/Math.PI;return a-=Math.floor(a)}var b=this.box,c=this.nodes,d=c.length+1;c.forEach(function(f,c){f.plotX=f.prevX=k(f.plotX,b.width*a(c));f.plotY=f.prevY=k(f.plotY,b.height*a(d+c));f.dispX=0;f.dispY=0})},force:function(a){this.integration[a].apply(this,Array.prototype.slice.call(arguments,1))},barycenterForces:function(){this.getBarycenter();
this.force("barycenter")},getBarycenter:function(){var a=0,b=0,c=0;this.nodes.forEach(function(f){b+=f.plotX*f.mass;c+=f.plotY*f.mass;a+=f.mass});return this.barycenter={x:b,y:c,xFactor:b/a,yFactor:c/a}},barnesHutApproximation:function(a,b){var f=this.getDistXY(a,b),c=this.vectorLength(f);if(a!==b&&0!==c)if(b.isInternal)if(b.boxSize/c<this.options.theta&&0!==c){var h=this.repulsiveForce(c,this.k);this.force("repulsive",a,h*b.mass,f,c);var d=!1}else d=!0;else h=this.repulsiveForce(c,this.k),this.force("repulsive",
a,h*b.mass,f,c);return d},repulsiveForces:function(){var a=this;"barnes-hut"===a.approximation?a.nodes.forEach(function(b){a.quadTree.visitNodeRecursive(null,function(f){return a.barnesHutApproximation(b,f)})}):a.nodes.forEach(function(b){a.nodes.forEach(function(f){if(b!==f&&!b.fixedPosition){var c=a.getDistXY(b,f);var d=a.vectorLength(c);if(0!==d){var e=a.repulsiveForce(d,a.k);a.force("repulsive",b,e*f.mass,c,d)}}})})},attractiveForces:function(){var a=this,b,c,d;a.links.forEach(function(f){f.fromNode&&
f.toNode&&(b=a.getDistXY(f.fromNode,f.toNode),c=a.vectorLength(b),0!==c&&(d=a.attractiveForce(c,a.k),a.force("attractive",f,d,b,c)))})},applyLimits:function(){var a=this;a.nodes.forEach(function(b){b.fixedPosition||(a.integration.integrate(a,b),a.applyLimitBox(b,a.box),b.dispX=0,b.dispY=0)})},applyLimitBox:function(a,b){var c=a.radius;a.plotX=g(a.plotX,b.left+c,b.width-c);a.plotY=g(a.plotY,b.top+c,b.height-c)},coolDown:function(a,b,c){return a-b*c},isStable:function(){return.00001>Math.abs(this.systemTemperature-
this.prevSystemTemperature)||0>=this.temperature},getSystemTemperature:function(){return this.nodes.reduce(function(a,b){return a+b.temperature},0)},vectorLength:function(a){return Math.sqrt(a.x*a.x+a.y*a.y)},getDistR:function(a,b){a=this.getDistXY(a,b);return this.vectorLength(a)},getDistXY:function(a,b){var c=a.plotX-b.plotX;a=a.plotY-b.plotY;return{x:c,y:a,absX:Math.abs(c),absY:Math.abs(a)}}});a(d,"predraw",function(){this.graphLayoutsLookup&&this.graphLayoutsLookup.forEach(function(a){a.stop()})});
a(d,"render",function(){function a(a){a.maxIterations--&&isFinite(a.temperature)&&!a.isStable()&&!a.enableSimulation&&(a.beforeStep&&a.beforeStep(),a.step(),d=!1,b=!0)}var b=!1;if(this.graphLayoutsLookup){c(!1,this);for(this.graphLayoutsLookup.forEach(function(a){a.start()});!d;){var d=!0;this.graphLayoutsLookup.forEach(a)}b&&this.series.forEach(function(a){a&&a.layout&&a.render()})}});a(d,"beforePrint",function(){this.graphLayoutsLookup&&(this.graphLayoutsLookup.forEach(function(a){a.updateSimulation(!1)}),
this.redraw())});a(d,"afterPrint",function(){this.graphLayoutsLookup&&this.graphLayoutsLookup.forEach(function(a){a.updateSimulation()});this.redraw()})});l(d,"Series/Networkgraph/DraggableNodes.js",[d["Core/Chart/Chart.js"],d["Core/Globals.js"],d["Core/Utilities.js"]],function(d,a,b){var e=b.addEvent;a.dragNodesMixin={onMouseDown:function(a,b){b=this.chart.pointer.normalize(b);a.fixedPosition={chartX:b.chartX,chartY:b.chartY,plotX:a.plotX,plotY:a.plotY};a.inDragMode=!0},onMouseMove:function(a,b){if(a.fixedPosition&&
a.inDragMode){var c=this.chart;b=c.pointer.normalize(b);var d=a.fixedPosition.chartX-b.chartX,e=a.fixedPosition.chartY-b.chartY;b=c.graphLayoutsLookup;if(5<Math.abs(d)||5<Math.abs(e))d=a.fixedPosition.plotX-d,e=a.fixedPosition.plotY-e,c.isInsidePlot(d,e)&&(a.plotX=d,a.plotY=e,a.hasDragged=!0,this.redrawHalo(a),b.forEach(function(a){a.restartSimulation()}))}},onMouseUp:function(a,b){a.fixedPosition&&(a.hasDragged&&(this.layout.enableSimulation?this.layout.start():this.chart.redraw()),a.inDragMode=
a.hasDragged=!1,this.options.fixedDraggable||delete a.fixedPosition)},redrawHalo:function(a){a&&this.halo&&this.halo.attr({d:a.haloPath(this.options.states.hover.halo.size)})}};e(d,"load",function(){var a=this,b,d,l;a.container&&(b=e(a.container,"mousedown",function(b){var c=a.hoverPoint;c&&c.series&&c.series.hasDraggableNodes&&c.series.options.draggable&&(c.series.onMouseDown(c,b),d=e(a.container,"mousemove",function(a){return c&&c.series&&c.series.onMouseMove(c,a)}),l=e(a.container.ownerDocument,
"mouseup",function(a){d();l();return c&&c.series&&c.series.onMouseUp(c,a)}))}));e(a,"destroy",function(){b()})})});l(d,"Series/Networkgraph/Networkgraph.js",[d["Core/Series/Series.js"],d["Core/Globals.js"],d["Mixins/Nodes.js"],d["Core/Series/Point.js"],d["Core/Utilities.js"]],function(d,a,b,e,c){var g=c.addEvent,l=c.css,n=c.defined,p=c.pick,k=a.Series,h=d.seriesTypes;c=a.dragNodesMixin;"";d.seriesType("networkgraph","line",{stickyTracking:!1,inactiveOtherPoints:!0,marker:{enabled:!0,states:{inactive:{opacity:.3,
animation:{duration:50}}}},states:{inactive:{linkOpacity:.3,animation:{duration:50}}},dataLabels:{formatter:function(){return this.key},linkFormatter:function(){return this.point.fromNode.name+"<br>"+this.point.toNode.name},linkTextPath:{enabled:!0},textPath:{enabled:!1},style:{transition:"opacity 2000ms"}},link:{color:"rgba(100, 100, 100, 0.5)",width:1},draggable:!0,layoutAlgorithm:{initialPositions:"circle",initialPositionRadius:1,enableSimulation:!1,theta:.5,maxSpeed:10,approximation:"none",type:"reingold-fruchterman",
integration:"euler",maxIterations:1E3,gravitationalConstant:.0625,friction:-.981},showInLegend:!1},{forces:["barycenter","repulsive","attractive"],hasDraggableNodes:!0,drawGraph:null,isCartesian:!1,requireSorting:!1,directTouch:!0,noSharedTooltip:!0,pointArrayMap:["from","to"],trackerGroups:["group","markerGroup","dataLabelsGroup"],drawTracker:a.TrackerMixin.drawTrackerPoint,animate:null,buildKDTree:a.noop,createNode:b.createNode,destroy:function(){this.layout&&this.layout.removeElementFromCollection(this,
this.layout.series);b.destroy.call(this)},init:function(){k.prototype.init.apply(this,arguments);g(this,"updatedData",function(){this.layout&&this.layout.stop()});return this},generatePoints:function(){var a;b.generatePoints.apply(this,arguments);this.options.nodes&&this.options.nodes.forEach(function(a){this.nodeLookup[a.id]||(this.nodeLookup[a.id]=this.createNode(a.id))},this);for(a=this.nodes.length-1;0<=a;a--){var c=this.nodes[a];c.degree=c.getDegree();c.radius=p(c.marker&&c.marker.radius,this.options.marker&&
this.options.marker.radius,0);this.nodeLookup[c.id]||c.remove()}this.data.forEach(function(a){a.formatPrefix="link"});this.indexateNodes()},getPointsCollection:function(){return this.nodes||[]},indexateNodes:function(){this.nodes.forEach(function(a,b){a.index=b})},markerAttribs:function(a,b){b=k.prototype.markerAttribs.call(this,a,b);n(a.plotY)||(b.y=0);b.x=(a.plotX||0)-(b.width/2||0);return b},translate:function(){this.processedXData||this.processData();this.generatePoints();this.deferLayout();this.nodes.forEach(function(a){a.isInside=
!0;a.linksFrom.forEach(function(a){a.shapeType="path";a.y=1})})},deferLayout:function(){var b=this.options.layoutAlgorithm,c=this.chart.graphLayoutsStorage,d=this.chart.graphLayoutsLookup,e=this.chart.options.chart;if(this.visible){c||(this.chart.graphLayoutsStorage=c={},this.chart.graphLayoutsLookup=d=[]);var g=c[b.type];g||(b.enableSimulation=n(e.forExport)?!e.forExport:b.enableSimulation,c[b.type]=g=new a.layouts[b.type],g.init(b),d.splice(g.index,0,g));this.layout=g;g.setArea(0,0,this.chart.plotWidth,
this.chart.plotHeight);g.addElementsToCollection([this],g.series);g.addElementsToCollection(this.nodes,g.nodes);g.addElementsToCollection(this.points,g.links)}},render:function(){var a=this.points,b=this.chart.hoverPoint,c=[];this.points=this.nodes;h.line.prototype.render.call(this);this.points=a;a.forEach(function(a){a.fromNode&&a.toNode&&(a.renderLink(),a.redrawLink())});b&&b.series===this&&this.redrawHalo(b);this.chart.hasRendered&&!this.options.dataLabels.allowOverlap&&(this.nodes.concat(this.points).forEach(function(a){a.dataLabel&&
c.push(a.dataLabel)}),this.chart.hideOverlappingLabels(c))},drawDataLabels:function(){var a=this.options.dataLabels.textPath;k.prototype.drawDataLabels.apply(this,arguments);this.points=this.data;this.options.dataLabels.textPath=this.options.dataLabels.linkTextPath;k.prototype.drawDataLabels.apply(this,arguments);this.points=this.nodes;this.options.dataLabels.textPath=a},pointAttribs:function(a,b){var c=b||a&&a.state||"normal";b=k.prototype.pointAttribs.call(this,a,c);c=this.options.states[c];a&&
!a.isNode&&(b=a.getLinkAttributes(),c&&(b={stroke:c.linkColor||b.stroke,dashstyle:c.linkDashStyle||b.dashstyle,opacity:p(c.linkOpacity,b.opacity),"stroke-width":c.linkColor||b["stroke-width"]}));return b},redrawHalo:c.redrawHalo,onMouseDown:c.onMouseDown,onMouseMove:c.onMouseMove,onMouseUp:c.onMouseUp,setState:function(a,b){b?(this.points=this.nodes.concat(this.data),k.prototype.setState.apply(this,arguments),this.points=this.data):k.prototype.setState.apply(this,arguments);this.layout.simulation||
a||this.render()}},{setState:b.setNodeState,init:function(){e.prototype.init.apply(this,arguments);this.series.options.draggable&&!this.series.chart.styledMode&&(g(this,"mouseOver",function(){l(this.series.chart.container,{cursor:"move"})}),g(this,"mouseOut",function(){l(this.series.chart.container,{cursor:"default"})}));return this},getDegree:function(){var a=this.isNode?this.linksFrom.length+this.linksTo.length:0;return 0===a?1:a},getLinkAttributes:function(){var a=this.series.options.link,b=this.options;
return{"stroke-width":p(b.width,a.width),stroke:b.color||a.color,dashstyle:b.dashStyle||a.dashStyle,opacity:p(b.opacity,a.opacity,1)}},renderLink:function(){if(!this.graphic&&(this.graphic=this.series.chart.renderer.path(this.getLinkPath()).add(this.series.group),!this.series.chart.styledMode)){var a=this.series.pointAttribs(this);this.graphic.attr(a);(this.dataLabels||[]).forEach(function(b){b&&b.attr({opacity:a.opacity})})}},redrawLink:function(){var a=this.getLinkPath();if(this.graphic){this.shapeArgs=
{d:a};if(!this.series.chart.styledMode){var b=this.series.pointAttribs(this);this.graphic.attr(b);(this.dataLabels||[]).forEach(function(a){a&&a.attr({opacity:b.opacity})})}this.graphic.animate(this.shapeArgs);var c=a[0];a=a[1];"M"===c[0]&&"L"===a[0]&&(this.plotX=(c[1]+a[1])/2,this.plotY=(c[2]+a[2])/2)}},getMass:function(){var a=this.fromNode.mass,b=this.toNode.mass,c=a+b;return{fromNode:1-a/c,toNode:1-b/c}},getLinkPath:function(){var a=this.fromNode,b=this.toNode;a.plotX>b.plotX&&(a=this.toNode,
b=this.fromNode);return[["M",a.plotX||0,a.plotY||0],["L",b.plotX||0,b.plotY||0]]},isValid:function(){return!this.isNode||n(this.id)},remove:function(a,b){var c=this.series,d=c.options.nodes||[],e,f=d.length;if(this.isNode){c.points=[];[].concat(this.linksFrom).concat(this.linksTo).forEach(function(a){e=a.fromNode.linksFrom.indexOf(a);-1<e&&a.fromNode.linksFrom.splice(e,1);e=a.toNode.linksTo.indexOf(a);-1<e&&a.toNode.linksTo.splice(e,1);k.prototype.removePoint.call(c,c.data.indexOf(a),!1,!1)});c.points=
c.data.slice();for(c.nodes.splice(c.nodes.indexOf(this),1);f--;)if(d[f].id===this.options.id){c.options.nodes.splice(f,1);break}this&&this.destroy();c.isDirty=!0;c.isDirtyData=!0;a&&c.chart.redraw(a)}else c.removePoint(c.data.indexOf(this),a,b)},destroy:function(){this.isNode&&this.linksFrom.concat(this.linksTo).forEach(function(a){a.destroyElements&&a.destroyElements()});this.series.layout.removeElementFromCollection(this,this.series.layout[this.isNode?"nodes":"links"]);return e.prototype.destroy.apply(this,
arguments)}});""});l(d,"masters/modules/networkgraph.src.js",[],function(){})});
//# sourceMappingURL=networkgraph.js.map