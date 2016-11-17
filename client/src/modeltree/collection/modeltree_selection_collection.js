Viewer.module('ModelTree', function(ModelTree, Viewer, Backbone, Marionette, $, _) {
    var ElementSelectionCollection = Backbone.Collection.extend({
        initialize: function() {
            this.listenTo(Viewer.vent, 'screen:deselectAll', this.reset);
            this.listenTo(Viewer.vent, 'screen:part:deselected', this.partToDeselect);
            this.listenTo(Viewer.vent, 'screen:part:selected', this.partToSelect);
        },
        partToDeselect: function(partIDs) {
            this.remove(partIDs);
        },
        partToSelect: function(partIds) {
            this.add(toModels(partIds));
        }
    });

    function toModels(partIds) {
        return _.map(partIds, function(partId) { return {id: partId}});
    }

    ModelTree.elementSelection = new ElementSelectionCollection();
});