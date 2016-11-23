Viewer.module("ModelTree", function(ModelTree, Viewer, Backbone, Mn, $, _) {

    ModelTree.ModelTreeListItem = Marionette.LayoutView.extend({
        template: '#modeltree-item',
        regions: {
            'controlsRegion': '.item-controls',
            'childrenRegion': '.item-children',
            'count': '.elements-count'
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

            if(isRoot(this.model.id)) {
                this.listenTo(ModelTree.partialModelChildrenCount, 'change', this.showChildrensCount);
            }

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
        showChildrensCount: function() {
            this.count.show( new ModelTree.ModelTreeCountView({model: this.model}) );
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

    function isRoot(elementId) {
        return !!ModelTree.partialModelsCollection.get(elementId);
    }
});