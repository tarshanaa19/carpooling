
let ridesData = [
    {
        id: 1,
        from: "Thekkady",
        to: "Airport",
        date: "2025-07-6",
        time: "08:30",
        status: "completed",
        passengers: 3,
        earnings: 452.00,
        distance: "25 km",
        duration: "35 min",
        note: "Great passengers, smooth ride"
    },
    {
        id: 2,
        from: "Mall",
        to: "University",
        date: "2025-07-5",
        time: "14:15",
        status: "completed",
        passengers: 2,
        earnings: 218.50,
        distance: "12 km",
        duration: "20 min",
        note: ""
    },
    {
        id: 3,
        from: "Home",
        to: "Tidal Park",
        date: "2024-07-18",
        time: "07:45",
        status: "cancelled",
        passengers: 1,
        earnings: 0.00,
        distance: "15 km",
        duration: "25 min",
        note: "Passenger cancelled last minute"
    },
    {
        id: 4,
        from: "Train Station",
        to: "City Center",
        date: "2024-07-22",
        time: "16:30",
        status: "upcoming",
        passengers: 4,
        earnings: 335.00,
        distance: "18 km",
        duration: "30 min",
        note: ""
    },
    {
        id: 5,
        from: "Beach",
        to: "Shopping District",
        date: "2024-07-21",
        time: "19:00",
        status: "in-progress",
        passengers: 2,
        earnings: 280.00,
        distance: "20 km",
        duration: "40 min",
        note: ""
    }
];

let currentRideForNote = null;
let filteredRides = [...ridesData];
let isDriverMode = true;


const driverModeCheckbox = document.getElementById('driverMode');
const earningsSection = document.getElementById('earningsSection');
const dateFromInput = document.getElementById('dateFrom');
const dateToInput = document.getElementById('dateTo');
const statusFilter = document.getElementById('statusFilter');
const applyFiltersBtn = document.getElementById('applyFilters');
const clearFiltersBtn = document.getElementById('clearFilters');
const exportBtn = document.getElementById('exportBtn');
const ridesList = document.getElementById('ridesList');
const ridesCount = document.getElementById('ridesCount');
const noteModal = document.getElementById('noteModal');
const noteText = document.getElementById('noteText');
const saveNoteBtn = document.getElementById('saveNote');
const cancelNoteBtn = document.getElementById('cancelNote');
const closeModal = document.querySelector('.close');

document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    updateDriverMode();
    displayRides();
    updateEarnings();
    setDefaultDates();
});

function setupEventListeners() {
    driverModeCheckbox.addEventListener('change', updateDriverMode);
    applyFiltersBtn.addEventListener('click', applyFilters);
    clearFiltersBtn.addEventListener('click', clearFilters);
    exportBtn.addEventListener('click', exportToCSV);


    saveNoteBtn.addEventListener('click', saveNote);
    cancelNoteBtn.addEventListener('click', closeNoteModal);
    closeModal.addEventListener('click', closeNoteModal);

    noteModal.addEventListener('click', function(e) {
        if (e.target === noteModal) {
            closeNoteModal();
        }
    });
}

function updateDriverMode() {
    isDriverMode = driverModeCheckbox.checked;
    earningsSection.classList.toggle('hidden', !isDriverMode);
    displayRides();
    updateEarnings();
}

function setDefaultDates() {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    dateFromInput.value = thirtyDaysAgo.toISOString().split('T')[0];
    dateToInput.value = today.toISOString().split('T')[0];
}

function applyFilters() {
    const dateFrom = dateFromInput.value;
    const dateTo = dateToInput.value;
    const status = statusFilter.value;

    filteredRides = ridesData.filter(ride => {
        let matchesDate = (!dateFrom || ride.date >= dateFrom) && (!dateTo || ride.date <= dateTo);
        let matchesStatus = !status || ride.status === status;
        return matchesDate && matchesStatus;
    });

    displayRides();
    updateEarnings();
}

function clearFilters() {
    dateFromInput.value = '';
    dateToInput.value = '';
    statusFilter.value = '';
    filteredRides = [...ridesData];
    displayRides();
    updateEarnings();
}

function displayRides() {
    ridesList.innerHTML = '';
    ridesCount.textContent = `Total Rides: ${filteredRides.length}`;

    if (filteredRides.length === 0) {
        ridesList.innerHTML = `
            <div class="no-rides">
                <h3>No rides found</h3>
                <p>Try adjusting your filters or check back later.</p>
            </div>
        `;
        return;
    }

    const sortedRides = [...filteredRides].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedRides.forEach(ride => {
        const rideCard = createRideCard(ride);
        ridesList.appendChild(rideCard);
    });
}

