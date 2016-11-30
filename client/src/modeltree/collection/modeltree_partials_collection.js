Viewer.module('ModelTree', function(ModelTree, Viewer, Backbone) {
    var PartialModelsCollection = Backbone.Collection.extend({
        initialize: function() {
            this.listenTo(Viewer, 'load:model', this.addModel);
            this.listenTo(Viewer, 'unload:model', this.removeModel);
            this.listenTo(Viewer, 'unload:all', this.removeAllModels);
        },
        addModel: function(modelName) {
            this.add({
                id: modelName + '@' + modelName,
                name: modelName,
                partialModel: modelName,
                isRoot: true
            });
        },
        removeModel: function(modelName) {
            this.remove(modelName + '@' + modelName);
        },
        removeAllModels: function() {
            this.reset();
        }
    });

    ModelTree.partialModelsCollection = new PartialModelsCollection();
});