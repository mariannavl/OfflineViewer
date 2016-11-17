Viewer.module('ModelTree', function(ModelTree, Viewer, Backbone, Mn, $, _) {
    var ElementChildrenCollection = Backbone.Model.extend({
        initialize: function() {
            this.listenTo(Viewer, 'model:elements:loaded', this.groupElementsByParent);
        },
        groupElementsByParent: function(elements, partialModel) {
            var groupedByParent = _.groupBy(elements, function(element) {
                return element.parentId || partialModel
            });

            this.set(groupedByParent);
        },
        getSubElements: function(elementId) {
            var children = this.get(elementId) || [];
            var getSubElements = this.getSubElements.bind(this);

            var elements = [elementId].concat(_.map(children, function(child) {
                return getSubElements(child.id);
            }));

            return _.flatten(elements);
        }
    });

    ModelTree.elementChildrenCollection = new ElementChildrenCollection();
});