"use strict";

Viewer.module("ColorOptions", function(ColorOptions, Viewer, Backbone, Marionette, $, _){
    var colorModel = new Backbone.Model({
        specular: "0,0,0",
        diffuse: "1,0,0",
        emissive: "1,1,1",
        transparency: 0,
        parts: null
    });

    ColorOptions.ColorOptionsView = Marionette.LayoutView.extend({
        id: "lights-menu",
        className: "accordion-navigation",
        template: '#color-settings',
        regions: {
           'colorForm': '#color-form'
        },
        ui: {
            'instructionsMessage': '#instruction-message',
            'colorForm': '#color-form'
        },
        initialize: function() {
            this.selectionCollection = Viewer.ModelTree.elementSelection;
            this.modeltreeElementsCollection = Viewer.ModelTree.modeltreeElementsCollection;
        },
        onShow: function() {

            this.listenTo(this.selectionCollection, 'add remove reset', this.displayColorForm);
        },
        displayColorForm: function() {
            var partToColor = this.selectionCollection.length === 1 ? this.selectionCollection.at(0) :
                                                                      null;
            partToColor = this.modeltreeElementsCollection.get(partToColor);

            if(partToColor && partToColor.get('geometry')) {
                this.hideInstructionsMessage();
                this.colorForm.show(new ColorOptions.ColorOptionsFromView());
            } else {
                this.showInstructionsMessage();
                this.colorForm.empty();
            }
        },
        hideInstructionsMessage: function() {
            this.ui.instructionsMessage.hide();
            this.ui.colorForm.show();
        },
        showInstructionsMessage: function() {
            this.ui.instructionsMessage.show();
            this.ui.colorForm.hide();
        }
    });

	ColorOptions.ColorOptionsFromView = Marionette.ItemView.extend({
        template: "#color-form-tpl",
        model: colorModel,
        events: {
		    'input #diffuse-control': 'setDiffusive',
		    'input #emissive-control': 'setEmissive',
		    'input #specular-control': 'setSpecular',
            'input #transparency-control': 'setTransparency',
            'click #apply-color': 'applyColor',
            'click #reset-color': 'resetColor'
        },
        initialize: function() {
            this.screenController = Viewer.Screen.Controllers.instance;
            this.selectionCollection = Viewer.ModelTree.elementSelection;
            this.modeltreeElementsCollection = Viewer.ModelTree.modeltreeElementsCollection;

            var partToColor = this.selectionCollection.length === 1 ? this.selectionCollection.at(0) :
                                                                      null;
            partToColor = this.modeltreeElementsCollection.get(partToColor);

            if(partToColor && partToColor.get('geometry')) {
                var colors = this.screenController.getPartColor(partToColor);
                this.model.set(colors);
            }
        },
        setDiffusive: function(e) {
            var isValid = this.isValid(e.target.value);
            if(isValid) {
                this.model.set('diffusive', e.target.value);
            }
        },
        setEmissive: function(e) {
            var isValid = this.isValid(e.target.value);
            if(isValid) {
                this.model.set('emissive', e.target.value);
            }
        },
        setSpecular: function(e) {
            var isValid = this.isValid(e.target.value);
            if(isValid) {
                this.model.set('specular', e.target.value);
            }
        },
        setTransparency: function(e) {
            var transparency = parseFloat(e.target.value);
            if(!isNaN(transparency) && transparency >= 0 && transparency <= 1) {
                this.model.set('transparency', e.target.value);
            }
        },
        isValid: function(vals) {
            return vals.split(',').map(parseFloat)
                                  .filter(notNaN)
                                  .length === 3; //expect 3 number values
        },
        applyColor: function(e) {
            e.preventDefault();
		    var parts = this.model.get('parts');
		    if(parts) {
		        parts.unhighlight();
                parts.setDiffuseColor(this.model.get('diffuse'));
                parts.setEmissiveColor(this.model.get('emissive'));
                parts.setSpecularColor(this.model.get('specular'));
                parts.setTransparency(this.model.get('transparency'));
            }
        },
        resetColor: function(e){
            e.preventDefault();
        	var parts = this.model.get('parts');
        	if(parts) {
                parts.resetColor();
            }
        }
	});
});

function notNaN(element) {
    return !isNaN(element);
};