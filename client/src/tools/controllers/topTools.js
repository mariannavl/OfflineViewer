Viewer.module("Tools", function(Tools, Viewer, Backbone, Marionette, $, _){
    Tools.Controller = function() {
        this.view = new Tools.ToolsView();
    };

    _.extend(Tools.Controller.prototype, {
        show: function() {
            Viewer.tools.show(this.view);
        }
    });
});
