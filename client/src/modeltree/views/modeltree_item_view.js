Viewer.module("ModelTree", function(ModelTree, Viewer, Backbone, Mn, $, _) {

    ModelTree.ModelTreeListItem = Marionette.LayoutView.extend({
        template: '#modeltree-item',
        regions: {
            'controlsRegion': '.item-controls',
            'childrenRegion': '.item-children'
        },
        ui: {
            'controls': '.item-controls',
            'children': '.item-children'
        },
        initialize: function(options) {
            this.indent = options.indent || 0;
        },
        onShow: function () {
            var options = this.getOptions();
            this.controlsRegion.show(new ModelTree.ModelTreeControlsView(options));

            this.listenTo(ModelTree.expandedElementsCollection, 'add remove reset', this.showChildrenList);

            this.showChildrenList();
        },
        showChildrenList: function() {
            var childrenView;
            var options = this.getOptions();
            var expandedModel = ModelTree.expandedElementsCollection.get(this.model.id);

            if(!!expandedModel) {
                childrenView = ModelTree.Controller.getModelTreeList(options); // decouple children view and item view, because of recursive dependency
                this.childrenRegion.show(childrenView);
                this.toggleChildrenList();
                this.stopListening(ModelTree.expandedElementsCollection, 'add remove reset');
                this.listenTo(ModelTree.expandedElementsCollection, 'add remove reset', this.toggleChildrenList);
            }
        },
        toggleChildrenList: function() {
            var expandedModel = ModelTree.expandedElementsCollection.get(this.model.id);
            if(!!expandedModel) {
                this.ui.children.removeClass('hidden');
            } else {
                this.ui.children.addClass('hidden');
            }
        },
        getOptions: function() {
            return {
                model: this.model,
                indent: this.indent
            };
        }
    });
});