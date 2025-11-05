odoo.define('pos_order_tags.tag_button', function (require) {
    "use strict";

    var screens = require('point_of_sale.screens');
    var core = require('web.core');
    var PopupWidget = require('point_of_sale.popups');
    var models = require('point_of_sale.models');

    var _t = core._t;

    // load tags from backend to pos
    models.load_models({
        model: 'pos.order.tag',
        fields: ['name','color'],
        loaded: function(self, tags){
            self.pos_order_tags = tags;
        },
    });

    // Popup to choose tags (basic)
    var TagSelectionPopup = PopupWidget.extend({
        template: 'PosTagPopup',
        init: function(parent, options){
            this._super(parent, options);
            this.tags = options.tags || [];
            this.selectedIds = options.selectedIds || [];
        },
        show: function(options){
            options = options || {};
            this._super(options);
            this.tags = options.tags || this.tags;
            this.selectedIds = options.selectedIds || this.selectedIds || [];
            this.renderElement();
        },
        toggle: function(tag_id){
            var idx = this.selectedIds.indexOf(tag_id);
            if(idx === -1){
                this.selectedIds.push(tag_id);
            } else {
                this.selectedIds.splice(idx,1);
            }
            this.renderElement();
        },
        confirm: function(){
            this.trigger('close', {confirmed: true, selected: this.selectedIds});
            this.close();
        },
        cancel: function(){
            this.trigger('close', {confirmed: false});
            this.close();
        }
    });

    // Add button in OrderWidget
    var OrderWidget = screens.OrderWidget;
    screens.OrderWidget.include({
        renderElement: function(){
            var self = this;
            this._super();
            if (this.$el.find('.pos-order-tags-btn').length === 0) {
                var $btn = $('<button type="button" class="button pos-order-tags-btn">Tags</button>');
                $btn.click(function(){
                    var tags = self.pos.pos_order_tags || [];
                    var selected = (self.pos.get_order() && self.pos.get_order().get_order_tags_ids && self.pos.get_order().get_order_tags_ids()) || [];
                    var popup = new TagSelectionPopup(self, {tags: tags, selectedIds: selected});
                    popup.open();
                    popup.on('close', null, function(event){
                        if(event.data.confirmed){
                            var order = self.pos.get_order();
                            if(order){
                                order.set_order_tags(event.data.selected);
                                self.renderElement();
                            }
                        }
                    });
                });
                this.$('.orderline-container').after($btn);
            }
        }
    });

    // Extend Order object to hold tag ids and export them
    var _super_order = models.Order.prototype;
    models.Order = models.Order.extend({
        init_from_JSON: function(json) {
            _super_order.init_from_JSON.apply(this, arguments);
            this.order_tag_ids = json.order_tag_ids || [];
        },
        export_as_JSON: function() {
            var json = _super_order.export_as_JSON.apply(this, arguments);
            json.order_tag_ids = this.order_tag_ids || [];
            return json;
        },
        set_order_tags: function(tag_ids) {
            this.order_tag_ids = tag_ids || [];
            // optionally show them in UI
        },
        get_order_tags_ids: function(){
            return this.order_tag_ids || [];
        },
    });

    // Validate order: ensure at least one tag
    var _super_screen = screens.PaymentScreenWidget.prototype;
    screens.PaymentScreenWidget.include({
        validate_order: function(force_validation) {
            var order = this.pos.get_order();
            var tag_ids = order && order.get_order_tags_ids && order.get_order_tags_ids();
            if(!tag_ids || tag_ids.length === 0){
                this.pos_widget.screen_selector.show_popup('error', {
                    'title': _t('Select order tag'),
                    'body': _t('You must select at least one order tag before confirming the order.'),
                });
                return;
            }
            return _super_screen.validate_order.apply(this, arguments);
        }
    });

    // When order is pushed to backend, the exported JSON contains order_tag_ids.
    // pos_order.fields 'pos_tag_ids' on backend will accept these ids if you map them properly in backend order creation.
});
