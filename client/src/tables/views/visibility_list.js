Viewer.module("ObjecTables", function(ObjecTables, Viewer, Mn, $, _) {

    ObjecTables.VisibilityList = Marionette.CollectionView.extend({
        childView: ObjecTables.VisibilityItemView,
        attributes: {
            style: 'max-height: 500px;overflow:auto'
        },
        initialize: function() {
            this.collection = Viewer.ModelTree.elementVisibility;

            this.listenTo(Viewer, 'unload:all', this.resetCollection);
        },
        resetCollection: function() {
            this.collection.reset();
        }
    });
});