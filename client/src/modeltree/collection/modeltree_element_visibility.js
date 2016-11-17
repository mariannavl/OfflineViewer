Viewer.module('ModelTree', function(ModelTree, Viewer, Backbone, Marionette, $, _) {
    var ElementVisibilityCollection = Backbone.Collection.extend({
        initialize: function() {
            this.listenTo(Viewer.vent, 'screen:parts:hideAll', this.hideAll);
            this.listenTo(Viewer.vent, 'screen:parts:showAll', this.reset);
            this.listenTo(Viewer.vent, 'screen:parts:show', this.partsToShow);
            this.listenTo(Viewer.vent, 'screen:parts:hide', this.partsToHide);
        },
        hideAll: function() {
            var allParts = ModelTree.modeltreeElementsCollection.map(function(model) {
                return {id: model.id}
            });
            this.add(allParts);
        },
        showAll: function() {
            this.reset();
        },
        partsToShow: function(partIDs) {
            this.remove(partIDs);
        },
        partsToHide: function(partIds) {
            this.add(toModels(partIds));
        }
    });

    function toModels(partIds) {
        return _.map(partIds, function(partId) { return {id: partId}});
    }

    ModelTree.elementVisibility = new ElementVisibilityCollection();
});