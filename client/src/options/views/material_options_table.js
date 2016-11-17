Viewer.module("MaterialOptions", function(MaterialOptions, Viewer, Backbone, Marionette, $, _){
	MaterialOptions.MaterialOptionsTable = Marionette.CompositeView.extend({
		tagName: "table",
		id: "material-table",
		childView: Viewer.MaterialOptions.MaterialOptionsNode,
		childViewContainer: "#type-list",
		template: "#types-table",
		modelEvents: {
			"change:modelIds": "updateId"
		},
		
		childEvents: {
			"highlight:type": "highlightType"
		},
		
		initialize: function(){
			this.collection = new Backbone.Collection();
		},
		
		updateId: function(){
			this.render();
		},
		
		
		highlightType: function(childView){
			var usedModel = childView.model;
			Viewer.trigger("select:parts", this.model.get("modelIds"), usedModel.get("partIds"));
		},
		
		addTypes: function(model){
			this.collection.add(model);
		}
	});
});