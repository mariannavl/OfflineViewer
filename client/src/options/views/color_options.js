"use strict";

Viewer.module("ColorOptions", function(ColorOptions, Viewer, Backbone, Marionette, $, _){	
	ColorOptions.ColorOptionsView = Marionette.ItemView.extend({
		tagName: "dd",
		id: "lights-menu",
		className: "accordion-navigation",
		template: "#color-settings",
		events: {
			"change .color": "saveColor",
			"change .colors": "saveDifuseColors",
			"change .emis": "saveEmissiveColors",
			"change .spec": "saveSpecularColor",
			"change .trans": "saveTransparency",
			"click #set-color": "setColorToPart",
			"click #get-diffuse-color": "getDiffuseColor",
			"click #set-diffuse-color": "setDiffuseColor",
			"click #get-emissive-color": "getEmissiveColor",
			"click #set-emissive-color": "setEmissiveColor",
			"click #get-specular-color": "getSpecularColor",
			"click #set-specular-color": "setSpecularColor",
			"click #get-transparency": "getTransparency",
			"click #set-transparency": "setTransparency",
			"click #reset-color": "resetColor"
		},
			
		initialize: function(){	
			this.model = new Backbone.Model({
				partId: '',
				multipartId: '',
				r: 0,
				g: 0,
				b: 0,
				diffuseColor: "",
				emissiveColor: "",
				specularColor: "",
				transparency: 0,
				difR: 0,
				difG: 0,
				difB: 0,
				emisR: 0,
				emisG: 0,
				emisB: 0,
				specR: 0,
				specG: 0,
				specB: 0
			});
			Viewer.vent.on("screen:part:selected", function(partObject){
				this.showPartId(partObject);
			}, this);
			Viewer.vent.on("screen:part:deselected", function(partObject){
				this.removePartId(partObject);
			}, this);
		},
		
		showPartId: function(partObject){
			var partId = partObject.partID;
			var multipartId = partObject.multipartID;
			var td = $("#partID");
			this.model.set("partId", partId);
			this.model.set("multipartId", multipartId);
			td.text(partId);
		},
		
		removePartId: function(partObject){
			var partId = partObject.partID;
			var td = $("#partID");
			if(this.model.get("partId") === partId){
				td.text("");
				this.model.set("partId", "");
			}
		},
		
		saveColor: function(ev){
			var targetId = ev.target.id;
			var input = parseInt(ev.target.value);
			var hexInput;
			if(this.checkInput(input)){
				hexInput = this.inputToHex(input);
				switch (targetId) {
					case "red":
						this.model.set("r", hexInput);
						break;
					case "green":
						this.model.set("g", hexInput);
						break;
					case "blue":
						this.model.set("b", hexInput);
						break;
				}
			} else {
				this.showWarning();
			}
		},
		
		setColorToPart: function(ev){
			var color = "#" + this.model.get("r") + this.model.get("g") + this.model.get("b");
			Viewer.trigger("set:part:color", color, this.model.get("partId"));
		},
		
		inputToHex: function(input){
			var hex = input.toString(16);
			return hex.length === 1 ? "0" + hex : hex;
		},
		
		saveDifuseColors: function(ev){
			var targetId = ev.target.id;
			var input = parseInt(ev.target.value);
			var hexInput;
			if(this.checkInput(input)){
				hexInput = this.inputToHex(input);
				switch (targetId) {
					case "dif-red":
						this.model.set("difR", hexInput);
						break;
					case "dif-green":
						this.model.set("difG", hexInput);
						break;
					case "dif-blue":
						this.model.set("difB", hexInput);
						break;
				}
			} else {
				this.showWarning();
			}
		},
		
		setDiffuseColor: function(ev){
			var part = this.getPart(this.model.get("partId"));
			var color = "#" + this.model.get("difR") + this.model.get("difG") + this.model.get("difB");
			part.unhighlight();
			part.setDiffuseColor(color);
		},
		
		getDiffuseColor: function(ev){
			var part = this.getPart(this.model.get("partId"));
			var color = part.getDiffuseColor();
			this.model.set("diffuseColor", color);
			this.setUI(this.model.get("diffuseColor"), "diffuse");
		},
		
		saveEmissiveColors: function(ev){
			var targetId = ev.target.id;
			var input = parseInt(ev.target.value);
			var hexInput;
			if(this.checkInput(input)){
				hexInput = this.inputToHex(input);
				switch (targetId) {
					case "emis-red":
						this.model.set("emisR", hexInput);
						break;
					case "emis-green":
						this.model.set("emisG", hexInput);
						break;
					case "emis-blue":
						this.model.set("emisB", hexInput);
						break;
				}
			} else {
				this.showWarning();
			}
		},
		
		getEmissiveColor: function(ev){
			var part = this.getPart(this.model.get("partId"));
			var color = part.getEmissiveColor();
			this.model.set("emissiveColor", color);
			this.setUI(this.model.get("emissiveColor"), "emissive");
		},
		
		setEmissiveColor: function(ev){
			var part = this.getPart(this.model.get("partId"));
			var color = "#" + this.model.get("emisR") + this.model.get("emisG") + this.model.get("emisB");
			part.unhighlight();
			part.setEmissiveColor(color);
		},
		
		getSpecularColor: function(ev){
			var part = this.getPart(this.model.get("partId"));
			var color = part.getSpecularColor();
			this.model.set("specularColor", color);
			this.setUI(this.model.get("specularColor"), "specular");
		},
		
		setSpecularColor: function(ev){
			var part = this.getPart(this.model.get("partId"));
			var color = "#" + this.model.get("specR") + this.model.get("specG") + this.model.get("specB");
			part.unhighlight();
			part.setSpecularColor(color);
		},
		
		saveSpecularColor: function(ev){
			var targetId = ev.target.id;
			var input = parseInt(ev.target.value);
			var hexInput;
			if(this.checkInput(input)){
				hexInput = this.inputToHex(input);
				switch (targetId) {
					case "spec-red":
						this.model.set("specR", hexInput);
						break;
					case "spec-green":
						this.model.set("specG", hexInput);
						break;
					case "spec-blue":
						this.model.set("specB", hexInput);
						break;
				}
			} else {
				this.showWarning();
			}
		},
		
		getTransparency: function(ev){
			var part = this.getPart(this.model.get("partId"));
			var transUi = $("#transparency");
			var transp = part.getTransparency();
			this.model.set("transparency", transp);
			transUi.text(transp);
			
		},
		
		saveTransparency: function(ev){
			var input = parseFloat(ev.target.value);
			if(input >= 0 && input <= 1){
				this.model.set("transparency", input);
			}
		},
		
		setTransparency: function(ev){
			var part = this.getPart(this.model.get("partId"));
			part.unhighlight();
			part.setTransparency(this.model.get("transparency"));
		},
		
		getPart: function(partId){
			var multipart = document.getElementById(this.model.get("multipartId"));
			var replacedId = partId.replace(/[-_[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
			var regExp = new RegExp(replacedId);
			var part = multipart.getParts(regExp);
			
			return part;
		},
		
		setUI: function(color, typeOfColor){
			var red;
			var green;
			var blue;
			switch (typeOfColor) {
				case "diffuse":
					red = $("#dif-r");
					green = $("#dif-g");
					blue = $("#dif-b");
					break;
				case "emissive":
					red = $("#emis-r");
					green = $("#emis-g");
					blue = $("#emis-b");
					break;
				case "specular":
					red = $("#spec-r");
					green = $("#spec-g");
					blue = $("#spec-b");
					break;
				default:
					break;
			}
			red.text((color.r).toFixed(4));
			green.text((color.g).toFixed(4));
			blue.text((color.b).toFixed(4));
		},
		
		resetColor: function(ev){
			var multipart = document.getElementById(this.model.get("multipartId"));
			var replacedId = this.model.get("partId").replace(/[-_[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
			var regExp = new RegExp(replacedId);
			var parts = multipart.getParts(regExp);
			parts.resetColor();
		},
		
		checkInput: function(input){
			if(isNaN(input)){
				input = 0;
			}
			if(input >= 0 && input <= 255){
				return true;
			} else {
				return false;
			}
		},
		
		showWarning: function(){
			alert("Values should be between 0 and 255");
		}
		
	});
	
	
});