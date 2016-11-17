Viewer.module('Update', function(Update, Viewer, Backbone, Marionette, $, _){
    Update.Controller = {
        init: function() {
            this.view = new Update.View();
            Viewer.modalRegion.show(this.view);

            Viewer.on('viewer:command', this.handleCommand.bind(this));
        },

        destroy: function() {
            Viewer.vent.off('viewer:command', this.handleCommand.bind(this));
        },

        handleCommand: function(cmd) {
            switch(cmd) {
                case 'update':
                    this.update();
                    break;
                case 'updatelog':
                    this.showLog();
                    break;
                default:
                    break;
            }
        },

        update: function() {
            var updateUrl = Viewer.Config.getHttpsUrl() + 'update';
            var xhr = new XMLHttpRequest();

            var self = this;
            xhr.addEventListener('load', function() {
                if(this.status === 200) {
                    self.view.showMsg('Update started');
                } else {
                    self.view.showMsg(this.responseText);
                }
            });

            xhr.open('GET', updateUrl);
            xhr.send();
        },

        showLog: function() {
            var logUrl = Viewer.Config.getHttpsUrl() + 'update/log';
            var xhr = new XMLHttpRequest();

            var self = this;
            xhr.addEventListener('load', function() {
                self.view.showMsg(this.responseText.replace('\n', '<br>'));
            });

            xhr.open('GET', logUrl);
            xhr.send();
        }
    };
});
