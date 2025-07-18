
const sampleRides = [
    {
        id: 1,
        from: "Downtown",
        to: "Airport",
        date: "2025-07-18",
        time: "14:30",
        price: 450,
        driver: {
            name: "Rahul Kumar",
            avatar: "RK",
            rating: 4.8,
            reviews: 127
        },
        vehicle: {
            type: "Sedan",
            model: "Honda City",
            color: "White"
        },
        availableSeats: 3,
        preferences: ["non-smoking", "ac", "music"],
        distance: "25 km",
        duration: "45 min"
    },
    {
        id: 2,
        from: "Tech Park",
        to: "Mall Road",
        date: "2025-07-18",
        time: "18:00",
        price: 200,
        driver: {
            name: "Priya Sharma",
            avatar: "PS",
            rating: 4.9,
            reviews: 89
        },
        vehicle: {
            type: "Hatchback",
            model: "Maruti Swift",
            color: "Red"
        },
        availableSeats: 2,
        preferences: ["non-smoking", "ac"],
        distance: "12 km",
        duration: "25 min"
    },
    {
        id: 3,
        from: "City Center",
        to: "University",
        date: "2025-07-18",
        time: "09:15",
        price: 150,
        driver: {
            name: "Amit Patel",
            avatar: "AP",
            rating: 4.6,
            reviews: 203
        },
        vehicle: {
            type: "SUV",
            model: "Hyundai Creta",
            color: "Blue"
        },
        availableSeats: 4,
        preferences: ["non-smoking", "ac", "music"],
        distance: "18 km",
        duration: "35 min"
    },
    {
        id: 4,
        from: "Railway Station",
        to: "Business District",
        date: "2025-07-18",
        time: "07:45",
        price: 300,
        driver: {
            name: "Sneha Reddy",
            avatar: "SR",
            rating: 4.7,
            reviews: 156
        },
        vehicle: {
            type: "Sedan",
            model: "Toyota Camry",
            color: "Black"
        },
        availableSeats: 3,
        preferences: ["non-smoking", "ac"],
        distance: "22 km",
        duration: "40 min"
    },
    {
        id: 5,
        from: "Residential Area",
        to: "Shopping Complex",
        date: "2025-07-18",
        time: "16:20",
        price: 180,
        driver: {
            name: "Vikram Singh",
            avatar: "VS",
            rating: 4.5,
            reviews: 78
        },
        vehicle: {
            type: "Hatchback",
            model: "Tata Tiago",
            color: "Grey"
        },
        availableSeats: 2,
        preferences: ["music"],
        distance: "15 km",
        duration: "30 min"
    }
];


let currentRides = [];
let selectedRide = null;
let activeFilters = {
    priceRange: 500,
    vehicleTypes: ['sedan'],
    minRating: 4,
    preferences: []
};


const searchForm = document.getElementById('searchForm');
const filtersBtn = document.getElementById('filtersBtn');
const filtersSection = document.getElementById('filtersSection');
const resultsSection = document.getElementById('resultsSection');
const ridesList = document.getElementById('ridesList');
const sortBy = document.getElementById('sortBy');
const priceRange = document.getElementById('priceRange');
const priceValue = document.getElementById('priceValue');
const bookingModal = document.getElementById('bookingModal');
const rideSummary = document.getElementById('rideSummary');
const closeModal = document.getElementById('closeModal');
const cancelBooking = document.getElementById('cancelBooking');
const confirmBooking = document.getElementById('confirmBooking');


document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;

    // Set default time to current time + 1 hour
    const now = new Date();
    now.setHours(now.getHours() + 1);
    const timeString = now.toTimeString().slice(0, 5);
    document.getElementById('time').value = timeString;


    updatePriceDisplay();


    initializeRatingFilter();
}

function setupEventListeners() {

    searchForm.addEventListener('submit', handleSearch);


    filtersBtn.addEventListener('click', toggleFilters);


    priceRange.addEventListener('input', updatePriceDisplay);
    priceRange.addEventListener('change', applyFilters);


    document.querySelectorAll('input[type="checkbox"][value]').forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange);
    });


    document.querySelectorAll('.stars i').forEach(star => {
        star.addEventListener('click', handleRatingFilter);
    });


    sortBy.addEventListener('change', sortRides);


    closeModal.addEventListener('click', closeBookingModal);
    cancelBooking.addEventListener('click', closeBookingModal);
    confirmBooking.addEventListener('click', handleBookingConfirmation);


    bookingModal.addEventListener('click', function(e) {
        if (e.target === bookingModal) {
            closeBookingModal();
        }
    });
}

