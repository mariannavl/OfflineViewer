/**
 * Created by Marianna Vladimirova on 26.9.2014 г..
 */
var DEFAULT_TRANSFORM = {offset:{x:0,y:0,z:0},scaleFactor:1};

Viewer.module("Screen.Controllers", function(Controllers, Viewer, Backbone, Marionette, $, _){
    Controllers.Controller = function() {
        this.multipartCollection = new Viewer.Screen.Models.Multiparts();
        this.multipartCollection.listenTo(Viewer, "unload:model", function(modelName) {
          var model = this.findWhere({ id: modelName });
          this.remove(model);
        });
        this.multipartCollection.listenTo(Viewer, "unload:all", function() {
          this.reset();
        });
    };

    _.extend( Controllers.Controller.prototype, {
        changeNav: function(newNav) {
            var x3d = $("x3d").get(0),
                navInfo = $("#navigationinfo");
            if(navInfo !== undefined) {
                navInfo.attr("type", newNav);
                x3d.runtime.resetView();
            }
        },
        displayScreen: function(documentName, trans){
            var offset = trans.offset;
            var translation = [offset.x, offset.y, offset.z].join(',');
            var scale = [trans.scaleFactor, trans.scaleFactor, trans.scaleFactor].join(',');

            var multipart = new Viewer.Screen.Models.Multipart({
                id: documentName,
                urlIDMap: "../server/models/" + documentName + "/FaceModel/idmap.json",
                urlmodel: "../server/models/" + documentName + "/FaceModel/FaceModel.x3d",
                wireframeId: documentName + "_wireframe",
                wireframeUrlIDMap: "../server/models/" + documentName + "/FrameModel/idmap.json",
                wireframeUrlModel: "../server/models/" + documentName + "/FrameModel/FrameModel.x3d",
                scaleFactor: scale,
                translation: translation
            });
            var self = this;
            var index = _.indexOf(this.multipartCollection, multipart);
            if (index < 0) {
                this.multipartCollection.push(multipart);
            }
            if(!Viewer.viewer.currentView){
                var screenView = new Viewer.Screen.Views.SceneView({
                    collection: this.multipartCollection
                });

                screenView.listenTo(Viewer, "viewer:changeNav", function(newNav) {
                    var navInfo = this.$el.find("#navigationinfo").get(0);
                    switch (newNav) {
                        case 'examine':
                            this.el.runtime.examine();
                            break;
                        case 'rotate':
                            this.el.runtime.examine();
                            navInfo.setAttribute('explorationMode', 'rotate');
                            break;
                        case 'walk':
                            this.el.runtime.walk();
                            break;
                        case 'fly':
                            this.el.runtime.fly();
                            break;
                        case 'lookAt':
                            this.el.runtime.lookAt();
                            break;
                        case 'game':
                            this.el.runtime.game();
                            break;
                        case 'helicopter':
                            this.el.runtime.helicopter();
                            break;
                        case 'custom':
                            navInfo._x3domNode.setType('custom');
                            break;
                    }
                });

                screenView.listenTo(Viewer, "viewer:changeOpt", function(data) {
                    this.$el.find("#navigationinfo").attr(data);
                });

                screenView.listenTo(Viewer, "viewer:command", function(cmd) {
                    this.runCommand(cmd);
                });

                screenView.listenTo(Viewer, "viewer:changeRenderMode", function(newRenderMode) {
                    if(newRenderMode == 'wireframe'){
                        _.each(this.collection.models, function(model){
                            model.trigger('multipart:transparency:change', true);
                            model.trigger('multipart:wireframe:transparency:change', false);
                        });
                        return;
                    }
                    if (newRenderMode == 'combined') {
                        _.each(this.collection.models, function(model) {
                            model.trigger('multipart:transparency:change', false);
                            model.trigger('multipart:wireframe:transparency:change', false);
                        });
                        return;
                    }
                    if (newRenderMode == 'shaded') {
                        _.each(this.collection.models, function(model) {
                            model.trigger('multipart:transparency:change', false);
                            model.trigger('multipart:wireframe:transparency:change', true);
                        });
                        return;
                    }
                });
                
                screenView.listenTo(Viewer, "set:part:color", function(color, partId){
                    this.changePartColor(color, partId);
                });
                
                // screenView.listenTo(Viewer, "get:deffuse:color", function(partId){
                //     this.getDeffuseColor(partId);
                // });

                Viewer.viewer.show(screenView);
            }
        },
        getPartColor: function(partModel) {
            var sceneView = Viewer.viewer.currentView;
            var partIDList = partModel.id.split('@');
            if(sceneView) {
                return sceneView.getPartColor(partIDList[0], partIDList[1]);
            }
        }
    });

    Controllers.addInitializer(function() {

        var controller = new Controllers.Controller();

        Controllers.instance = controller;

        Viewer.on('load:transform', controller.displayScreen.bind(controller));
        Viewer.on('load:model', function (documentName) {
            var url = "../server/models/" + documentName + "/transform.json";
            $.getJSON(url)
                .always(displayScreen(documentName))
                .fail(function() {
                    console.log(arguments)
                })
        });

        function displayScreen(documentName) {
            return function(transform) {
                if(transform.offset === undefined) transform = DEFAULT_TRANSFORM;
                Viewer.trigger('load:transform', documentName, transform)
            }
        }
    });
});
