
var SFMatrix4f = x3dom.fields.SFMatrix4f;
var SFVec3f = x3dom.fields.SFVec3f;

$.fn.x3dSync = (function () {
    return function (options, command) {
        var api;

        if (this.data('x3dsync')) {
            api = this.data('x3dsync');
        } else {
            api = new X3DCanvasAPI(_.extend(options, {
                origin: this
            }));
            this.data('x3dsync', api);

            api.bind();
        }

        // get the command;
        if (typeof options === 'string' && _.include(_.keys(api), options)) {
            command = options;
            return _.isFunction(api[command]) ? api[command]() : api[command];
        }

        return this;
    };
})();

function X3DCanvasAPI(options) {
    this.active = null;
    this.origin = options.origin;
    this.connected = options.connected || null;
    this.viewport = options.viewport || 'both'; // 'dest', 'origin'
}

X3DCanvasAPI.prototype = {

    setActive: function ($active) {
        this.active = $active;
        clearTimeout(this._reset);
        this._reset = setTimeout(this.resetActive.bind(this), 60);
    },

    resetActive: function () {
        this.active = null;
        clearTimeout(this._reset);
    },

    bind: function () {
        var $dest = this.connected;
        var $origin = this.origin;

        if (this.viewport !== 'origin') {
            try {
                $dest.find('viewpoint').on('viewpointChanged', function (event) {
                    if ($dest !== this.active && this.active !== null) return;
                    this.setActive($dest);
                    this.setOrientation($origin[0].runtime, $dest[0].runtime);
                }.bind(this));
            } catch (e) {
                console.error(e);
            }
        }

        if (this.viewport !== 'dest') {
            try {
                $origin.find('viewpoint').on('viewpointChanged', function (event) {
                    if ($origin !== this.active && this.active !== null) return;
                    this.setActive($origin);
                    this.setOrientation($dest[0].runtime, $origin[0].runtime);
                }.bind(this));
            } catch (e) {
                console.error(e);
            }
        }
    },
    setOrientation: function (dest, origin) {
        try {
            var destViewpoint = dest.viewpoint();
            var originVp = origin.viewpoint();
            var originVm = origin.viewMatrix();
            var _viewarea = dest.canvas.doc._viewarea;

            var viewpointPosition = dest.viewMatrix().inverse().e3();
            var distanceToCoR = destViewpoint.getCenterOfRotation().subtract(viewpointPosition).length();

            var upVector = this.getUpVector(origin);

            var originCameraPos = originVm.inverse().e3().subtract(
                                                            originVp.getCenterOfRotation()
                                                        ).normalize().multiply(distanceToCoR);

            var cameraPosition = destViewpoint.getCenterOfRotation().add(originCameraPos);
            var lookAtPosition = destViewpoint.getCenterOfRotation(); // keep current looking position

            var pos = SFMatrix4f.lookAt(cameraPosition, lookAtPosition, upVector);

            _viewarea._rotMat = SFMatrix4f.identity();
            _viewarea._movement = new SFVec3f(0, 0, 0);
            _viewarea._transMat = SFMatrix4f.identity();

            destViewpoint.setView(pos.inverse());
            dest.triggerRedraw();

        } catch (e) {
            console.error(e);
        }
    },

    getUpVector: function (originRuntime) {
        var originVp = originRuntime.viewpoint();
        var originVm = originRuntime.viewMatrix();

        // Taken from x3dom fire viewpointChanged
        var e_viewtrafo = originVp.getCurrentTransform();
        e_viewtrafo = e_viewtrafo.inverse().mult(originVm);
        var e_mat = e_viewtrafo.inverse();
        var e_rotation = new x3dom.fields.Quaternion(0, 0, 1, 0);
        e_rotation.setValue(e_mat);

        return e_rotation.toMatrix().e1();
    }
};