function handleSearch(e) {
    e.preventDefault();

    const formData = new FormData(searchForm);
    const searchParams = {
        from: document.getElementById('from').value,
        to: document.getElementById('to').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        passengers: document.getElementById('passengers').value
    };


    if (!searchParams.from || !searchParams.to || !searchParams.date || !searchParams.time) {
        alert('Please fill in all required fields');
        return;
    }


    showLoading();

    // Simulate API call delay
    setTimeout(() => {
        searchRides(searchParams);
    }, 1000);
}

function searchRides(params) {
    // Filter rides based on search parameters
    currentRides = sampleRides.filter(ride => {
        const matchesRoute = ride.from.toLowerCase().includes(params.from.toLowerCase()) ||
            ride.to.toLowerCase().includes(params.to.toLowerCase());
        const matchesDate = ride.date === params.date;
        const hasEnoughSeats = ride.availableSeats >= parseInt(params.passengers);

        return matchesRoute && matchesDate && hasEnoughSeats;
    });


    applyFilters();


    displayResults();
}

function applyFilters() {
    if (currentRides.length === 0) return;

    const filteredRides = currentRides.filter(ride => {

        if (ride.price > activeFilters.priceRange) return false;


        const vehicleTypes = getSelectedVehicleTypes();
        if (vehicleTypes.length > 0 && !vehicleTypes.includes(ride.vehicle.type.toLowerCase())) {
            return false;
        }


        if (ride.driver.rating < activeFilters.minRating) return false;


        const selectedPreferences = getSelectedPreferences();
        if (selectedPreferences.length > 0) {
            const hasAllPreferences = selectedPreferences.every(pref =>
                ride.preferences.includes(pref)
            );
            if (!hasAllPreferences) return false;
        }

        return true;
    });

    displayRides(filteredRides);
}

function getSelectedVehicleTypes() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"][value="sedan"], input[type="checkbox"][value="suv"], input[type="checkbox"][value="hatchback"]');
    return Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
}

function getSelectedPreferences() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"][value="non-smoking"], input[type="checkbox"][value="ac"], input[type="checkbox"][value="music"]');
    return Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
}

function displayResults() {
    resultsSection.classList.add('active');
    resultsSection.scrollIntoView({ behavior: 'smooth' });

    if (currentRides.length === 0) {
        showEmptyState();
    } else {
        displayRides(currentRides);
    }
}

function displayRides(rides) {
    if (rides.length === 0) {
        showEmptyState();
        return;
    }

    ridesList.innerHTML = rides.map(ride => createRideCard(ride)).join('');


    document.querySelectorAll('.book-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const rideId = parseInt(this.dataset.rideId);
            openBookingModal(rideId);
        });
    });
}

function createRideCard(ride) {
    const ratingStars = generateRatingStars(ride.driver.rating);
    const preferenceIcons = ride.preferences.map(pref => {
        const icons = {
            'non-smoking': 'fa-smoking-ban',
            'ac': 'fa-snowflake',
            'music': 'fa-music'
        };
        return `<i class="fas ${icons[pref]}" title="${pref}"></i>`;
    }).join(' ');

    return `
        <div class="ride-card">
            <div class="ride-header">
                <div class="ride-route">
                    <span class="location">${ride.from}</span>
                    <i class="fas fa-arrow-right route-arrow"></i>
                    <span class="location">${ride.to}</span>
                </div>
                <div class="ride-price">₹${ride.price}</div>
            </div>
            
            <div class="ride-details">
                <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    <span>${ride.time}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-route"></i>
                    <span>${ride.distance}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-hourglass-half"></i>
                    <span>${ride.duration}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-users"></i>
                    <span>${ride.availableSeats} seats available</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-car"></i>
                    <span>${ride.vehicle.color} ${ride.vehicle.model}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-cog"></i>
                    <span>${preferenceIcons}</span>
                </div>
            </div>
            
            <div class="driver-info">
                <div class="driver-details">
                    <div class="driver-avatar">${ride.driver.avatar}</div>
                    <div>
                        <div class="driver-name">${ride.driver.name}</div>
                        <div class="driver-rating">
                            <div class="rating-stars">${ratingStars}</div>
                            <span>${ride.driver.rating} (${ride.driver.reviews} reviews)</span>
                        </div>
                    </div>
                </div>
                <button class="book-btn" data-ride-id="${ride.id}">
                    <i class="fas fa-calendar-check"></i>
                    Book Now
                </button>
            </div>
        </div>
    `;
}

function generateRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }

    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }

    return stars;
}