function createRideCard(ride) {
    const card = document.createElement('div');
    card.className = 'ride-card';

    const formattedDate = new Date(ride.date).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    const earningsSectionHTML = isDriverMode ? `
        <div class="ride-earnings">
            <div class="amount">$${ride.earnings.toFixed(2)}</div>
            <small>Earnings</small>
        </div>
    ` : '';

    const noteSection = ride.note ? `
        <div class="ride-note">
            <strong>Note:</strong> ${ride.note}
        </div>
    ` : '';

    card.innerHTML = `
        <div class="ride-header">
            <div class="ride-route">${ride.from} → ${ride.to}</div>
            <span class="ride-status ${ride.status}">${ride.status}</span>
        </div>
        
        <div class="ride-details">
            <div class="ride-detail-item"><strong>Date:</strong> ${formattedDate}</div>
            <div class="ride-detail-item"><strong>Time:</strong> ${ride.time}</div>
            <div class="ride-detail-item"><strong>Passengers:</strong> ${ride.passengers}</div>
            <div class="ride-detail-item"><strong>Distance:</strong> ${ride.distance}</div>
            <div class="ride-detail-item"><strong>Duration:</strong> ${ride.duration}</div>
        </div>

        ${earningsSectionHTML}
        ${noteSection}

        <div class="ride-actions">
            <button class="btn btn-primary btn-small" onclick="openNoteModal(${ride.id})">
                ${ride.note ? 'Edit Note' : 'Add Note'}
            </button>
            <button class="btn btn-secondary btn-small" onclick="viewRideDetails(${ride.id})">
                View Details
            </button>
        </div>
    `;

    return card;
}

function updateEarnings() {
    if (!isDriverMode) return;

    const completedRides = filteredRides.filter(r => r.status === 'completed');
    const totalEarnings = completedRides.reduce((sum, r) => sum + r.earnings, 0);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const monthEarnings = completedRides
        .filter(r => new Date(r.date) >= thirtyDaysAgo)
        .reduce((sum, r) => sum + r.earnings, 0);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const weekEarnings = completedRides
        .filter(r => new Date(r.date) >= sevenDaysAgo)
        .reduce((sum, r) => sum + r.earnings, 0);

    const avgEarnings = completedRides.length ? totalEarnings / completedRides.length : 0;

    document.getElementById('totalEarnings').textContent = `$${totalEarnings.toFixed(2)}`;
    document.getElementById('monthEarnings').textContent = `$${monthEarnings.toFixed(2)}`;
    document.getElementById('weekEarnings').textContent = `$${weekEarnings.toFixed(2)}`;
    document.getElementById('avgEarnings').textContent = `$${avgEarnings.toFixed(2)}`;
}

function openNoteModal(rideId) {
    currentRideForNote = rideId;
    const ride = ridesData.find(r => r.id === rideId);
    noteText.value = ride ? ride.note : '';
    noteModal.style.display = 'block';
    noteText.focus();
}

function closeNoteModal() {
    noteModal.style.display = 'none';
    currentRideForNote = null;
    noteText.value = '';
}

function saveNote() {
    if (currentRideForNote) {
        const ride = ridesData.find(r => r.id === currentRideForNote);
        if (ride) {
            ride.note = noteText.value.trim();
            displayRides();
        }
    }
    closeNoteModal();
}

function viewRideDetails(rideId) {
    const ride = ridesData.find(r => r.id === rideId);
    if (ride) {
        alert(`Ride Details:\n\nRoute: ${ride.from} → ${ride.to}\nDate: ${ride.date}\nTime: ${ride.time}\nStatus: ${ride.status}\nPassengers: ${ride.passengers}\nDistance: ${ride.distance}\nDuration: ${ride.duration}\nEarnings: $${ride.earnings.toFixed(2)}\nNote: ${ride.note || 'No notes'}`);
    }
}

function exportToCSV() {
    const headers = ['ID', 'From', 'To', 'Date', 'Time', 'Status', 'Passengers', 'Distance', 'Duration', 'Earnings', 'Note'];
    let csv = headers.join(',') + '\n';

    filteredRides.forEach(ride => {
        const row = [
            ride.id,
            `"${ride.from}"`,
            `"${ride.to}"`,
            ride.date,
            ride.time,
            ride.status,
            ride.passengers,
            `"${ride.distance}"`,
            `"${ride.duration}"`,
            ride.earnings.toFixed(2),
            `"${ride.note || ''}"`
        ];
        csv += row.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my-rides-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}


function addSampleRide() {
    const sampleRides = [
        {
            from: "Library",
            to: "Stadium",
            passengers: 3,
            earnings: 30.00,
            distance: "22 km",
            duration: "28 min"
        },
        {
            from: "Hospital",
            to: "Park",
            passengers: 1,
            earnings: 15.00,
            distance: "8 km",
            duration: "15 min"
        }
    ];

    const sample = sampleRides[Math.floor(Math.random() * sampleRides.length)];
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const newRide = {
        id: ridesData.length + 1,
        ...sample,
        date: now.toISOString().split('T')[0],
        time: `${hours}:${minutes}`,
        status: "completed",
        note: ""
    };

    ridesData.push(newRide);
    applyFilters();
}


