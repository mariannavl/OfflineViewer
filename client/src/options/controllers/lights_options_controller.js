Viewer.module("LightsOptions", function(LightsOptions, Viewer, Backbone, Marionette, $, _){
	LightsOptions.Controller = {
		displayLightsMenu: function(){
			var lightsMenuView = new LightsOptions.LightOptionsView();
			
			Viewer.lightsOptions.show(lightsMenuView);
		},
		
		displayColorMenu: function(){
			var colorMenuView = new Viewer.ColorOptions.ColorOptionsView();
			Viewer.colorSettings.show(colorMenuView);
			
		},
		
		displayMaterialMenu: function(){
			var materialMenuView = new Viewer.MaterialOptions.MaterialOptionsContainer();
			Viewer.materialSettings.show(materialMenuView);
		}
	};
});