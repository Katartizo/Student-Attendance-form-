# 📍 Smart Geolocation Student Attendance System

A web-based attendance tracker built to eliminate proxy signing in university lecture halls. The system utilizes the browser's Geolocation API to verify a student's exact physical coordinates before unlocking the attendance form. 

**Live Demo:** [View Live on Vercel](https://student-attendance-form-pi.vercel.app)

---

## 🛑 The Problem
Traditional paper attendance sheets in large university classes are slow, chaotic, and easily manipulated. Students frequently sign for absent friends (proxy attendance), making the data highly inaccurate.

## 💡 The Solution
This application digitizes the process while adding a layer of location-based security. Students must be physically present within a specific, predetermined radius of the lecture hall to access the form. 

### 🚀 Key Features & Security Layers
* **GPS Geofencing:** Uses the HTML5 Geolocation API to get the user's coordinates.
* **Mathematical Distance Calculation:** Implements the **Haversine Formula** in Vanilla JavaScript to calculate the straight-line distance between the student's device and the classroom coordinates.
* **Dynamic Access Control:** If the student is outside the allowed radius (e.g., 50 meters), the DOM dynamically hides the form and displays a real-time "Access Denied" error showing their exact distance away.
* **Class Code Verification (2FA):** Includes a mandatory input field for a randomly generated "Class Number" written on the physical whiteboard, preventing students in adjacent buildings from submitting.
* **Device Locking (Anti-Spam):** Utilizes browser `localStorage` to lock the device after a successful submission, preventing a single student from refreshing the page to submit for multiple friends.
* **Responsive UI:** Fully mobile-friendly interface built with custom CSS.

---

## 🛠️ Tech Stack
* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
* **APIs:** HTML5 Geolocation API
* **Deployment:** Vercel

---

## 🧠 How it Works (Under the Hood)
When a student clicks "Verify My Location", the app requests their current latitude and longitude. It then runs those coordinates through the Haversine formula against the hardcoded `CLASS_LAT` and `CLASS_LON` variables. 

```javascript
// The Haversine Formula logic used in the app
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Returns distance in meters
}
