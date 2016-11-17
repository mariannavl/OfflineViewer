Viewer.module("LightsOptions", function(LightsOptions, Viewer, Backbone, Marionette, $, _){
	LightsOptions.LightOptionsView = Marionette.ItemView.extend({
		tagName: "dd",
		id: "lights-menu",
		className: "accordion-navigation",
		template: "#lights-settings",
		ui: {
			"pointIntensity": "#point-intensity",
			"colors": ".color",
			"pointCoordinates": ".coords-point",
			"spotLightCoords": ".spot-coords",
			"directLightColor": ".color-direct"
		},
		
		events: {
			"click input": "onCheckboxClick",
			"change #gamma-correction-selection" : "onChangeGamma",
			"change @ui.pointIntensity": "onChangePointIntensity",
			"change @ui.colors": "setColors",
			"change @ui.pointCoordinates": "setPointLifghtCoords",
			"change #point-radius": "setPointLightRadius",
			"change @ui.spotLightCoords": "setSpotLightCoords",
			"change #spot-radius": "setSpotRadius",
			"change #spot-cut-angle": "setCutAngle",
			"change #spot-beamWidth": "setBeamWidth",
			"change @ui.directLightColor": "setDirectionalColor",
			"change .direction": "setLightDirection",
			"change #ambientintensity": "setAmbientintensity",
			"change #intensity": "setIntensity",
			"change #shadow-intensity": "setShadowIntensity",
			"change #shadow-split-factor": "setSplitFactor"
			
		},
		
		initialize: function(){
			this.pointLightOn = false;
			this.spotLightOn = false;
			this.directionalLightOn = false;
			this.headLightOn = false;
			this.pointLightColors = {
				r: 0,
				g: 0,
				b: 0
			};
			this.pointLightCoords = {
				x: 0,
				y: 0,
				z: 0
			};
			this.spotLightCoords = {
				x: 0,
				y: 0,
				z: 0
			};
			this.directionalLightColor = {
				r: 0,
				g: 0,
				b: 0
			},
			this.directionalLightCoords = {
				r: 0,
				g: 0,
				b: 0
			};
		},
		
		onCheckboxClick: function(ev){
			var target = ev.target;
			switch (target.id) {
				case "point":
					this.setPointLight();
					break;
				case "spot":
					this.setSpotLight();
					break;
				case "directional":
					this.setDirectionalLight();
					break;
				case "headlight":
					this.setHeadlight();
					break;
			}
		},
		
		setPointLight: function(){
			var pointLight = $("#point")[0];
			if(pointLight.on === "true"){
				pointLight.on = false;
				this.pointLightOn = false;
			} else {
				pointLight.on = true;
				this.pointLightOn = true;
			}
		},
		
		setSpotLight: function(){
			var spotLight = $("#spot")[0];
			if(spotLight.on === "true"){
				spotLight.on = false;
			} else {
				spotLight.on = true;
			}
		},
		
		setDirectionalLight: function(){
			var directionalLight = $("#directionallight")[0];
			if(directionalLight.on === "true"){
				directionalLight.on = false;
			} else {
				directionalLight.on = true;
			}
		},
		
		setHeadlight: function(){
			var headLight = $("#navigationinfo")[0];
			if(headLight.headlight === "true"){
				headLight.headlight = false;
				this.headLightOn = false;
			} else {
				headLight.headlight = true;
				this.headLightOn = true;
			}
		},
		
		onChangeGamma: function(ev){
			var optionVal = ev.target.options[ev.target.selectedIndex].value;
			var environment = $("#gamma")[0];
			switch (optionVal) {
				case "none":
					environment.gammaCorrectionDefault = optionVal;
					break;
				case "linear":
					environment.gammaCorrectionDefault = optionVal;
					break;
				case "fastLinear":
					environment.gammaCorrectionDefault = optionVal;
				default:
					break;
			}
		},
		onChangePointIntensity: function(ev){
			var pointLight = $("#point")[0];
			if(this.pointLightOn && this.ui.pointIntensity.val() >= 0 && this.ui.pointIntensity.val() <= 1){
				pointLight.intensity = parseFloat(this.ui.pointIntensity.val());
			} else {
				alert("Intensity should be bigger than 0 and smaller that 1");
			}
		},
		
		setColors: function(ev){
			var targetId = ev.target.id;
			var pointLight = $("#point")[0];
			switch (targetId) {
				case "Red":
					this.pointLightColors.r = parseFloat(ev.target.value);
					break;
				case "Blue":
					this.pointLightColors.b = parseFloat(ev.target.value);
					break;
				case "Green":
					this.pointLightColors.g = parseFloat(ev.target.value);
					break;
			}
			
			pointLight.color = this.pointLightColors.r + " " + this.pointLightColors.g + " " + this.pointLightColors.b;
			
		},
		setPointLifghtCoords: function(ev){
			var targetID = ev.target.id;
			var pointLight = $("#point")[0];
			
			switch (targetID) {
				case "point-X":
					this.pointLightCoords.x = parseFloat(ev.target.value);
					break;
				case "point-Y":
					this.pointLightCoords.y = parseFloat(ev.target.value);
					break;
				case "point-Z":
					this.pointLightCoords.z = parseFloat(ev.target.value);
					break;
			}
			pointLight.location = this.pointLightCoords.x + ", " + this.pointLightCoords.y + ", " + this.pointLightCoords.z;
		},
		
		setPointLightRadius: function(ev){
			var targetValue = ev.target.value;
			var pointLight = $("#point")[0];
			
			pointLight.radius = parseFloat(targetValue);
		},
		
		setSpotLightCoords: function(ev){
			var targetID = ev.target.id;
			var spotLight = $("#spot")[0];
			
			switch (targetID) {
				case "spot-X":
					this.spotLightCoords.x = parseFloat(ev.target.value);
					break;
				case "spot-Y":
					this.spotLightCoords.y = parseFloat(ev.target.value);
					break;
				case "spot-Z":
					this.spotLightCoords.z = parseFloat(ev.target.value);
					break;
			}
			spotLight.location = this.spotLightCoords.x + ", " + this.spotLightCoords.y + ", " + this.spotLightCoords.z;
		},
		
		setSpotRadius: function(ev){
			var input = parseFloat(ev.target.value);
			var spotLight = $("#spot")[0];
			spotLight.radius = input;
		},
		
		setCutAngle: function(ev){
			var input = parseFloat(ev.target.value);
			var spotLight = $("#spot")[0];
			spotLight.cutOffAngle = input;
		},
		
		setBeamWidth: function(ev){
			var input = parseFloat(ev.target.value);
			var spotLight = $("#spot")[0];
			spotLight.beamWidth = input;
		},
		
		setDirectionalColor: function(ev){
			var targetId = ev.target.id;
			var direction = $("#directionallight")[0];
			switch (targetId) {
				case "Red":
					this.directionalLightColor.r = parseFloat(ev.target.value);
					break;
				case "Blue":
					this.directionalLightColor.b = parseFloat(ev.target.value);
					break;
				case "Green":
					this.directionalLightColor.g = parseFloat(ev.target.value);
					break;
			}
			direction.color = this.directionalLightColor.r + " " + this.directionalLightColor.g + " " + this.directionalLightColor.b;
		},
		
		setLightDirection: function(ev){
			var targetId = ev.target.id;
			var directionalLight = $("#directionallight")[0];
			switch (targetId) {
				case "X":
					this.directionalLightCoords.x = parseFloat(ev.target.value);
					break;
				case "Y":
					this.directionalLightCoords.y = parseFloat(ev.target.value);
					break;
				case "Z":
					this.directionalLightCoords.z = parseFloat(ev.target.value);
					break;
			};
			directionalLight.direction = this.directionalLightCoords.x + ", " + this.directionalLightCoords.y + ", " + this.directionalLightCoords.z;
		},
		
		setAmbientintensity: function(ev){
			var input = parseFloat(ev.target.value);
			var directionalLight = $("#directionallight")[0];
			directionalLight.ambientintensity = input;
		},
		
		setIntensity: function(ev){
			var input = parseFloat(ev.target.value);
			var directionalLight = $("#directionallight")[0];
			directionalLight.intensity = input;
		},
		
		setShadowIntensity: function(ev){
			var input = parseFloat(ev.target.value);
			var directionalLight = $("#directionallight")[0];
			directionalLight.shadowIntensity = input;
		},
		
		setSplitFactor: function(ev){
			var input = parseFloat(ev.target.value);
			var directionalLight = $("#directionallight")[0];
			directionalLight.shadowsplitfactor = input;
		}
		
	});
});