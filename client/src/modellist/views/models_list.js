Viewer.module("ModelsMenu", function (ModelsMenu, Viewer, Backbone, Marionette, $, _) {
  var supportedFileTypes = [
    "application/zip",
    "application/x-zip",
    "application/x-zip-compressed",
    "application/"
  ];

  ModelsMenu.ModelView = Marionette.ItemView.extend({
    tagName: "li",
    template: "#model-li-template",
    events: {
      "click span.js-delete": "deleteModel"
    },
    deleteModel: function (e) {
      e.preventDefault();
      e.stopPropagation();

      this.trigger("models:delete", this.model);
    },
    remove: function() {
      var self = this;

      this.$el.fadeOut(function () {
        Marionette.ItemView.prototype.remove.call(self);
      });
    }
  });

  ModelsMenu.LoadedModelView = Marionette.ItemView.extend({
    tagName: "li",
    template: "#loaded-model-li-template"
  });

  ModelsMenu.ModelCompositeView = Marionette.CompositeView.extend({
    template: "#models-composite-template",
    childView: ModelsMenu.ModelView,
    childViewContainer: "ul",
    events: {
      "click a.open-model": "toggleModel",
      "click button.js-deleteall": "deleteModels"
    },
    collectionEvents: {
      //"change": "modelChanged"
    },
    modelChanged: function () {
      //Viewer.modelsMenu.show(this);
      this.render();
    },
    toggleModel: function (e) {
      e.preventDefault();

      var a = $(e.target);

      var info = a.attr("value");
      Viewer.trigger("load:model", info);
    },
    deleteModels: function(e) {
      e.preventDefault();
      e.stopPropagation();

      this.children.forEach(function(childView) {
        childView.trigger("models:delete", childView.model);
      });
    }
  });

  ModelsMenu.FileUploadView = Marionette.ItemView.extend({
    tagName: "form",
    template: "#models-upload-template",
    events: {
      "change input": "uploadModel"
    },
    uploadModel: function (e) {
      var field = this.$el.find("input"),
      files = field.prop("files"),
      formData = new FormData(),
      xhr = new XMLHttpRequest(),
      model = this.model,
      zipOnly = true;

      for(var i = 0; i < files.length; i++) {
        if (supportedFileTypes.indexOf(files[i].type) > -1 || files[i].name.slice(-4) === ".zip") {
          formData.append(i, files[i]);
        } else {
          zipOnly = false;
        }
      }

      if (zipOnly === false) {
        alert("You must upload only zip files. Some of the selected are not and will not be uploaded!");
      }

      xhr.onload = function () {
        $("#upload-progress").find("span").html("done");
        ModelsMenu.Controller.displayModelsMenu();
        field.wrap("<form>").closest("form").get(0).reset();
        field.unwrap();
      };

      xhr.upload.addEventListener("load", function () {
        $("#upload-progress").find("span").html("extracting");
      });

      xhr.upload.addEventListener("progress", function (e) {
        if(e.lengthComputable) {
          var percentComplete = Math.floor(e.loaded / e.total * 100);
          $("#upload-progress").show().find("span").html(percentComplete + "%");
        }
      });

      xhr.upload.addEventListener("error", function (e) {
        $("#upload-progress").find("span").html("error.");
      });

      xhr.open("POST", Viewer.Config.getHttpsUrl() + "fileUpload", true);
      xhr.setRequestHeader('X-Requested-With','XMLHttpRequest');
      xhr.send(formData);
    }
  });

  ModelsMenu.LoadedModelsView = Marionette.CompositeView.extend({
    template: "#loaded-template",
    childView: ModelsMenu.LoadedModelView,
    childViewContainer: "ul",
    events: {
      "click a": "unloadModel",
      "click button.js-clear": "unloadAll"
    },
    initialize: function() {
      this.collection = new ModelsMenu.ModelCollection();
      this.listenTo(Viewer, "load:transform", function(modelName) {
        if(this.collection.findWhere({ name: modelName }) === undefined) {
          this.collection.add({ name: modelName });
        }
      });
    },
    unloadModel: function(e) {
      e.preventDefault();
      e.stopPropagation();

      var modelName = $(e.target).attr("value");
      Viewer.trigger("unload:model", modelName);

      var model = this.collection.findWhere({ name: modelName });
      this.collection.remove(model);
    },
    unloadAll: function(e) {
      e.preventDefault();
      e.stopPropagation();

      Viewer.trigger("unload:all");

      this.collection.reset();
    }
  });
});
