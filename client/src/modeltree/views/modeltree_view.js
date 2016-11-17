Viewer.module("ModelTree", function(ModelTree, Viewer, Backbone, Marionette, $, _) {

    Viewer.ModelTreeLayout = Marionette.LayoutView.extend({
        template: '#modeltree-layout',
        regions: {
            toolbarRegion: '#modeltree-toolbar-region',
            listRegion: '#modeltree-list-region'
        },
        // initialize: function() {
        //     this.collection = partialModelsCollection;
        // }
        onShow: function() {
            // this.toolbarRegion.show()
            this.listRegion.show(new ModelTree.RootElementsView());
        }
    });
});