from odoo import fields, models

class PosOrderTag(models.Model):
    _name = "pos.order.tag"
    _description = "POS Order Tag"
    _order = "name"

    name = fields.Char(string="Tag", required=True)
    color = fields.Integer(string="Color")