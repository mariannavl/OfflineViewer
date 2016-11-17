x3dom.runtime.ready = Ready; // preserver old x3dom.runtime.ready method ?

// Overwrite default onWheel and onDrag methods passing the true mouseY position
// Original method did not pass he `originalY` paramter
x3dom.X3DDocument.prototype.onWheel = function (ctx, x, y, originalY) {
    if (!ctx || !this._viewarea) {
        return;
    }

    if (this._viewarea._scene._vf.doPickPass)
        ctx.pickValue(this._viewarea, x, originalY, 0);

    this._viewarea.onDrag(x, y, 2, originalY);
};

// Handle and pass through the originalY parameter
x3dom.Viewarea.prototype.onDrag = function (x, y, buttonState, originalY){
    this.handleMoveEvt(x, y, buttonState);

    if (this._currentInputType == x3dom.InputTypes.NAVIGATION) {
        this._scene.getNavigationInfo()._impl.onDrag(this, x, y, buttonState, originalY);
    }
};

function CustomNavigation(naviNode) {
    // Navigation Info
    this.navi = naviNode;
}

CustomNavigation.prototype = {

    init: function(view, flyTo) {
        this.view = view;
    },

    navigateTo: function(view, timestamp) {
        return true;
    },

    onMousePress: function(view, x, y, button) {
    },

    onDrag: function(view, x, y, button, originalY) {
        var mat;
        var dx = x - view._lastX;
        var dy = y - view._lastY;

        var viewpoint = view._scene.getViewpoint();
        var center = viewpoint.getCenterOfRotation();

        if (isRotating(button)) {

            alpha = (dy * 2 * Math.PI) / view._width;
            beta = (dx * 2 * Math.PI) / view._height;

            mat = view.getViewMatrix();

            var mx = x3dom.fields.SFMatrix4f.rotationX(alpha);
            var my = x3dom.fields.SFMatrix4f.rotationY(beta);

            var center = viewpoint.getCenterOfRotation();
            mat.setTranslate(new x3dom.fields.SFVec3f(0,0,0));

            view._rotMat = view._rotMat.
            mult(mat.inverse()).mult(mx).mult(my).mult(mat);
        }

        if (isPanning(button)) {
            d = (view._scene._lastMax.subtract(view._scene._lastMin)).length();
            // TODO: Hardcoded speed
            d = ((d < x3dom.fields.Eps) ? 1 : d) *  5; //navi._vf.speed;

            vec = new x3dom.fields.SFVec3f(d*dx/view._width, d*(-dy)/view._height, 0);
            view._movement = view._movement.add(vec);

            mat = view.getViewpointMatrix().mult(view._transMat);

            view._transMat = mat.inverse().
            mult(x3dom.fields.SFMatrix4f.translation(view._movement)).
            mult(mat);
        }

        if(isZooming(button)) {
            var viewingRay = [];
            var line = this.getHitRay(x, y); // originalY instead of y ?
            var offsetX = (1 - x/view._width * 2); // offset from center
            var offsetY = (1 - originalY/view._height * 2); // offset from center
            var z = line.dist === 0 ? 1 : line.dist * .1; // prevent navigation lock when distance to object is 0
            var vec = new x3dom.fields.SFVec3f(0, 0, -z);
            var centerLine = this.getHitRay(view._width * .5, view._height * .5);

            mat = view.getViewpointMatrix().mult(view._transMat);

            if(line.hitObject) {
                // zoom in
                if(dy < 0) {
                    // if(line.dist < 4) {
                    //     vec = new x3dom.fields.SFVec3f(0, 0, z);
                    // } else {
                    // }
                    vec = new x3dom.fields.SFVec3f(offsetX, -offsetY, z);
                }
            } else {
                if(centerLine.hitObject) {
                    z = centerLine.dist * .1;
                } else {
                    z = 1;
                }

                vec = new x3dom.fields.SFVec3f(0, 0, -z);
                if(dy < 0) vec = vec.negate();
            }

            view._movement = view._movement.add(vec);
            view._transMat = mat.inverse().
            mult(x3dom.fields.SFMatrix4f.translation(view._movement)).
            mult(mat);

        }

        view._lastY = y;
        view._lastX = x;
    },

    getHitRay: function(x, y) {
        var line = this.view.calcViewRay(x, y); // runtime getViewingRay(x, y)
        this.view._scene.doIntersect(line);
        return line;
    }
}

function isRotating(btn) {
    return btn === 1;
}

function isZooming(btn) {
    return btn === 2;
}

function isPanning(btn) {
    return btn === 4;
}

function onReady(callback) {
    // implement observer pattern
}

function Ready() {
    var runtime = this; // reference to x3d.runtime

    navInfo = runtime.canvas.doc._viewarea._scene.getNavigationInfo();

    navInfo._typeMapping['custom'] = CustomNavigation;
    navInfo._validTypes.push('custom');

    //navInfo.setType('custom');

    // invoke onReady handlers
}