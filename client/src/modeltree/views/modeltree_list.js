Viewer.module("ModelTree", function (ModelTree, Viewer) {

    ModelTree.ModelTreeList = Marionette.CollectionView.extend({
        childView: ModelTree.ModelTreeListItem,
        childViewOptions: function(model) {
            return {
                model: model,
                indent: this.indent + 18
            }
        },
        initialize: function(options) {
            this.indent = options.indent;
            var childViews = ModelTree.elementChildrenCollection.get(this.model.id);
            this.collection = new Backbone.Collection();
            this.collection.add(childViews);
        }
    });
});