Viewer.module('ModelTree', function(ModelTree, Viewer, Backbone, Mn, $, _) {

    ModelTree.ModelTreeChildrenView = Marionette.CollectionView.extend({
        itemView: ModelTree.ModelTreeListItem,
        initialize: function(options) {
            var collection = ModelTree.elementChildrenCollection.get(options.model.id);
        }
    });
});