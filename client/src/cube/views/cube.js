Viewer.module('Cube', function(Cube, Viewer, Backbone, Mn, $, _) {
   Cube.X3DCubeView = Marionette.ItemView.extend({
       tagName: 'x3d',
       template: '#navi-cube-template',
       attributes: {
           width: '200px',
           height: '200px'
       },
       behaviors: {
           NavicubeBehavior: {
               behaviorClass: NavicubeBehavior,
               syncWith: '#x3dElement'
           }
       },
       onShow: function() {
           x3dom.reload();
           var $viewer = $('#x3dElement');

           this.$el.parent().css({
               marginTop: '-200px'
           });

           this.$el.x3dSync({
               connected: $viewer
           });
       }
   })
});