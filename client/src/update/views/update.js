Viewer.module('Update', function(Update, Viewer, Backbone, Marionette, $, _){
    Update.View = Marionette.ItemView.extend({
        template: '#update-notification',
        ui: {
            msg: '#msg',
            modal: '#notification-modal'
        },
        events: {
            'click': 'closeModal'
        },
        showMsg: function(msg) {
            this.ui.msg.html(msg);
            this.ui.modal.foundation('reveal', 'open');
        },
        closeModal: function() {
            this.ui.modal.foundation('reveal', 'close');
            this.ui.msg.html('');
        }
    });
});
