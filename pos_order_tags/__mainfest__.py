{
    "name": "POS Order Tags",
    "summary": "Add order tags to POS orders and a REST API to create tags",
    "version": "16.0.1.0.0",
    "author": "Your Name",
    "category": "Point of Sale",
    "depends": ["point_of_sale"],
    "data": [
        "views/pos_order_tag_views.xml",
        "static/src/xml/pos_tag_popup.xml",
    ],
    "qweb": [
        # if you use QWeb templates for popup in v16, include xml here if needed
    ],
    "installable": True,
    "application": False,
}