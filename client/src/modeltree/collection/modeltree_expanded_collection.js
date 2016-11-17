/**
 * Contains expanded models ids
 */
Viewer.module('ModelTree', function(ModelTree, Viewer, Backbone, Mn, $, _) {
    var ExpandedElementsCollection = Backbone.Collection.extend({
        initialize: function() {
            this.listenTo(Viewer, 'expand:element', this.expandElement);
            this.listenTo(Viewer, 'collapse:element', this.collapseElement);
        },
        expandElement: function(partIds) {
            this.add(toModels(partIds));
        },
        collapseElement: function(partIds) {
            this.remove(partIds)
        }
    });

    function toModels(partIds) {
        return _.map(partIds, function(partId) { return {id: partId}});
    }

    ModelTree.expandedElementsCollection = new ExpandedElementsCollection();
});