Viewer.module("ModelsMenu", function (ModelsMenu, Viewer, Backbone, Marionette, $, _) {
  ModelsMenu.Model = Backbone.Model.extend({
    name: ""
  });

  ModelsMenu.ModelCollection = Backbone.Collection.extend({
    model: ModelsMenu.Model,
    comparator: "name"
  });

  var API = {
    getModelCollection: function () {
      var	defer = $.Deferred();

      var xhr = new XMLHttpRequest();
      xhr.onload = function () {
        var models = JSON.parse(xhr.response),
        modelCollection = new ModelsMenu.ModelCollection(_.map(models, function (model) {
          return { name: model };
        }));

        defer.resolve(modelCollection);
      };
      xhr.open("GET", Viewer.Config.getHttpsUrl() + "listModels");
      xhr.send();

      return defer.promise();
    }
  };

  Viewer.reqres.setHandler("models:collection", function () {
    return API.getModelCollection();
  });
});
