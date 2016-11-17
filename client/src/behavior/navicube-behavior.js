var SFMatrix4f = x3dom.fields.SFMatrix4f;
var SFVec3f = x3dom.fields.SFVec3f;

var NavicubeBehavior = Marionette.Behavior.extend({
    ui: {
        'inline': 'inline'
    },
    onRender: function () {
        this.ui.inline[0].onload = this.delegateBoxEvents.bind(this);
    },
    delegateBoxEvents: function () {
        var $boxes = this.ui.inline.find('box');
        $boxes.on('mouseover', this.onMouseOver.bind(this))
              .on('mouseout', this.onMouseOut.bind(this))
              .on('mousedown', this.onMouseDown.bind(this))
              .on('click', this.onClick.bind(this));
    },
    onMouseDown: function (e) {
        this.mouseDown = {
            x: e.originalEvent.layerX,
            y: e.originalEvent.layerY
        };
    },
    onClick: function (e) {
        var mouse = { x: e.originalEvent.layerX, y: e.originalEvent.layerY };
        var mouseDown = this.mouseDown;

        if (Math.max(Math.abs(mouseDown.x - mouse.x), Math.abs(mouseDown.y - mouse.y)) > 10) {
            console.log('onDrag detected! click prevented');
            return;
        }

        var runtime = this.$el.get(0).runtime;
        var x3dViewpoint = runtime.viewpoint();
        var viewpoint = e.currentTarget._x3domNode;

        var pos = viewpoint.getCurrentTransform().e3();

        var distance = x3dViewpoint.getViewMatrix().e3().subtract(x3dViewpoint.getCenterOfRotation()).length();

        var upVector = new SFVec3f(0, 1, 0);
        var dotProd = (new SFVec3f(pos.x, pos.y, pos.z)).normalize().dot(upVector);

        // up vector and the line of sign are the same, needs to define witch will be the up vector
        if (Math.abs(dotProd) === 1) {
            upVector = new SFVec3f(dotProd, 0, 0);
        }

        var lookAt = SFMatrix4f.lookAt(pos.normalize().multiply(distance), new SFVec3f(0, 0, 0), upVector);
        var thisX3D = $(e.currentTarget).parents('x3d')[0];

        thisX3D.runtime.canvas.doc._viewarea.animateTo(lookAt.inverse(), thisX3D.runtime.viewpoint());
        thisX3D.runtime.triggerRedraw();

    },
    onMouseOver: function (e) {
        var $shape = $(e.target);
        var $material = $shape.find('material, Material');

        if ($material.length) {
            $material.attr('diffuseColor', '1,1,0');
        }
    },
    onMouseOut: function (e) {
        var $shape = $(e.target);

        var $material = $shape.find('material, Material');
        var material = $material.attr('metadata') ? $material.attr('metadata') :
                                                    '.5,.5,.5';

        if ($material.length) {
            $material.attr('diffuseColor', material);
        }
    }
});