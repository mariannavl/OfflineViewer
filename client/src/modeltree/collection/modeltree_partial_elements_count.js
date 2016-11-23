Viewer.module("ModelTree", function(ModelTree, Viewer, Backbone, Mn, $, _) {
    var PartialElementsCount = Backbone.Model.extend({
        initialize: function() {
            this.listenTo(Viewer, 'model:elements:loaded', this.countChildren);// this.toJSON(), this.partialModel)
        },
        countChildren: function(elements, partialModel) {
            this.set(partialModel, elements.length);
        }
    });

    ModelTree.partialModelChildrenCount = new PartialElementsCount();
});