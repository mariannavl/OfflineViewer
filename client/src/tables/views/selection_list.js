Viewer.module("ObjecTables", function(ObjecTables, Viewer, Mn, $, _) {

    ObjecTables.SelectionList = Marionette.CollectionView.extend({
        childView: ObjecTables.SelectionItemView,
        attributes: {
            style: 'max-height: 500px;overflow:auto'
        },
        initialize: function() {
            this.collection = Viewer.ModelTree.elementSelection;

            this.listenTo(Viewer, 'unload:all', this.resetCollection);
        },

        resetCollection: function(){
            this.collection.reset();
        }
    });
});