/** X3DOM Runtime, http://www.x3dom.org/ 1.7.1-dev - 4ad9525058bfc7df0be3a737d4fbdb2047783d94 - Thu Nov 26 16:51:24 2015 +0100 */
x3dom.registerNodeType("HAnimDisplacer","H-Anim",defineClass(x3dom.nodeTypes.X3DGeometricPropertyNode,function(ctx){x3dom.nodeTypes.HAnimDisplacer.superClass.call(this,ctx);this.addField_SFString(ctx,'name',"");this.addField_SFFloat(ctx,'weight',0);this.addField_MFInt32(ctx,'coordIndex',[]);this.addField_MFVec3f(ctx,'displacements',[]);x3dom.debug.logWarning("HAnimDisplacer NYI!");}));x3dom.registerNodeType("HAnimJoint","H-Anim",defineClass(x3dom.nodeTypes.Transform,function(ctx){x3dom.nodeTypes.HAnimJoint.superClass.call(this,ctx);this.addField_SFString(ctx,'name',"");this.addField_MFNode('displacers',x3dom.nodeTypes.HAnimDisplacer);this.addField_SFRotation(ctx,'limitOrientation',0,0,1,0);this.addField_MFFloat(ctx,'llimit',[]);this.addField_MFFloat(ctx,'ulimit',[]);this.addField_MFInt32(ctx,'skinCoordIndex',[]);this.addField_MFFloat(ctx,'skinCoordWeight',[]);}));x3dom.registerNodeType("HAnimSegment","H-Anim",defineClass(x3dom.nodeTypes.X3DGroupingNode,function(ctx){x3dom.nodeTypes.HAnimSegment.superClass.call(this,ctx);this.addField_SFString(ctx,'name',"");this.addField_SFVec3f(ctx,'centerOfMass',0,0,0);this.addField_SFFloat(ctx,'mass',0);this.addField_MFFloat(ctx,'momentsOfInertia',[0,0,0,0,0,0,0,0,0]);this.addField_SFNode('coord',x3dom.nodeTypes.X3DCoordinateNode);this.addField_MFNode('displacers',x3dom.nodeTypes.HAnimDisplacer);},{}));x3dom.registerNodeType("HAnimSite","H-Anim",defineClass(x3dom.nodeTypes.Transform,function(ctx){x3dom.nodeTypes.HAnimSite.superClass.call(this,ctx);this.addField_SFString(ctx,'name',"");}));x3dom.registerNodeType("HAnimHumanoid","H-Anim",defineClass(x3dom.nodeTypes.Transform,function(ctx){x3dom.nodeTypes.HAnimHumanoid.superClass.call(this,ctx);this.addField_SFString(ctx,'name',"");this.addField_SFString(ctx,'version',"");this.addField_MFString(ctx,'info',[]);this.addField_MFNode('joints',x3dom.nodeTypes.HAnimJoint);this.addField_MFNode('segments',x3dom.nodeTypes.HAnimSegment);this.addField_MFNode('sites',x3dom.nodeTypes.HAnimSite);this.addField_MFNode('skeleton',x3dom.nodeTypes.HAnimJoint);this.addField_MFNode('skin',x3dom.nodeTypes.X3DChildNode);this.addField_MFNode('skinCoord',x3dom.nodeTypes.X3DCoordinateNode);this.addField_MFNode('skinNormal',x3dom.nodeTypes.X3DNormalNode);this.addField_MFNode('viewpoints',x3dom.nodeTypes.HAnimSite);},{}));