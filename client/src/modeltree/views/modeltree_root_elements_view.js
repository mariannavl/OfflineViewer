Viewer.module('ModelTree', function(ModelTree, Viewer, Backbone, Mn, $, _) {

    ModelTree.RootElementsView = ModelTree.ModelTreeList.extend({
        initialize: function() {
            this.collection = ModelTree.partialModelsCollection;
        }
    });
});