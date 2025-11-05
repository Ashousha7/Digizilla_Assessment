# Digizilla_Assessment
Odoo Custom Module Developing 

# 🏷️ POS Order Tags — Odoo 16 Community Module

## 📖 Overview
**POS Order Tags** is a custom Odoo 16 Community module that extends the **Point of Sale (POS)** app.

It allows POS users to:
- Create and manage **Order Tags** in the backend.
- Select one or more tags for each POS order directly from the POS interface.
- Prevent order confirmation if no tag is selected.
- Store selected tags on each order for reporting and tracking.
- Create tags externally via a **REST API**.

This module is fully compatible with **Odoo 16 Community** and can be upgraded to **Odoo 17**.

---

## ⚙️ Features

| Feature | Description |
|----------|--------------|
| 🏷 Create Tags | Create POS Order Tags from the backend (name + color). |
| 🎨 Color Picker | Each tag includes a color field with a color picker widget. |
| 🧾 POS Integration | A **Tags** button in the POS lets cashiers select order tags. |
| ⛔ Mandatory Selection | Order cannot be confirmed without selecting at least one tag. |
| 💾 Backend Storage | Selected tags are stored on the `pos.order` record. |
| 🌐 REST API | Easily create tags via external systems with a JSON API. |

---

## 🧩 Module Structure
pos_order_tags/
├── init.py
├── manifest.py
├── models/
│ ├── init.py
│ ├── pos_order_tag.py
│ └── pos_order_inherit.py
├── controllers/
│ ├── init.py
│ └── pos_tag_api.py
├── views/
│ └── pos_order_tag_views.xml
└── static/
└── src/
├── js/
│ └── pos_tag_button.js
└── xml/
└── pos_tag_popup.xml


---

## 🧠 Technical Explanation

### 1. Backend Model — `pos.order.tag`
Defines the **Order Tag** model with two fields:
- `name`: The tag label (Char)
- `color`: Integer field rendered with a color picker.

### 2. POS Order Extension
Extends the `pos.order` model with:
```python
pos_tag_ids = fields.Many2many('pos.order.tag', string='Order Tags')
This links orders to tags and ensures they are saved from the POS.

3. POS UI Integration
Loads available tags when the POS starts.

Adds a “Tags” button in the order section.

Displays a popup to select one or more tags.

Prevents order confirmation if no tags are chosen.

4. REST API
POST /pos_order_tag_api/create_tag

Example request:

bash
Copy code
curl -X POST http://localhost:8069/pos_order_tag_api/create_tag \
     -H "Content-Type: application/json" \
     -d '{"tag": "VIP", "color": 5}'
Example response:

json
Copy code
{
  "id": 3,
  "name": "VIP",
  "color": 5
}
🚀 Installation
Copy the module folder pos_order_tags/ into your Odoo addons directory:

bash
Copy code
/odoo/odoo-server/addons/pos_order_tags
Restart your Odoo server:

bash
Copy code
./odoo-bin -u pos_order_tags -d <your_database_name>
Go to Apps → Update Apps List → Search "POS Order Tags" → Install.

🧭 How to Use
🛠 Backend:
Go to Point of Sale → Configuration → Order Tags.

Click Create to add new tags (enter Tag Name and Color).

🧾 POS Frontend:
Open a POS session.

Add products to an order.

Click the new Tags button.

Select one or more tags (must select at least one).

Click Confirm and process payment.

✅ After Order:
Go to Point of Sale → Orders → [Order Name]

Check that your selected tags are listed in the Order Tags field.

🔒 Security Notes
For simplicity, the REST API uses auth='none'.
In production:

Use API keys or token authentication.

Limit access to POST requests only.

Serve over HTTPS.

🧩 Future Enhancements (Upgrade to Odoo 17)
In Odoo 17, the backend model remains identical, but the POS UI is rewritten in OWL.
To upgrade:

Convert JS code to an OWL component.

Register your tag button and popup in the POS component registry.

🧪 Testing
Functional Test
Step	Expected Result
Create Tags in backend	Tags are saved and appear in list view.
Open POS session	Tags are loaded at startup.
Add product and click “Tags”	Popup appears with tag list.
Confirm without selecting	Validation error shown.
Confirm with tags	Order is created and tags are saved.

API Test
Send:

bash
Copy code
curl -X POST http://localhost:8069/pos_order_tag_api/create_tag \
     -H "Content-Type: application/json" \
     -d '{"tag": "Online", "color": 2}'
→ Returns JSON with tag ID and details.

