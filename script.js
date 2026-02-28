
// ===================================
// 1. GPS CONFIGURATION
// ===================================
const CLASS_LAT = 7.800461; 
const CLASS_LON = 3.913026;
const ALLOWED_RADIUS = 500000; 

const statusEl = document.getElementById('status-message');
const formContainer = document.getElementById('google-form-container');

// ===================================
// 2. GPS LOGIC
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
        formContainer.style.display = "block"; 
    } else {
        showError(`Access Denied. You are ${Math.round(distance)}m away. You must be within ${ALLOWED_RADIUS}m.`);
        formContainer.style.display = "none";
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

// Haversine Formula for Distance
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
// 3. GOOGLE SHEETS SUBMIT LOGIC
// ===================================
const form = document.getElementById('attendance-form');
const submitBtn = document.getElementById('submit-btn');

// WE WILL PUT YOUR GOOGLE SCRIPT URL HERE LATER
const scriptURL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';

form.addEventListener('submit', e => {
  e.preventDefault(); // Stops the page from refreshing
  submitBtn.value = "Submitting...";
  submitBtn.disabled = true;

  fetch(scriptURL, { method: 'POST', body: new FormData(form)})
    .then(response => {
      alert("Attendance Submitted Successfully!");
      form.reset(); // Clears the form
      submitBtn.value = "Submit Attendance";
      submitBtn.disabled = false;
      formContainer.style.display = "none"; // Hide form again after submit
      statusEl.innerText = "Attendance recorded!";
    })
    .catch(error => {
      console.error('Error!', error.message);
      alert("There was an error submitting. Please try again.");
      submitBtn.value = "Submit Attendance";
      submitBtn.disabled = false;
    });
});
