# 🏥 MedLab
## 📌 Overview
**MedLab** is a real-time hospital bed availability web application built with plain HTML, CSS, and JavaScript. It fetches real Indian hospital data from a public API and presents it in a clean, filterable dashboard — helping patients and families make faster decisions during medical emergencies.

## 🎯 Problem Statement
During medical emergencies, people waste precious time calling hospitals one by one to check bed availability. There is no simple platform that shows real-time bed status, disease specialties, and hospital contact info at a glance.

**MedLab solves this by providing:**
- Instant visibility of ICU and General bed availability
- Search by hospital name or disease specialty
- City-based filtering to find nearby hospitals
- One-click Emergency ICU finder
- Favorites to save and revisit preferred hospitals

## ✨ Features
| Feature | Description |
|---|---|
| 🔍 Smart Search | Search hospitals by name or disease specialty |
| 🏙️ City Filter | Filter by city — Delhi, Mumbai, Bangalore, Chennai & more |
| 🛏️ Bed Type Filter | Filter between ICU and General bed availability |
| ↕️ Sort Options | Sort by name, available beds, or price category |
| 🚨 Emergency ICU Finder | Instantly shows hospitals with ICU beds available |
| ❤️ Favorites | Save hospitals using localStorage |
| 🏥 Hospital Detail Modal | Full info popup with bed status, contact & directions |
| 🟢 Status Indicators | Color-coded badges: Green (Available), Yellow (Limited), Red (Full) |

## 🔌 API Used
 
**Indian Hospitals & Diagnostics Centers** via RapidAPI
 
```
GET https://indian-hospitals-diagnostics-centers.p.rapidapi.com/hospitals/all
```
 
The API provides real hospital names, cities, and contact details across India.
All additional data (bed counts, disease specialties, ratings, price category) is layered on top dynamically.
