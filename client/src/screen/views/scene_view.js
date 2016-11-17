Viewer.module("Screen.Views", function (Views, Viewer, Backbone, Marionette, $, _) {
    var Keyboard = { S: 83 };
    Views.SceneView = Marionette.CompositeView.extend({
        tagName: "x3d",
        id: "x3dElement",
        childView: Views.MultipartView,
        childViewContainer: "scene",
        template: "#scene-template",
        childEvents: {
            'multiparts:loaded': 'onMultipartLoaded'
        },

        initialize: function () {
            //parts that are highlighted when clicked
            this.selected = [];
            //parts that are highlighted when mouse enters the part
            this.highlighted = [];

            this.hidden = [];

            this.clicks = [];
            this.entitySelection = false;
            this.colorMap = [];
            this.elementTypesTypeTree = [];         //array with elements from TypeTree.json
            this.elementTypes = [];                 //array with element types from TypeIds.json
            this.colorMapEnabled = false;
            this.calculatingTimeMultipart = '';


//            this.listenTo(this.collection, "change", this.render);
            _.bindAll(this, 'onKeypress');
            $(document).bind('keydown', this.onKeypress);

            _.bindAll(this, 'onKeyUp');
            $(document).bind('keyup', this.onKeyUp);

            this.listenTo(Viewer, "unload:model", this.clearSelected);
            this.listenTo(Viewer, "unload:all", this.clearAllSelected);

            this.listenTo(Viewer, "selectedTable:remove", this.deselect);
            this.listenTo(Viewer, "hiddenTable:remove", this.unhide);
            this.listenTo(Viewer, "select:parts", this.selectParts);
            this.listenTo(Viewer, "scene:save:types", this.saveMaterialTypes);

            this.listenTo(Viewer.vent, "scene:fit:all", this.fitAll);
            this.listenTo(Viewer.vent, "scene:switch-lights:toggle", this.switchLight);
            this.listenTo(Viewer.vent, "scene:switch-colors:toggle", this.switchColors);

            this.loadColorMapFile();

        },
        deselect: function (data) {
            this.children.call("deselectFromTable", data);
        },

        unhide: function (data) {
            this.children.call("unhideFromTable", data);
        },

        clearAllSelected: function () {
            var current = this.selected.length;
            while (current >= 0) {
                this.selected.splice(current, current + 1);
                current--;
            }
        },

        clearSelected: function (modelName) {
            var multipartID = modelName;
            var current = this.selected.length - 1;
            while (current >= 0) {
                if (this.selected[current].multipartID === multipartID) {
                    this.selected.splice(current, current + 1);
                }
                current--;
            }
        },
        onKeypress: function (ev) {
            var keynum = 0;
            if (window.event) {
                keynum = ev.keyCode;
            } else if (ev.which) {
                keynum = ev.which;
            }
            if (keynum === Keyboard.S) {
                this.keynum = keynum;
                this.children.call("handlekey", this);
            }
        },

        onKeyUp: function (ev) {
            this.keynum = 0;
            this.children.call("handlekey", this);
        },

        childViewOptions: function (model) {
            return {
                parentsHighlighted: this.highlighted,
                parentsSelected: this.selected,
                parentsHidden: this.hidden,
                parentsEntitySelection: this.entitySelection
            };
        },

        runCommand: function (cmd) {
            switch (cmd) {
                case 'hide-all':
                    this.children.call('changeMultipartVisibility', false);
                    break;
                case 'show-all':
                    this.children.call('changeMultipartVisibility', true);
                    break;
                case 'hide-selected':
                    this.children.call('changeSelectedVisibility', false);
                    break;
                case 'show-selected':
                    this.children.call('changeSelectedVisibility', true);
                    break;
                case 'single-selection':
                    if (this.entitySelection) {
                        this.entitySelection = false;
                        this.children.call('handleEntitySelection', false);
                    }
                    break;
                case 'entity-selection':
                    this.entitySelection = true;
                    this.children.call('handleEntitySelection', true);
                    break;
                case 'deselectAll':
                    this.children.call('deselectAll');
                    break;
                case 'switch-colors':
                    this.switchColors();
                    break;
                case 'switch-light':
                    this.switchLight();
                    break;
                case 'fit-all':
                    this.fitAll();
                default:
                    break;
            }
        },

        switchLight: function () {
            if (this.directionalLight.on === 'false') {
                this.directionalLight.on = true;
            } else {
                this.directionalLight.on = false;
            }
        },

        onMultipartLoaded: function (model) {
            this.x3dElement = $("#x3dElement")[0];
            this.directionalLight = $("#directionallight")[0];

            this.loadTypes(model);
            this.loadTypeIDs(model);
            this.fitAll();
        },

        changePartColor: function (color, partId) {
            this.children.call("changePartColor", color, partId);
        },

        getDeffuseColor: function (partId) {
            this.children.call("getDeffuseColor", partId);
        },

        selectParts: function (modelId, partIds) {
            var model = this.collection.findWhere({id: modelId});
            var view;
            this.children.call("deselectAll");
            if (model) {
                view = this.children.findByModel(model);
                view.selectParts(partIds);
            }
        },

        saveMaterialTypes: function (multipartId, response) {
            this.elementTypesTypeTree.push({
                multipartId: multipartId,
                elements: response
            });
            Viewer.trigger("show:material:types", {multipartId: multipartId, elements: response});
        },

        loadColorMapFile: function () {
            //var url = './ColorData.json';
            var url = './ColorDataThinkProjectCorrectionTest1.json';
            var response;
            var self = this;
            $.getJSON(url, function (data) {
                response = data;
                response.forEach(function (element) {
                    var child = {
                        ifcType: element.ifcType,
                        defaultColor: element.defaultColor,
                        transparency: element.transparency
                    };
                    self.colorMap.push(child);
                })
            }).fail(function () {
                console.log('error loading file');
            });
        },

        loadTypeIDs: function (model) {
            var url = "../server/models/" + model.multipart.id + "/ElementTypesMap.json";
            var response;
            var self = this;

            $.getJSON(url, function (data) {
                response = data;
                if (response) {
                    self.saveElementTypes(model.multipart.id, response);
                }
            })
                .fail(function () {
                    console.log('error');
                });
        },

        loadTypes: function (model) {
            var url = "../server/models/" + model.multipart.id + "/ElementTypesMap.json";
            var response;
            var self = this;

            $.getJSON(url, function (data) {
                response = data;
                if (response) {
                    self.saveMaterialTypes(model.multipart.id, response);
                }
            })
                .fail(function () {
                    console.log("No ElementTypesMaps.json is found");
                })
        },

        saveElementTypes: function (multipartId, response) {
            this.elementTypes.push({
                multipartId: multipartId,
                elements: response
            });
        },

        switchColors: function () {
            var modelId;
            var model;
            var view;
            var self = this;
            if (!this.colorMapEnabled) {
                this.elementTypesTypeTree.forEach(function (element) {
                    modelId = element.multipartId;
                    model = self.collection.findWhere({id: modelId});
                    if (model) {
                        view = self.children.findByModel(model);
                        self.switchTimer(modelId);
                        view.setColors(element, self.colorMap);
                    }
                });
                this.colorMapEnabled = true;
                this.switchTimer("none");
            } else {
                this.resetColor();
            }
        },

        switchColorsTypeId: function () {
            var view;
            var self = this;
            var modelId, model;
            if (!this.colorMapEnabled) {
                this.elementTypes.forEach(function (element) {
                    modelId = element.multipartId;
                    model = self.collection.findWhere({id: modelId});
                    if (model) {
                        view = self.children.findByModel(model);
                        self.switchTimer(modelId);
                        view.setColorsByTypeId(element, self.colorMap);
                    }
                });
                this.colorMapEnabled = true;
                this.switchTimer("none");
            } else {
                this.resetColor();
            }
        },

        resetColor: function () {
            this.colorMapEnabled = false;
            this.children.call("resetColor");
        },

        switchTimer: function (multipartId) {
            if (this.calculatingTimeMultipart === '') {
                this.calculatingTimeMultipart = multipartId;
                console.log(multipartId);
                console.time("getting and coloring");
                return;
            }
            if (this.calculatingTimeMultipart === multipartId) {
                return;
            }
            if (this.calculatingTimeMultipart !== multipartId && multipartId !== "none") {
                console.timeEnd("getting and coloring");
                console.log("-----------------------------");
                this.calculatingTimeMultipart = '';
                this.switchTimer(multipartId);
            } else {
                console.timeEnd("getting and coloring");
                console.log("-----------------------------");
            }

        },

        fitAll: function () {
            this.x3dElement.runtime.fitAll();
        }
    });

});