Viewer.module("Navigation", function (Navigation, Viewer, Backbone, Marionette, $, _) {
  Navigation.NavigationOptionsView = Marionette.ItemView.extend({
    tagName: "dd",
    id: "navigation-menu",
    className: "accordion-navigation",
    template: "#navigation-options-template",
    events: {
      "change #speed": "updateOption",
      "change #transition-type": "updateOption",
      "change #transition-time": "updateOption",
      "click button.js-reset": "resetAll"
    },
    updateOption: function(e) {
      var data = {},
      field = $(e.target),
      option = field.data("option"),
      min;

      data[option] = field.val();
      min = field.data("min");
      if(min !== undefined && parseInt(data[option]) < parseInt(min)) {
        data[option] = min;
      }

      Viewer.trigger("viewer:changeOpt", data);
    },
    resetAll: function(e) {
      e.preventDefault();
      e.stopPropagation();

      this.$el.find("input").each(function() {
        var _this = $(this);
        _this.val(_this.attr("placeholder"));
        _this.change();
      });
      this.$el.find("select").prop('selectedIndex',0).change();
    }
  });
});
