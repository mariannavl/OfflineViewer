Viewer.module('Tools', function(Tools, Viewer, Backbone, Marionette, $, _){
    Tools.ToolsView = Marionette.ItemView.extend({
        template: '#tools-template',
        events: {
            'click [cmd="fit-all"]': 'fitAll',
            'click [cmd="hide-all"]': 'hideAll',
            'click [cmd="show-all"]': 'showAll',
            'click [cmd="deselect-all"]': 'deselectAll',
            'click [cmd="switch-light"]': 'switchLight',
            'click [cmd="hide-selected"]': 'hideSelected',
            'click [cmd="show-selected"]': 'showSelected',
            'click [cmd="switch-colors"]': 'switchColors'
        },
        hideAll: function() {
            Viewer.vent.trigger('screen:parts:hideAll');
        },
        showAll: function() {
            Viewer.vent.trigger('screen:parts:showAll');
        },
        hideSelected: function() {
            var selected = Viewer.ModelTree.elementSelection.pluck('id');
            Viewer.vent.trigger('screen:parts:hide', selected);
        },
        showSelected: function() {
            var selected = Viewer.ModelTree.elementSelection.pluck('id');
            Viewer.vent.trigger('screen:parts:show', selected);
        },
        switchColors: function() {
            Viewer.vent.trigger('scene:switch-colors:toggle');
        },
        switchLight: function() {
            Viewer.vent.trigger('scene:switch-lights:toggle');
        },
        fitAll: function() {
            Viewer.vent.trigger('scene:fit:all');
        },
        deselectAll: function() {
            Viewer.vent.trigger('screen:deselectAll');
        }
    });
});
