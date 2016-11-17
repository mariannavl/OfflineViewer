Viewer.module("MaterialOptions", function(MaterialOptions, Viewer, Backbone, Marionette, $, _){
	MaterialOptions.MaterialOptionsNode = Marionette.ItemView.extend({
		tagName: "tr",
		template: "#type-node-template",
		events: {
			"click a": "highlightType"
		},
		
		highlightType: function(ev){
			this.triggerMethod("highlight:type");
		}
	});
});