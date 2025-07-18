document.addEventListener('DOMContentLoaded', function () {
    initializeDashboard();
    setupEventListeners();
    loadUserData();
    loadRides();
});

function initializeDashboard() {
    console.log('Dashboard initialized');
    animateStats();
    updateCurrentTime();
}

function setupEventListeners() {
    const findRideBtn = document.getElementById('findRideBtn');
    const offerRideBtn = document.getElementById('offerRideBtn');

    if (findRideBtn) findRideBtn.addEventListener('click', handleFindRide);
    if (offerRideBtn) offerRideBtn.addEventListener('click', handleOfferRide);

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.addEventListener('click', handleNavigation));

    document.getElementById('logoutButton')?.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });
}

function handleFindRide() {
    const btn = document.getElementById('findRideBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="btn-icon">⏳</span>Searching...';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        showNotification('Redirecting to find rides...', 'info');
        window.location.href = 'find-ride.html'; // ✅ Navigate
    }, 1000);
}

function handleOfferRide() {
    const btn = document.getElementById('offerRideBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="btn-icon">⏳</span>Creating...';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        showNotification('Redirecting to offer a ride...', 'success');
        window.location.href = 'offer-ride.html'; // ✅ Navigate
    }, 1000);
}

function handleNavigation(e) {
    e.preventDefault();
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    e.target.classList.add('active');
    showNotification(`Navigating to ${e.target.textContent}...`, 'info');
}

function handleJoinRide(e) {
    e.preventDefault();
    const button = e.target;
    const rideCard = button.closest('.ride-card');
    const driverName = rideCard.querySelector('.driver-name')?.textContent || 'the driver';

    button.textContent = 'Joining...';
    button.disabled = true;

    setTimeout(() => {
        button.textContent = 'Joined!';
        button.style.background = '#2ecc71';
        rideCard.style.borderLeftColor = '#2ecc71';
        rideCard.style.background = '#e8f5e8';
        showNotification(`Successfully j
