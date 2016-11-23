Viewer.module("ModelTree", function(ModelTree, Viewer, Backbone, Mn, $, _) {
    ModelTree.ModelTreeCountView = Marionette.ItemView.extend({
        template: '#modeltree-items-count',
        className: 'counter',
        serializeData: function() {
            var partialModel = this.model.get('partialModel');
            return {
                count: ModelTree.partialModelChildrenCount.get(partialModel)
            }
        }
    })
})