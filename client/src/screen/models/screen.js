/**
 * Created by Marianna Vladimirova on 25.9.2014 г..
 */

Viewer.module("Screen.Models", function(Models, Viewer, Backbone, Marionette, $, _){
    Models.Multipart = Backbone.Model.extend({
       defaults: {
           //id: "model",
           //urlmodel: "../server/models/CLI_TPM_AT_ALL_ARC_400/CLI_TPM_AT_ALL_ARC_400.x3d",
           //urlIDMap: "../server/models/CLI_TPM_AT_ALL_ARC_400/idmap.json"
       }
   });
   Models.Multiparts = Backbone.Collection.extend({
       model: Models.Multipart
   });

});