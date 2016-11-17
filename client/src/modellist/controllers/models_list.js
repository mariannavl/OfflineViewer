Viewer.module("ModelsMenu", function (ModelsMenu, Viewer, Backbone, Marionette, $, _) {
  ModelsMenu.Controller = {
    displayModelsMenu: function () {
      var fetchingModelCollection = Viewer.request("models:collection");

      $.when(fetchingModelCollection).done(function (modelCollection) {
        var modelsCompositeView = new ModelsMenu.ModelCompositeView({
          collection: modelCollection
        });

        modelsCompositeView.on("childview:models:delete", function (childView, model) {
          var xhr = new XMLHttpRequest();
          xhr.onload = function() {
            modelCollection.remove(model);
          };
          xhr.open("POST", Viewer.Config.getHttpsUrl() + "deleteModel/" + model.get("name"));
          xhr.send();
        });

        Viewer.modelsMenu.show(modelsCompositeView);
      });
    },
    displayUploadMenu: function () {
      var fileUploadViewer = new ModelsMenu.FileUploadView();
      Viewer.uploadMenu.show(fileUploadViewer);
    },
    displayLoadedMenu: function() {
      var loadedMenu = new ModelsMenu.LoadedModelsView();
      Viewer.loadedMenu.show(loadedMenu);
    }
  };
});
