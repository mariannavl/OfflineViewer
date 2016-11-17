Viewer.module("Config", function(Config, Viewer, Backbone, Marionette, $, _) {
    var conf = {
      httpPort: 3000,
      httpsPort: 3001,
      domain: 'localhost',

      getHttpUrl: function() {
        return 'http://' + this.domain + ':' + this.httpPort + '/';
      },

      getHttpsUrl: function() {
        return 'http://' + this.domain + ':' + this.httpPort + '/';
      }
    };

    _.extend(Config, conf);
});
