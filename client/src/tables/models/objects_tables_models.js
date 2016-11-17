Viewer.module('ObjecTables', function(ObjectsTablesModels, App, Backbone, Marionette, $, _){
    'use strict';

    ObjectsTablesModels.ObjectsTableRow = Backbone.Model.extend({
        defaults:{
            //'partID': ''
        }
    });

    ObjectsTablesModels.ObjectsTable = Backbone.Collection.extend({
        model: ObjectsTablesModels.ObjectsTableRow
    });
});