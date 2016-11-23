Viewer.module("Navigation", function (Navigation, Viewer, Backbone, Marionette, $, _) {
  Navigation.NavigationView = Marionette.ItemView.extend({
    tagName: "dd",
    id: "navigation-menu",
    className: "accordion-navigation",
    template: "#navigation-menu-template",
    events: {
      "click .nav-type": "changeNavigationType"
    },
    changeNavigationType: function (e) {
      e.preventDefault();

      var navigation = $(e.target);

      navigation.parents('ul')
                .find(".nav-type")
                .removeClass("highlight");
      navigation.addClass("highlight");

      Viewer.trigger("viewer:changeNav", navigation.data("type"));
    }
  });
});
