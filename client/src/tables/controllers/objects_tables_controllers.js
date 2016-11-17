Viewer.module("ObjecTables", function (ObjecTables, Viewer, Backbone, Marionette, $, _) {

    ObjecTables.Controller = {
        displaySelectedObjectsTable: function() {
            var selectedObjectsView = new Viewer.ObjecTables.SelectionList();

            Viewer.selectedObjectsContainer.show(selectedObjectsView);
        },
        displayHiddenObjectsTable: function() {
            var hiddenObjectsView = new Viewer.ObjecTables.VisibilityList();

            Viewer.hiddenObjectsContainer.show(hiddenObjectsView);
        }
    };
});
