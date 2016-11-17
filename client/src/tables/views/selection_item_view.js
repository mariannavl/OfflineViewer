Viewer.module("ObjecTables", function(ObjecTables, Viewer, Mn, $, _) {

    ObjecTables.SelectionItemView = Marionette.ItemView.extend({
        template: '#table-item-view',
        className: 'list-item',
        events: {
            'click .remove': 'removeElement'
        },
        serializeData: function() {
            var partName = Viewer.ModelTree.modeltreeElementsCollection.get(this.model.id);

            return _.extend(this.model.toJSON(), {
                name: partName.get('name')
            });
        },
        removeElement: function() {
            Viewer.vent.trigger('screen:part:deselected', [this.model.id] )
        }
    });
});