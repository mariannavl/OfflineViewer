/**
 * Created by Antonia Koleva on 12-Jan-15.
 */
Viewer.module("RenderMode", function(RenderMode, Viewer, Backbone, Marionette, $, _) {
    RenderMode.RenderModeView = Marionette.ItemView.extend({
       tagName: "dd",
       id: "render-mode",
       className: "accordion-navigation",
       template: "#render-mode-template",
       events: {
           "click .nav-type": "changeRenderMode"
       },
       changeRenderMode: function(e) {
           e.preventDefault();

           var renderMode = $(e.target);

           renderMode.parents('ul')
                        .find(".nav-type")
                        .removeClass("highlight");
           renderMode.addClass("highlight");

           Viewer.trigger("viewer:changeRenderMode", renderMode.data("type"));
       }
    });
});