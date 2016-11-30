Viewer.module("MaterialOptions", function(MaterialOptions, Viewer, Backbone, Marionette, $, _){
	MaterialOptions.MaterialOptionsContainer = Marionette.CompositeView.extend({
		tagName: "dd",
		className: "accordion-navigation",
		childView: MaterialOptions.MaterialOptionsTable,
		childViewContainer: "#table-container",
		template: "#types-table-container",
		
		events: {
			"change .types": "saveColor",
			"click #set-type-color": "setColor"
		},
		
		initialize: function(){
			this.colors = {
				r: 0,
				g: 0,
				b: 0
			};
			this.collection = new Backbone.Collection();
			this.types = [];
		},
		onShow: function(){
			this.listenTo(Viewer, "unload:model", this.clearTable);
			this.listenTo(Viewer, "show:material:types", this.showTypes);
			this.listenTo(Viewer, "unload:all", this.clearAll);
		},
		
		showTypes: function(elementsObj){
			var modelId = elementsObj.multipartId;
			var elements = elementsObj.elements;
			var model = {
				modelIds: modelId
			};
			var self = this;
			
			if(!this.checkLoadedModel(model)){
				this.collection.add(model);
				if(this.types.length > 0){
					this.types = [];
				}
			}
			
			elements.forEach(function(element){
				var partIds = _.map(element.PartIds, function(originalPartId) {
				    var partId = originalPartId.substr(0,22);
				    partId = partId.concat('@' + modelId);
				    return partId;
                });
				var childModel = {
					modelIds: modelId,
					ifcType: element.Type,
					partIds: partIds,
					count: element.PartIds.length
				};
				self.types.push(childModel);
			});
			this.addChildModel(this.types);
		},
		
		addChildModel: function(types){
			var view;
			var model;
			var self = this;
			types.forEach(function(type){
				model = self.collection.findWhere({modelIds: type.modelIds});
				if(model){
					view = self.children.findByModel(model);
					if(view){
						view.addTypes(type);
					}
				}
			});			
		},
		
		checkLoadedModel: function(model){
			var usedModel = this.collection.findWhere(model);
			if(usedModel){
				return true;
			} else {
				return false;
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
						this.colors.r = hexInput;
						break;
					case "green":
						this.colors.g = hexInput;
						break;
					case "blue":
						this.colors.b = hexInput;
						break;
				}
			} else {
				this.showWarning();
			}
			this.setBackGround();
		},
		
		setBackGround: function(){
			var div = document.getElementById("type-set-color");
			var color = "#" + this.colors.r + this.colors.g + this.colors.b;
			div.style.backgroundColor = color;
		},
		
		setColor: function(ev){
			var color = "#" + this.colors.r + this.colors.g + this.colors.b;
			Viewer.trigger("set:parts:color", color);
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
		},
		
		inputToHex: function(input){
			var hex = input.toString(16);
			return hex.length === 1 ? "0" + hex : hex;
		},
		
		clearTable: function(modelName){
			// var self = this;
			var model = this.collection.findWhere({modelIds: modelName});
			this.collection.remove(model);
		},

        clearAll: function(){
		    this.collection.reset();
        }
	});
});