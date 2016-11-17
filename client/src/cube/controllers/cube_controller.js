Viewer.module('Cube', function(Cube, Viewer, Backbone, Mn, $, _) {
    Cube.Controller = {
        displayCube: function() {
            Viewer.cube.show(new Cube.X3DCubeView());
        }
    };

    Cube.addInitializer(function() {
        Viewer.on('load:transform', Cube.Controller.displayCube);
    });
});