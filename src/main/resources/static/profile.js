let isEditMode = false;
let originalData = {};

document.addEventListener('DOMContentLoaded', function () {
    loadProfileFromStorage();
    loadProfileImage();
    storeOriginalData();
    document.getElementById('imageUpload').addEventListener('change', handleImageUpload);
    document.getElementById('phone').addEventListener('input', handlePhoneAutoFormat);
    addInputValidation();
});

function storeOriginalData() {
    originalData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        location: document.getElementById('location').value,
        carModel: document.getElementById('carModel').value,
        licensePlate: document.getElementById('licensePlate').value,
        carColor: document.getElementById('carColor').value,
        seats: document.getElementById('seats').value
    };
    localStorage.setItem('userProfile', JSON.stringify(originalData));
}

function loadProfileFromStorage() {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
        const data = JSON.parse(savedProfile);
        document.getElementById('name').value = data.name || '';
        document.getElementById('email').value = data.email || '';
        document.getElementById('phone').value = data.phone || '';
        document.getElementById('location').value = data.location || '';
        document.getElementById('carModel').value = data.carModel || '';
        document.getElementById('licensePlate').value = data.licensePlate || '';
        document.getElementById('carColor').value = data.carColor || '';
        document.getElementById('seats').value = data.seats || '';
    }
}

function loadProfileImage() {
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
        document.querySelector('.profile-image').src = savedImage;
    }
}

function toggleEdit() {
    isEditMode = !isEditMode;
    const editBtn = document.querySelector('.edit-btn');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const inputs = document.querySelectorAll('input:not([type="file"])');
    const select = document.getElementById('seats');

    if (isEditMode) {
        editBtn.textContent = 'Editing...';
        editBtn.disabled = true;
        saveBtn.style.display = 'inline-block';
        cancelBtn.style.display = 'inline-block';
        inputs.forEach(input => input.removeAttribute('readonly'));
        select.removeAttribute('disabled');
        document.body.classList.add('edit-mode');
        document.getElementById('name').focus();
    } else {
        editBtn.textContent = 'Edit Profile';
        editBtn.disabled = false;
        saveBtn.style.display = 'none';
        cancelBtn.style.display = 'none';
        inputs.forEach(input => input.setAttribute('readonly', 'readonly'));
        select.setAttribute('disabled', 'disabled');
        document.body.classList.remove('edit-mode');
    }
}

function saveProfile() {
    if (!validateForm()) return;

    const saveBtn = document.getElementById('saveBtn');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Saving...';
    saveBtn.disabled = true;

    setTimeout(() => {
        storeOriginalData();
        toggleEdit();
        saveBtn.textContent = originalText;
        saveBtn.disabled = false;
        showNotification('Profile updated successfully!', 'success');
    }, 1000);
}

function cancelEdit() {
    document.getElementById('name').value = originalData.name;
    document.getElementById('email').value = originalData.email;
    document.getElementById('phone').value = originalData.phone;
    document.getElementById('location').value = originalData.location;
    document.getElementById('carModel').value = originalData.carModel;
    document.getElementById('licensePlate').value = originalData.licensePlate;
    document.getElementById('carColor').value = originalData.carColor;
    document.getElementById('seats').value = originalData.seats;

    toggleEdit();
}

function changePhoto() {
    document.getElementById('imageUpload').click();
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        if (!file.type.startsWith('image/')) {
            showNotification('Please select a valid image file.', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showNotification('Image size must be less than 5MB.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            document.querySelector('.profile-image').src = e.target.result;
            localStorage.setItem('profileImage', e.target.result);
            showNotification('Profile picture updated!', 'success');
        };
        reader.readAsDataURL(file);
    }
}

function validateForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const location = document.getElementById('location').value.trim();

    if (name.length < 2) {
        showNotification('Name must be at least 2 characters long.', 'error');
        document.getElementById('name').focus();
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address.', 'error');
        document.getElementById('email').focus();
        return false;
    }

    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(phone)) {
        showNotification('Please enter a valid phone number.', 'error');
        document.getElementById('phone').focus();
        return false;
    }

    if (location.length < 2) {
        showNotification('Location must be at least 2 characters long.', 'error');
        document.getElementById('location').focus();
        return false;
    }

    return true;
}

function addInputValidation() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('blur', function () {
            if (isEditMode) validateField(this);
        });
        input.addEventListener('input', function () {
            this.style.borderColor = '';
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;

    switch (field.id) {
        case 'name':
            isValid = value.length >= 2;
            break;
        case 'email':
            isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            break;
        case 'phone':
            isValid = /^\+?[\d\s\-\(\)]+$/.test(value);
            break;
        case 'location':
            isValid = value.length >= 2;
            break;
    }

    field.style.borderColor = isValid ? '#27ae60' : '#e74c3c';
}

function showNotification(message, type) {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) existingNotification.remove();

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        ${type === 'success' ? 'background: #27ae60;' : 'background: #e74c3c;'}
    `;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('userProfile');
        localStorage.removeItem('profileImage');
        sessionStorage.clear();
        showNotification('Logging out...', 'success');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }
}

function smoothScroll(target) {
    document.querySelector(target).scrollIntoView({ behavior: 'smooth' });
}

window.addEventListener('beforeunload', function (e) {
    if (isEditMode) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
    }
});

function handlePhoneAutoFormat(e) {
    if (isEditMode) {
        const formatted = formatPhoneNumber(e.target.value);
        if (formatted !== e.target.value) {
            e.target.value = formatted;
        }
    }
}

function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);
    return match ? `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}` : phone;
}
