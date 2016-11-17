Viewer.module("Navigation", function (Navigation, Viewer, Backbone, Marionette, $, _) {
  Navigation.Controller = {
    displayNavigationMenu: function () {
      var navigationMenuView = new Navigation.NavigationView();

      Viewer.navigationMenu.show(navigationMenuView);
    },
    displayNavigationOptionsMenu: function() {
      var navigationOptions = new Navigation.NavigationOptionsView();

      Viewer.navigationOptions.show(navigationOptions);
    }
  };
});
