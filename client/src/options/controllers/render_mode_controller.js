/**
 * Created by Antonia Koleva on 12-Jan-15.
 */
Viewer.module("RenderMode", function (RenderMode, Viewer, Backbone, Marionette, $, _) {
    RenderMode.Controller = {
        displayRenderModeMenu: function() {
            var renderModeView = new RenderMode.RenderModeView();

            Viewer.renderModeMenu.show(renderModeView);
        }
    };
});

