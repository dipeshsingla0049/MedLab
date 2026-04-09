# 🏥 MedLab

🌐 **Live Demo:** [https://med-lab-two.vercel.app](https://med-lab-two.vercel.app)

## 📌 Overview
 
**MedLab** is a real-time hospital bed availability web application built with plain HTML, CSS, and JavaScript — no frameworks, no libraries. It fetches live hospital data from a public API and presents it in a clean, filterable dashboard — helping patients and families make faster decisions during medical emergencies.
 
---
 
## 🎯 Problem Statement
 
During medical emergencies, people waste precious time calling hospitals one by one to check bed availability. There is no simple platform that shows real-time bed status and hospital contact info at a glance.
 
**MedLab solves this by providing:**
 
- Instant visibility of ICU and General bed availability
- Search by hospital name or city
- City-based filtering to find nearby hospitals
- One-click Emergency ICU finder
- Favorites to save and revisit preferred hospitals
- Hospital detail modal with directions to Google Maps
 
---
 
## ✨ Features
 
| Feature | Description |
|---|---|
| 🔍 Smart Search | Search hospitals by name or city |
| 🏙️ City Filter | Filter by city — built dynamically from API data |
| 🛏️ Bed Type Filter | Filter between ICU Only and General Only |
| ↕️ Sort Options | Sort by name (A–Z) or most available beds |
| 🚨 Emergency ICU Finder | One-click button in navbar shows only hospitals with ICU beds |
| ❤️ Favorites | Save hospitals to localStorage and view them on the Favorites page |
| 🏥 Hospital Detail Modal | Full info popup with bed counts, phone number, and Google Maps directions |
| 🟢 Status Badges | Color-coded: Green (Available > 10), Yellow (Limited ≤ 10), Red (Full = 0) |
| 🔗 Hero Search | Search from home page redirects to beds page with query pre-filled |
 
---
 
## 🔌 API Used
 
```
GET https://69c16e00085e1a9fae410108.mockapi.io/api/v1/Hospitals
```
 
Returns an array of 40 hospital objects. Each object contains:
 
| Field | Type | Description |
|---|---|---|
| id | String | Unique hospital identifier |
| name | String | Hospital name |
| image | URL | Hospital photo |
| city | String | City where hospital is located |
| phone | String | Contact number |
| generalBeds | Number | Total general beds |
| icuBeds | Number | Total ICU beds |
| availBeds | Number | Currently available beds |
 
---
 
## 📁 Project Structure
 
```
medlab/
├── index.html        → Home page with hero search and features
├── about.html        → Mission, tech stack sections
├── beds.html         → Main hospital finder with filters and cards
├── favorites.html    → Saved hospitals from localStorage
├── style.css         → Single shared stylesheet for all pages
└── script.js         → All JavaScript logic
```
 
---
 
## ⚙️ How It Works
 
1. User lands on `index.html` and can search from the hero bar
2. Search redirects to `beds.html?q=query` — query is pre-filled automatically
3. On `beds.html`, the API is fetched **once** and stored in memory
4. Search, city filter, bed type filter, and sort all work on that stored data — no repeated API calls
5. Clicking **View Details** opens a modal with full hospital info and a Google Maps link
6. Clicking **Save** stores the hospital in `localStorage`
7. `favorites.html` reads from `localStorage` and renders the same cards
 
---
 
## 🛠️ Tech Stack
 
| Technology | Purpose |
|---|---|
| HTML5 | Page structure across 4 pages |
| CSS3 | Styling, animations, responsive layout |
| JavaScript | API fetch, DOM manipulation, filters, localStorage |
| MockAPI | Backend data source — 40 Indian hospitals |
| Google Fonts | Syne (headings) + DM Sans (body) |
 
---
 

