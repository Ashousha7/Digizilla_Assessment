from odoo import http
from odoo.http import request
import json

class PosTagAPI(http.Controller):

    @http.route('/pos_order_tag_api/create_tag', type='json', auth='none', methods=['POST'], csrf=False)
    def create_tag(self, **post):
        # Basic "public" endpoint; in production use auth/token checks.
        try:
            data = request.jsonrequest if request.jsonrequest else post
        except Exception:
            data = post

        tag_name = data.get('tag') or data.get('name')
        color = data.get('color')

        if not tag_name:
            return {"error": "Missing 'tag' attribute"}

        # optional: implement API key header check
        # api_key = request.httprequest.headers.get('X-API-KEY')
        # if api_key != 'expected_key': return {"error": "Unauthorized"}, 401

        vals = {"name": tag_name}
        if color is not None:
            try:
                vals["color"] = int(color)
            except Exception:
                pass

        tag = request.env['pos.order.tag'].sudo().create(vals)
        return {
            "id": tag.id,
            "name": tag.name,
            "color": tag.color,
        }