function showLoading() {
    ridesList.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
        </div>
    `;
    resultsSection.classList.add('active');
}

function showEmptyState() {
    ridesList.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-car"></i>
            <h3>No rides found</h3>
            <p>Try adjusting your search criteria or filters</p>
        </div>
    `;
}

function toggleFilters() {
    filtersSection.classList.toggle('active');
    filtersBtn.classList.toggle('active');

    if (filtersSection.classList.contains('active')) {
        filtersSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function updatePriceDisplay() {
    const value = priceRange.value;
    priceValue.textContent = value;
    activeFilters.priceRange = parseInt(value);
}

function initializeRatingFilter() {
    const stars = document.querySelectorAll('.stars i');
    stars.forEach((star, index) => {
        star.addEventListener('mouseover', function() {
            highlightStars(index + 1);
        });

        star.addEventListener('mouseout', function() {
            highlightStars(activeFilters.minRating);
        });
    });
}

function handleRatingFilter(e) {
    const rating = parseInt(e.target.dataset.rating);
    activeFilters.minRating = rating;
    highlightStars(rating);
    applyFilters();
}

function highlightStars(rating) {
    const stars = document.querySelectorAll('.stars i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function handleFilterChange() {
    applyFilters();
}

function sortRides() {
    const sortValue = sortBy.value;
    const ridesContainer = ridesList;
    const rideCards = Array.from(ridesContainer.children);

    if (rideCards.length === 0 || rideCards[0].classList.contains('loading') || rideCards[0].classList.contains('empty-state')) {
        return;
    }


    const visibleRides = currentRides.slice();

    switch (sortValue) {
        case 'price':
            visibleRides.sort((a, b) => a.price - b.price);
            break;
        case 'rating':
            visibleRides.sort((a, b) => b.driver.rating - a.driver.rating);
            break;
        case 'time':
        default:
            visibleRides.sort((a, b) => a.time.localeCompare(b.time));
            break;
    }

    displayRides(visibleRides);
}

function openBookingModal(rideId) {
    selectedRide = currentRides.find(ride => ride.id === rideId);
    if (!selectedRide) return;


    rideSummary.innerHTML = `
        <h4>Ride Summary</h4>
        <div class="summary-item">
            <strong>Route:</strong> ${selectedRide.from} → ${selectedRide.to}
        </div>
        <div class="summary-item">
            <strong>Date & Time:</strong> ${selectedRide.date} at ${selectedRide.time}
        </div>
        <div class="summary-item">
            <strong>Driver:</strong> ${selectedRide.driver.name}
        </div>
        <div class="summary-item">
            <strong>Vehicle:</strong> ${selectedRide.vehicle.color} ${selectedRide.vehicle.model}
        </div>
        <div class="summary-item">
            <strong>Price:</strong> ₹${selectedRide.price}
        </div>
    `;


    document.getElementById('pickupPoint').value = '';
    document.getElementById('phoneNumber').value = '';
    document.getElementById('notes').value = '';


    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeBookingModal() {
    bookingModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    selectedRide = null;
}

function handleBookingConfirmation() {
    const pickupPoint = document.getElementById('pickupPoint').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const notes = document.getElementById('notes').value;

    if (!pickupPoint || !phoneNumber) {
        alert('Please fill in all required fields');
        return;
    }


    const bookingData = {
        rideId: selectedRide.id,
        pickupPoint,
        phoneNumber,
        notes,
        timestamp: new Date().toISOString()
    };


    showSuccessMessage('Booking confirmed! You will receive a confirmation shortly.');

    // Close modal
    closeBookingModal();


    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 2000);
}

function showSuccessMessage(message) {

    const successDiv = document.createElement('div');
    successDiv.className = 'success-message show';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        ${message}
    `;

    const main = document.querySelector('.main');
    main.insertBefore(successDiv, main.firstChild);


    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}


function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    return time.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}


function setupLocationAutocomplete() {
    const locations = [
        'Downtown', 'Airport', 'Tech Park', 'Mall Road', 'City Center',
        'University', 'Railway Station', 'Business District', 'Residential Area',
        'Shopping Complex', 'Medical District', 'Government Complex'
    ];

    const fromInput = document.getElementById('from');
    const toInput = document.getElementById('to');

    [fromInput, toInput].forEach(input => {
        input.addEventListener('input', function() {
            const value = this.value.toLowerCase();
            if (value.length > 1) {
                const suggestions = locations.filter(loc =>
                    loc.toLowerCase().includes(value)
                );

                console.log('Suggestions:', suggestions);
            }
        });
    });
}


setupLocationAutocomplete();