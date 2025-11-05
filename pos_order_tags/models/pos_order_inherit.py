from odoo import models, api, fields

class PosOrder(models.Model):
    _inherit = "pos.order"

    pos_tag_ids = fields.Many2many(
        comodel_name="pos.order.tag",
        relation="pos_order_tag_rel",
        column1="order_id",
        column2="tag_id",
        string="Order Tags",
    )

    @api.model
    def _process_order_tags(self, data):
        # data is the POS order JSON exported
        tag_ids = data.get('order_tag_ids') or []
        # if they are ids from local DB, use them; POS sometimes send ids or temporary ids
        # We'll return list of (6, 0, ids)
        if tag_ids:
            # make sure they're ints
            try:
                tag_ids = [int(x) for x in tag_ids]
            except Exception:
                tag_ids = []
        return [(6, 0, tag_ids)]

    @api.model
    def create_from_ui(self, orders, draft=False):
        """Override to attach pos_tag_ids from order JSON"""
        for order in orders:
            data = order.get('data', {})
            order['data']['pos_tag_ids'] = self._process_order_tags(data)
        return super(PosOrder, self).create_from_ui(orders, draft=draft)
