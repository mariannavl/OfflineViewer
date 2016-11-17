Viewer.module('ModelTree', function(ModelTree, Viewer, Backbone, Mn, $, _) {

    var ElementsCollection = Backbone.Collection.extend({
        initialize: function(options) {
            this.url = options.url;
            this.partialModel = options.partialModel;

            this.on('sync', this.onSync);
            this.on('error', this.onError);

            this.fetch();
        },
        onError: function(self, xhrResponse, options ) {
            if(xhrResponse.status >= 200 && xhrResponse.status < 400) {

                console.error("Error parsing the ModelTree.json file. Attempt to recover");
                try {
                    var json = xhrResponse.responseText.replace(/\\/g, '\\\\');
                    var responseJSON = JSON.parse(json);
                    this.add(this.parse(responseJSON));
                    this.trigger('sync');
                } catch(exception) {
                    console.error("Error while attempting to recover from parsing error", exception);
                }
            } else {
                console.error("Error fetching the ModelTree.json", arguments);
            }
        },
        parse: function(elements) {
            var partialModel = this.partialModel;
            return _.map(elements, function(element) {
                var hasGeometry = typeof element.Geometry == 'undefined'  ? true : // default value if undefined
                                  element.Geometry === 'true'             ? true : // 'true' === true
                                                                            element.Geometry; // actual property value
                return {
                    id: element.Id + '@' + partialModel,
                    name: element.Name,
                    parentId: (element.ParentId || partialModel) + '@' + partialModel,
                    partialModel: partialModel,
                    geometry: hasGeometry
                }
            });
        },
        /* @see modeltree_elements_children_collection.js */
        onSync: function() {
            Viewer.trigger('model:elements:loaded', this.toJSON(), this.partialModel);
        }
    });

    var ModelTreeElementsCollection = Backbone.Collection.extend( {
        initialize: function() {
            this.listenTo(Viewer, 'load:model', this.addElements);
            this.listenTo(Viewer, 'unload:model', this.removeElements);
        },
        addElements: function(modelName) {
            var self = this;
            var elements = new ElementsCollection({
                url: '/models/' + modelName + '/ModelTree.json',
                partialModel: modelName
            });

            this.add({
                id: modelName + '@' + modelName,
                name: modelName,
                geometry: false
            });

            elements.on('sync', function() {
                self.add(elements.toJSON());
                elements.unbind('sync');
                elements.unbind('error');
                elements.reset();
                elements = null;
            });
        }
    });

    ModelTree.modeltreeElementsCollection = new ModelTreeElementsCollection();
});

function replaceSlash() {

}

function escaleVals() {

}