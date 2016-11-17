Viewer.module('ModelTree', function(ModelTree, Viewer, Backbone, Marionette, $, _) {
    ModelTree.Controller = {
        displayModelTree: function() {
            Viewer.modelTreeContainer.show(new Viewer.ModelTreeLayout());
        },
        // decouple children view and item view, because of recursive dependency
        getModelTreeList: function(options) {
            return new ModelTree.ModelTreeList(options);
        }
    }
});