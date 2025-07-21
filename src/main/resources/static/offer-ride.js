
document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    dateInput.value = today;
});


document.getElementById('offerRideForm').addEventListener('submit', function(e) {
    e.preventDefault();

    if (validateForm()) {
        submitRide();
    }
});

function validateForm() {
    const form = document.getElementById('offerRideForm');
    const formData = new FormData(form);
    const errors = [];


    const requiredFields = ['from', 'to', 'date', 'time', 'seats', 'price', 'car'];

    requiredFields.forEach(field => {
        const value = formData.get(field);
        if (!value || value.trim() === '') {
            errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        }
    });


    const selectedDate = new Date(formData.get('date'));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        errors.push('Date cannot be in the past');
    }


    const price = parseFloat(formData.get('price'));
    if (isNaN(price) || price < 0) {
        errors.push('Price must be a valid number');
    }


    const from = formData.get('from').trim().toLowerCase();
    const to = formData.get('to').trim().toLowerCase();

    if (from === to) {
        errors.push('Starting location and destination must be different');
    }

    if (errors.length > 0) {
        showErrors(errors);
        return false;
    }

    return true;
}

function showErrors(errors) {

    const existingErrors = document.querySelectorAll('.error-message');
    existingErrors.forEach(error => error.remove());

    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-message';
    errorContainer.style.cssText = `
        background: #fee;
        border: 1px solid #fcc;
        color: #c66;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 20px;
    `;

    const errorList = document.createElement('ul');
    errorList.style.cssText = 'margin: 0; padding-left: 20px;';

    errors.forEach(error => {
        const errorItem = document.createElement('li');
        errorItem.textContent = error;
        errorList.appendChild(errorItem);
    });

    errorContainer.appendChild(errorList);


    const form = document.getElementById('offerRideForm');
    form.insertBefore(errorContainer, form.firstChild);


    errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function submitRide() {

    const submitBtn = document.querySelector('.btn-primary');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Posting Ride...';
    submitBtn.disabled = true;


    setTimeout(() => {

        const formData = collectFormData();


        storeRideData(formData);


        showSuccessMessage();


        document.getElementById('offerRideForm').reset();


        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function collectFormData() {
    const form = document.getElementById('offerRideForm');
    const formData = new FormData(form);


    const preferences = [];
    const preferenceInputs = document.querySelectorAll('input[name="preferences"]:checked');
    preferenceInputs.forEach(input => {
        preferences.push(input.value);
    });

    return {
        from: formData.get('from'),
        to: formData.get('to'),
        date: formData.get('date'),
        time: formData.get('time'),
        seats: parseInt(formData.get('seats')),
        price: parseFloat(formData.get('price')),
        car: formData.get('car'),
        notes: formData.get('notes'),
        preferences: preferences,
        timestamp: new Date().toISOString(),
        id: generateRideId()
    };
}

function generateRideId() {
    return 'ride_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function storeRideData(rideData) {

    console.log('Ride data:', rideData);


    if (!window.rideDatabase) {
        window.rideDatabase = [];
    }
    window.rideDatabase.push(rideData);

    console.log('Ride stored successfully!');
}

function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    successMessage.style.display = 'flex';


    setTimeout(() => {
        successMessage.style.opacity = '1';
    }, 10);
}


function setupAutoComplete() {
    const fromInput = document.getElementById('from');
    const toInput = document.getElementById('to');

    const commonLocations = [
        'Downtown',
        'Airport',
        'University',
        'Shopping Mall',
        'Train Station',
        'Business District',
        'City Center'
    ];

    [fromInput, toInput].forEach(input => {
        input.addEventListener('input', function(e) {
            const value = e.target.value.toLowerCase();

        });
    });
}


document.addEventListener('DOMContentLoaded', setupAutoComplete);


document.getElementById('price').addEventListener('input', function(e) {
    const price = parseFloat(e.target.value);
    const seats = parseInt(document.getElementById('seats').value);

    if (price && seats) {
        const totalEarnings = price * seats;


        let earningsDisplay = document.getElementById('earningsDisplay');
        if (!earningsDisplay) {
            earningsDisplay = document.createElement('div');
            earningsDisplay.id = 'earningsDisplay';
            earningsDisplay.style.cssText = `
                margin-top: 8px;
                font-size: 14px;
                color: #28a745;
                font-weight: 600;
            `;
            e.target.parentNode.appendChild(earningsDisplay);
        }

        earningsDisplay.textContent = `Total potential earnings: $${totalEarnings.toFixed(2)}`;
    }
});


document.getElementById('car').addEventListener('blur', function(e) {
    // Auto-format car details
    let value = e.target.value.trim();
    if (value && !value.includes(',')) {

        e.target.placeholder = 'e.g., Honda Civic, Blue, ABC-123';
    }
});


document.getElementById('notes').addEventListener('input', function(e) {
    const maxLength = 500;
    const currentLength = e.target.value.length;

    let counter = document.getElementById('notesCounter');
    if (!counter) {
        counter = document.createElement('div');
        counter.id = 'notesCounter';
        counter.style.cssText = `
            font-size: 12px;
            color: #666;
            text-align: right;
            margin-top: 5px;
        `;
        e.target.parentNode.appendChild(counter);
    }

    counter.textContent = `${currentLength}/500 characters`;

    if (currentLength > maxLength) {
        counter.style.color = '#dc3545';
        e.target.value = e.target.value.substring(0, maxLength);
        counter.textContent = `${maxLength}/500 characters (max reached)`;
    } else if (currentLength > maxLength * 0.8) {
        counter.style.color = '#ffc107';
    } else {
        counter.style.color = '#666';
    }
});