/**
 * Created by Marianna Vladimirova on 2.10.2014 г..
 */

Viewer.module("Screen.Views", function (Views, Viewer, Backbone, Marionette, $, _) {
    var Keyboard = { S: 83 };

    Views.MultipartView = Marionette.ItemView.extend({
        tagName: 'transform',
        template: "#multipart-template",
        modelEvents: {
            'multipart:transparency:change': 'changeMultiPartTransparency',
            'multipart:wireframe:transparency:change': 'changeWireframeTransparency'
        },
        onRender: function() {
            var modelId = this.model.get("id");
            var wireframeId = this.model.get("wireframeId");

            this.multipart = this.$el.find('#' + modelId).get(0);
            this.wireframe = this.$el.find('#' + wireframeId).get(0);
        },
        onShow: function () {
            var self = this;
            var modelId = this.model.get("id");

            this.multipart.onload = function () {
                self.multipart.onclick = function (event) {
                    self.handleClick(event);
                };
                // self.multipart.onmouseenter = function (event) {
                //     self.handleMouseEnter(event);
                // };
                // self.multipart.onmouseleave = function (event) {
                //     self.handleMouseOut(event);
                // };
                self.trigger('multiparts:loaded', modelId);
            };

            this.listenTo(Viewer.vent, 'screen:part:selected', this.selectParts);
            this.listenTo(Viewer.vent, 'screen:part:deselected', this.deselectParts);
            this.listenTo(Viewer.vent, 'screen:deselectAll', this.deselectAll);

            this.listenTo(Viewer.vent, 'screen:parts:hideAll', this.hideAll);
            this.listenTo(Viewer.vent, 'screen:parts:showAll', this.showAll);
            this.listenTo(Viewer.vent, 'screen:parts:hide', this.hideParts);
            this.listenTo(Viewer.vent, 'screen:parts:show', this.showParts);

            // this.listenTo(Viewer, "set:parts:color", this.setPartsColor);

            x3dom.reload();
        },
        //temporary initialize
        initialize: function (options) {
            this.selected = options.parentsSelected;
            this.hidden = options.parentsHidden;
            this.highlighted = options.parentsHighlighted;
            this.entitySelection = false;
            this.isWireframeTransparent = false;
            this.isMultipartTransparent = false;
            this.color = "red";
            this.timerStarted = false;
            this.calculatingTimeMultipart = '';
        },

        handlekey: function (parentModel) {
            this.keynum = parentModel.keynum;
        },

        highlightPart: function (partID) {
            var partToHighlightAsObject = this.toObject(partID);
            if (!this.isMultipartTransparent) {
                var partToHighlight = this.getPart(this.multipart, partToHighlightAsObject.partID);
                partToHighlight.unhighlight();
                partToHighlight.highlight("yellow");
            }
            var wireframePartToHightligh = this.getPart(this.wireframe, partToHighlightAsObject.partID);
            if (wireframePartToHightligh && !this.isWireframeTransparent) {
                wireframePartToHightligh.unhighlight();
                wireframePartToHightligh.highlight("yellow");
            }
            this.highlighted.push(partToHighlightAsObject);
        },

        unhighlightPart: function (highlightedPartAsObject) {
            // var partId = highlightedPartAsObject.substring(0, 22);
            var partId;
            if (this.entitySelection) {
                partId = highlightedPartAsObject;
            } else {
                partId = highlightedPartAsObject.substring(0, 22);
            }
            var isSelected = _.findWhere(this.selected, {multipartID: this.multipart.id, partID: partId});
            var highlightedPart = this.getPart(this.multipart, highlightedPartAsObject);
            highlightedPart.unhighlight();
            if (isSelected && !this.isMultipartTransparent) {
                highlightedPart.unhighlight();
                highlightedPart.highlight(this.color);
            }
            var wireframeHighlightedPart = this.getPart(this.wireframe, highlightedPartAsObject);
            if (wireframeHighlightedPart) {
                wireframeHighlightedPart.unhighlight();
            }
            if (isSelected && !this.isWireframeTransparent) {
                wireframeHighlightedPart.unhighlight();
                wireframeHighlightedPart.highlight(this.color);
            }
            this.highlighted.pop();
        },

        deselectPart: function (partObject, shouldRemainInArray) {
            var self = this;
            var usedMultipart;
            var partToDeselect = _.findWhere(this.selected, partObject);

            if (!shouldRemainInArray) {
                this.selected = _.reject(this.selected, function (part) {
                    return part.multipartID == self.getMultipartID() &&
                        part.partID == partObject.partID;
                });
            }

            var parts = this.getPart(this.multipart, partObject.partID);
            var wireframeParts = this.getPart(this.wireframe, partObject.partID);
            if (!parts) {
                usedMultipart = document.getElementById(partObject.multipartID);
                parts = this.getPart(usedMultipart, partObject.partID);
                parts.unhighlight();
            } else {
                parts.unhighlight();
            }
            if (wireframeParts) {
                wireframeParts.unhighlight();
            }
        },
        getPart: function (multipart, partId) {
            var replacedId = this.regExpEscape(partId);
            var regexp = new RegExp(replacedId);
            var parts = multipart.getParts(regexp);

            return parts;
        },
        regExpEscape: function (text) {
            return text.replace(/[-_[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        },

        deselectAll: function () {
            var parts = this.multipart.getParts();
            var wireframeParts = this.wireframe.getParts();

            if(parts) parts.unhighlight();
            if(wireframeParts) wireframeParts.unhighlight();
        },

        deselectFromTable: function (data) {
            this.deselectPart(data.model);
        },

        handleClick: function (e) {
            var selectionCount = Viewer.ModelTree.elementSelection.length;
            var partID = e.partID.replace(/(__ID.+)$/, '');
            var selection = partID + '@' + this.model.id;

            var isSelected = Viewer.ModelTree.elementSelection.get(selection);

            if ( this.keynum === Keyboard.S) {
                if(isSelected) Viewer.vent.trigger('screen:part:deselected', [selection]);
                else Viewer.vent.trigger('screen:part:selected', [selection]);
            } else {
                if(isSelected) {
                    if(selectionCount > 1) {
                        Viewer.vent.trigger('screen:deselectAll');
                        Viewer.vent.trigger('screen:part:selected', [selection]);
                    }
                    else Viewer.vent.trigger('screen:part:deselected', [selection]);
                } else {
                    Viewer.vent.trigger('screen:deselectAll');
                    Viewer.vent.trigger('screen:part:selected', [selection]);
                }
            }

//          this.checkAppearance();
        },

        checkAppearance: function () {
            var appearanceIds = this.multipart.getAppearanceIdList();
            var parts;
            var self = this;
            _.each(appearanceIds, function (appearanceID) {
                parts = self.multipart.getParts([appearanceID]);
            })
        },

        handleMouseEnter: function (e) {
            var partID;
            if (this.entitySelection) {
                partID = e.partID;
            } else {
                partID = e.partID.substring(0, 22);
            }
            var div = $("#viewer");
            $(div).attr("title", e.partID);
            this.highlightPart(partID);
        },

        handleMouseOut: function (e) {
            var partID;
            if (this.entitySelection) {
                partID = e.partID;
            } else {
                partID = e.partID.substring(0, 22);
            }
            e.preventDefault();
            if ($("#viewer").attr("title")) {
                $("#viewer").removeAttr("title");
            }
            this.unhighlightPart(partID);
        },

        // hidePart: function (partID) {
        //     var partToHideAsObject = this.toObject(partID);
        //     var isHidden = _.findWhere(this.hidden, partToHideAsObject);
        //
        //     if (!isHidden) {
        //         var parts = this.getPart(this.multipart, partID);
        //         parts.setVisibility(false);
        //         var wireframeParts = this.getPart(this.wireframe, partID);
        //         if (wireframeParts && !this.isWireframeTransparent) {
        //             wireframeParts.setVisibility(false);
        //         }
        //
        //         this.hidden.push(partToHideAsObject);
        //         Viewer.vent.trigger("screen:part:hide", partToHideAsObject);
        //     }
        // },
        //
        // unhidePart: function (partID) {
        //     var self = this;
        //     var partToUnhideAsObject = this.toObject(partID);
        //     var isHidden = _.findWhere(this.hidden, partToUnhideAsObject);
        //
        //     if (isHidden) {
        //         this.hidden = _.reject(this.hidden, function (part) {
        //             return part.multipartID == self.getMultipartID() &&
        //                 part.partID == partID;
        //         });
        //
        //         var parts = this.getPart(this.multipart, partID);
        //         parts.setVisibility(true);
        //         var wireframeParts = this.getPart(this.wireframe, partID);
        //         if (wireframeParts && !this.isWireframeTransparent) {
        //             wireframeParts.setVisibility(true);
        //         }
        //
        //         Viewer.vent.trigger("screen:part:unhide", partToUnhideAsObject);
        //     }
        // },

        unhideFromTable: function (data) {
            this.unhidePart(data.model.attributes.partID);
        },

        changePartVisibility: function (visible, partId) {
            var part = this.getPart(this.multipart, partId);
            if (part) {
                if (visible) {
                    this.unhidePart(partId);
                } else {
                    this.hidePart(partId);
                }
            }
        },

        changeSelectedVisibility: function (visible) {
            var multipartID = $(this.multipart).attr("id");

            var localParts = _.where(this.selected, {'multipartID': multipartID});

            var self = this;

            _.each(localParts, function (part) {
                self.changePartVisibility(visible, part.partID);
            });
        },

        changeMultipartVisibility: function (visible) {
            var multipartID = $(this.multipart).attr("id");

            var parts = this.multipart.getParts();
            parts.setVisibility(visible);

            this.hidden = _.reject(this.hidden, function (part) {
                return part.multipartID == multipartID;
            });

            var wireframeParts = this.wireframe.getParts();
            if (wireframeParts && !this.isWireframeTransparent) {
                wireframeParts.setVisibility(visible);
            }

            if (!visible) {
                var idList = this.multipart.getIdList();

                for (var i in idList) {
                    this.hidden.push({
                        'multipartID': multipartID,
                        'partID': idList[i].substring(0, 22)
                    });
                }
            }
        },

        changeMultiPartTransparency: function (visible) {
            this.changePartTransparency(this.multipart, visible);
            this.isMultipartTransparent = visible;
        },

        changeWireframeTransparency: function (visible) {
            this.changePartTransparency(this.wireframe, visible);
            this.isWireframeTransparent = visible;
        },

        changePartTransparency: function (part, isTransparent) {
            var parts = part.getParts();

            if (isTransparent) {
                //set the part to transparant and unhighlight selected
                // parts.unhighlight();
                parts.setVisibility(false);
            } else {
                //reset the part to default colors and highlight selected
                parts.setVisibility(true);
                var selected = _.where(this.selected, {
                    'multipartID': $(this.multipart).attr("id")
                });
                for (var item in selected) {
                    var selectedParts = this.getPart(part, selected[item].usedPartID);
                    selectedParts.highlight(this.color);
                }

                var hidden = _.where(this.hidden, {
                    'multipartID': $(this.multipart).attr("id")
                });

                for (var item1 in hidden) {
                    var hiddenParts = this.getPart(part, hidden[item1].usedPartID);
                    hiddenParts.setVisibility(false);
                }
            }
        },
        onDeselectObjectFromTable: function (data) {
            this.deselectPart(data.partID);
        },
        getMultipartID: function () {
            return $(this.multipart).attr("id");
        },
        toObject: function (partID) {
            var object = {
                multipartID: this.getMultipartID(),
                partID: partID
            };
            return object;
        },
        changeSelectionMode: function (cmd) {

        },

        changePartColor: function (color, partId) {
            var parts = this.getPart(this.multipart, partId);
            var partsWireframe = this.getPart(this.wireframe, partId);
            parts.unhighlight();
            parts.highlight(color);
            partsWireframe.unhighlight();
            partsWireframe.highlight(color);
        },

        handleEntitySelection: function (isEnabled) {
            this.entitySelection = isEnabled;
        },
        selectParts: function (partsToSelect) {
            var partIds = this.extractPartIds(partsToSelect);

            if(!partIds.length) return;

            var matcher = this.getMatcherRegExp(partIds);
            var parts = this.multipart.getParts(matcher);
            var wireframeParts = this.wireframe.getParts(matcher);

            if(parts) parts.highlight(this.color);
            if(wireframeParts) wireframeParts.highlight(this.color);
        },
        deselectParts: function (partsToDeselect) {
            var partIds = this.extractPartIds(partsToDeselect);

            if(!partIds.length) return;

            var matcher = this.getMatcherRegExp(partIds);
            var parts = this.multipart.getParts(matcher);
            var wireframeParts = this.wireframe.getParts(matcher);

            if(parts) parts.unhighlight();
            if(wireframeParts) wireframeParts.unhighlight();
        },
        hideAll: function() {
            var parts = this.multipart.getParts();
            var wireframeParts = this.wireframe.getParts();
            parts.setVisibility(false);
            wireframeParts.setVisibility(false)
        },
        showAll: function() {
            var parts = this.multipart.getParts();
            var wireframeParts = this.wireframe.getParts();
            parts.setVisibility(true);
            wireframeParts.setVisibility(true)
        },
        showParts: function(partsToShow) {
            var partIds = this.extractPartIds(partsToShow);

            if(!partIds.length) return;

            var matcher = this.getMatcherRegExp(partIds);
            var parts = this.multipart.getParts(matcher);
            var wireframeParts = this.wireframe.getParts(matcher);

            if(parts) parts.setVisibility(true);
            if(wireframeParts) wireframeParts.setVisibility(true);
        },
        hideParts: function(partsToHide) {
            var partIds = this.extractPartIds(partsToHide);

            if(!partIds.length) return;

            var matcher = this.getMatcherRegExp(partIds);
            var parts = this.multipart.getParts(matcher);
            var wireframeParts = this.wireframe.getParts(matcher);

            if(parts) parts.setVisibility(false);
            if(wireframeParts) wireframeParts.setVisibility(false);
        },
        extractPartIds: function(parts) {
            var multipart = this.model.id;
            return _.reduce(parts, function(allParts, elementId) {
                var element = elementId.split('@');
                if(element[1] === multipart) return allParts.concat([element[0]]);
                return allParts;
            }, []);
        },
        // ['a','b','c'] => "^a(__ID.+)*$|^b(__ID.+)*$|^c(__ID.+)*$"
        // ['^($'] => "^\^\(\$(__ID.+)*$"
        getMatcherRegExp: function(partIds) {
            partIds = _.map(partIds, function(partId) {
                return '^' + partId.replace(/([\\$^()|.{}[\]])/g, "\\$1") + '(__ID.*)*$';
            });
            return new RegExp(partIds.join('|'))
        },

        setPartsColor: function (color) {
            this.color = color;
        },

        setColors: function (elementsObject, colorMap) {
            var typesInformation = elementsObject.elements;
            var parts;
            var self = this;
            var materialObj;

            typesInformation.forEach(function (typeInfo) {
                materialObj = self.getDefaultMaterial(typeInfo.Type, colorMap);
                console.time(typeInfo.Type + '[' + typeInfo.PartIds.length + ']');
                parts = self.multipart.getParts(typeInfo.PartIds);

                if (parts) {
                    parts.setDiffuseColor(materialObj.defaultColor);
                    parts.setSpecularColor(materialObj.defaultColor);
                    parts.setEmissiveColor(materialObj.defaultColor);
                    parts.setTransparency(materialObj.transparency);
                    console.timeEnd(typeInfo.Type + '[' + typeInfo.PartIds.length + ']');
                }
            });
        },

        setColorsByTypeId: function (elementsObject, colorMap) {
            var typesInformation = elementsObject.elements;
            var parts;
            var self = this;
            var materialObj;
            var regExp;

            var regString;
            typesInformation.forEach(function (typeInfo) {
                materialObj = self.getDefaultMaterial(typeInfo.type, colorMap);
                // regString = "[a-zA-Z0-9_$]*(__ID[0-9]{1,}_{0,2})" + "__" + typeInfo.TypeID;
                regString = "__" + typeInfo.TypeID + "$";
                regExp = new RegExp(regString);
                console.time(typeInfo.type);
                parts = self.multipart.getParts(regExp);

                if (parts) {
                    parts.setDiffuseColor(materialObj.defaultColor);
                    parts.setSpecularColor(materialObj.defaultColor);
                    parts.setEmissiveColor(materialObj.defaultColor);
                    parts.setTransparency(materialObj.transparency);
                    console.timeEnd(typeInfo.type);
                }
            });
        },

        getDefaultMaterial: function (ifcType, colorMap) {
            var material = {
                "defaultColor": '',
                "transparency": 0
            };
            var usedMaterial = colorMap.find(function (obj) {
                if (obj.ifcType === ifcType) {
                    return obj;
                }
            });
            if (!usedMaterial) {
                material.defaultColor = "#D4CCB2";
            } else {
                material = usedMaterial;
            }

            return material;

        },

        resetColor: function () {
            var parts = this.multipart.getParts();
            var wireframe = this.wireframe.getParts();
            parts.resetColor();
            wireframe.resetColor();
        }
    });
});
