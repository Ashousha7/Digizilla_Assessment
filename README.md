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

