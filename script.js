// ===================================
// 1. GPS CONFIGURATION
// ===================================
const CLASS_LAT = 7.800461; 
const CLASS_LON = 3.913026;
// Radius is set to 50 meters so students must be inside or right next to the hall
const ALLOWED_RADIUS = 50; 

const statusEl = document.getElementById('status-message');
const formContainer = document.getElementById('google-form-container');

// ===================================
// 2. GPS VERIFICATION LOGIC
// ===================================
function checkLocation() {
    statusEl.className = 'loading';
    statusEl.innerText = "Checking GPS... Please wait.";

    if (!navigator.geolocation) {
        showError("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(success, error, {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0
    });
}

function success(position) {
    const userLat = position.coords.latitude;
    const userLon = position.coords.longitude;
    const distance = getDistance(CLASS_LAT, CLASS_LON, userLat, userLon);

    if (distance <= ALLOWED_RADIUS) {
        showSuccess(`Success! You are in class (${Math.round(distance)}m away).`);
        formContainer.style.display = "block"; // Shows the form
    } else {
        showError(`Access Denied. You are ${Math.round(distance)}m away. You must be within ${ALLOWED_RADIUS}m.`);
        formContainer.style.display = "none"; // Keeps the form hidden
    }
}

function error(err) {
    let msg = "Unable to retrieve location.";
    if (err.code === 1) msg = "Location Access Denied. Please allow permissions.";
    if (err.code === 2) msg = "GPS Signal Unavailable.";
    if (err.code === 3) msg = "Location request timed out.";
    showError(msg);
}

function showSuccess(msg) { statusEl.className = 'success'; statusEl.innerText = msg; }
function showError(msg) { statusEl.className = 'error'; statusEl.innerText = msg; }

// Haversine Formula for exact distance on Earth's curve
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; 
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}
function deg2rad(deg) { return deg * (Math.PI/180); }

// ===================================
// 3. GOOGLE SHEETS SUBMISSION LOGIC
// ===================================
const form = document.getElementById('attendance-form');
const submitBtn = document.getElementById('submit-btn');

// Your active Google Apps Script API Link
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxS7Cu4QM1__DivX1ftX1nNRoc7ijHVP-vzOSbPAK94MaaEqSPJzTAoSVUpvlaDJiDXvA/exec";

form.addEventListener('submit', e => {
    e.preventDefault(); // Stops the page from refreshing immediately
    
    // 1. Grab all values using the exact IDs from your HTML
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const studentMatric = document.getElementById("matric-number").value;
    const studentEmail = document.getElementById("email").value;
    const studentLevel = document.getElementById("referrer").value;
    const classCode = document.getElementById("bio").value; 
    
    // 2. Package all the data perfectly for Google Sheets
    const payload = {
        matric: studentMatric,
        name: firstName + " " + lastName, // Combines names smoothly
        email: studentEmail,
        level: studentLevel,
        classNumber: classCode
    };

    // 3. Update the button to show it is processing
    submitBtn.value = "Submitting...";
    submitBtn.disabled = true;

    // 4. Fire the JSON data to Google Sheets
    fetch(WEB_APP_URL, {
        method: "POST",
        mode: "no-cors", // Crucial so Google doesn't block the request
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(() => {
        alert("Attendance Submitted Successfully! ✓");
        form.reset(); // Clears the inputs for the next person
        submitBtn.value = "Submit Attendance";
        submitBtn.disabled = false;
        formContainer.style.display = "none"; // Hides the form again
        statusEl.innerText = "Attendance recorded! Thank you.";
    })
    .catch(error => {
        console.error('Network Error:', error);
        alert("Network error. Please try again.");
        submitBtn.value = "Submit Attendance";
        submitBtn.disabled = false;
    });
});