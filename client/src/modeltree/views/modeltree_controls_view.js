Viewer.module("ModelTree", function(ModelTree, Viewer, Backbone, Mn, $, _) {

    ModelTree.ModelTreeControlsView = Marionette.ItemView.extend({
        template: '#modeltree-item-controls',
        className: 'element-controls',
        ui: {
           'selectControl' : '[role=select-element] i',
           'hideControl': '[role=hide-element] i',
           'folder': '.icon-folder'
        },
        events: {
            'click [role="element-name"]': 'fireSingleClick', // toggleExpand
            'dblclick [role="element-name"]': 'fireDoubleClick', // toggleExpandChildren
            'click [role="select-element"]': 'fireSingleSelect', // toggleSelect
            'dblclick [role="select-element"]': 'fireChildrenSelect', // toggleChildrenSelect
            'click [role="hide-element"]': 'fireSingleHide', // toggleSingleHide
            'dblclick [role="hide-element"]': 'fireChildrenHide' // toggleHideChildren
        },
        fireSingleClick: function() {
            clearTimeout(this.clickTimeout);
            this.clickTimeout = setTimeout(this.toggleExpand.bind(this), 200);
        },
        fireDoubleClick: function() {
            clearTimeout(this.clickTimeout);
            this.clickTimeout = setTimeout(this.toggleExpandChildren.bind(this), 200);
        },
        fireSingleSelect: function() {
            clearTimeout(this.clickTimeout);
            this.clickTimeout = setTimeout(this.toggleSingleSelect.bind(this), 200);
        },
        fireChildrenSelect: function() {
            clearTimeout(this.clickTimeout);
            this.clickTimeout = setTimeout(this.toggleSelectChildren.bind(this), 200);
        },
        fireSingleHide: function() {
            clearTimeout(this.clickTimeout);
            this.clickTimeout = setTimeout(this.toggleSingleHide.bind(this), 200);
        },
        fireChildrenHide: function() {
            clearTimeout(this.clickTimeout);
            this.clickTimeout = setTimeout(this.toggleHideChildren.bind(this), 200);
        },
        initialize: function(options) {
            this.indent = options.indent || 0;
            this.clickTimeout = -1;
        },
        serializeData: function() {
            var elementId = this.model.id;

            return _.extend(this.model.toJSON(), {
                isNode: isNode(elementId),
                hasGeometry: hasGeometry(elementId)
            })
        },
        onRender: function() {
            this.$el.css({
                paddingLeft: this.indent + 'px'
            });

            this.setSelectionControlsState();
            this.setVisibilityControlsState();
            this.setExpandIconState();
        },
        setSelectionControlsState: function() {
            if (isSelected(this.model.id)) {
                this.ui.selectControl.addClass('icon-check-on')
                    .removeClass('icon-check-off')
            } else {
                this.ui.selectControl.removeClass('icon-check-on')
                    .addClass('icon-check-off');
            }
        },
        setVisibilityControlsState: function() {
            if (isVisible(this.model.id)) {
                this.ui.hideControl.addClass('icon-eye-on')
                    .removeClass('icon-eye-off');
            } else {
                this.ui.hideControl.addClass('icon-eye-off')
                    .removeClass('icon-eye-on');
            }
        },
        setExpandIconState: function() {
            if(isExpanded(this.model.id)) {
                this.ui.folder.addClass('icon-folder-open')
                        .removeClass('icon-folder');
            } else {
                this.ui.folder.addClass('icon-folder')
                        .removeClass('icon-folder-open');
            }
        },
        onShow: function() {
            this.listenTo(ModelTree.elementSelection, 'add remove reset', this.setSelectionControlsState);
            this.listenTo(ModelTree.elementVisibility, 'add remove reset', this.setVisibilityControlsState);
            this.listenTo(ModelTree.expandedElementsCollection, 'add remove reset', this.setExpandIconState);
        },
        toggleExpand: function() {
            var eventName = 'expand:element';
            var expandModel = ModelTree.expandedElementsCollection.get(this.model.id);

            if(expandModel) {
                eventName = 'collapse:element';
            }

            Viewer.trigger(eventName, [this.model.id]);
        },
        toggleExpandChildren: function() {
            var eventName = 'expand:element';
            var expandModel = ModelTree.expandedElementsCollection.get(this.model.id);
            var subChildrenAndSelf = ModelTree.elementChildrenCollection.getSubElements(this.model.id);
            if(expandModel) {
                eventName = 'collapse:element';
            }
            Viewer.trigger(eventName, subChildrenAndSelf);
        },
        toggleSingleSelect: function() {
            var eventName = 'screen:part:selected';

            if(ModelTree.elementSelection.get(this.model.id)) {
                eventName = 'screen:part:deselected';
            }

            Viewer.vent.trigger(eventName, [this.model.id]);
        },
        toggleSelectChildren: function() {
            var eventName = 'screen:part:selected';
            var subChildrenAndSelf = ModelTree.elementChildrenCollection.getSubElements(this.model.id);

            if(ModelTree.elementSelection.get(this.model.id)) {
                eventName = 'screen:part:deselected';
            }

            Viewer.vent.trigger(eventName, subChildrenAndSelf);
        },
        toggleSingleHide: function() {
            var eventName = 'screen:parts:hide';
            var isVisible = ModelTree.elementVisibility.get(this.model.id);
            if(isVisible) eventName = 'screen:parts:show';

            Viewer.vent.trigger(eventName, [this.model.id]);
        },
        toggleHideChildren: function() {
            var eventName = 'screen:parts:hide';
            var isVisible = ModelTree.elementVisibility.get(this.model.id);
            var subChildrenAndSelf = ModelTree.elementChildrenCollection.getSubElements(this.model.id);

            if(isVisible) eventName = 'screen:parts:show';

            Viewer.vent.trigger(eventName, subChildrenAndSelf);
        }
    });

    function isNode(elementId) {
        return !!ModelTree.partialModelsCollection.get(elementId) || !!ModelTree.elementChildrenCollection.get(elementId)
    }

    function isSelected(elementId) {
        return !!ModelTree.elementSelection.get(elementId);
    }

    function isVisible(elementId) {
        return !ModelTree.elementVisibility.get(elementId);
    }

    function isExpanded(elementId) {
        return !!ModelTree.expandedElementsCollection.get(elementId);
    }

    function hasGeometry(elementId) {
        var model = ModelTree.modeltreeElementsCollection.get(elementId);
        return model && model.get('geometry');
    }
});