// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('feedbackForm');
    const successMessage = document.getElementById('successMessage');


    form.addEventListener('submit', function(e) {
        e.preventDefault();


        const formData = new FormData(form);
        const feedbackData = {};


        for (let [key, value] of formData.entries()) {
            feedbackData[key] = value;
        }


        if (validateForm(feedbackData)) {

            submitFeedback(feedbackData);
        }
    });


    function validateForm(data) {
        const requiredFields = ['satisfaction', 'safety', 'frequency', 'improvements', 'recommend'];

        for (let field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                alert(`Please fill in the ${field} field.`);
                return false;
            }
        }


        if (data.improvements.length < 10) {
            alert('Please provide more detailed feedback in the improvements section (at least 10 characters).');
            return false;
        }

        return true;
    }


    function submitFeedback(data) {

        const submitBtn = document.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;


        setTimeout(function() {

            console.log('Feedback submitted:', data);

            form.style.display = 'none';
            successMessage.style.display = 'block';

            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            storeFeedback(data);

        }, 1500);
    }

    function storeFeedback(data) {

        data.timestamp = new Date().toISOString();


        console.log('Feedback stored:', data);


        if (!window.feedbackHistory) {
            window.feedbackHistory = [];
        }
        window.feedbackHistory.push(data);
    }


    const radioInputs = document.querySelectorAll('input[type="radio"]');
    radioInputs.forEach(function(radio) {
        radio.addEventListener('change', function() {

            const groupName = this.name;
            const groupLabels = document.querySelectorAll(`input[name="${groupName}"] + label`);
            groupLabels.forEach(function(label) {
                label.classList.remove('selected');
            });


            const currentLabel = this.nextElementSibling;
            if (currentLabel) {
                currentLabel.classList.add('selected');
            }
        });
    });

    const improvementsTextarea = document.getElementById('improvements');
    const charCounter = document.createElement('div');
    charCounter.className = 'char-counter';
    charCounter.style.cssText = 'text-align: right; font-size: 0.8rem; color: #666; margin-top: 5px;';
    improvementsTextarea.parentNode.appendChild(charCounter);

    improvementsTextarea.addEventListener('input', function() {
        const currentLength = this.value.length;
        const minLength = 10;
        const color = currentLength >= minLength ? '#28a745' : '#dc3545';
        charCounter.innerHTML = `<span style="color: ${color}">${currentLength} characters (minimum ${minLength})</span>`;
    });


    improvementsTextarea.dispatchEvent(new Event('input'));


    const formElements = document.querySelectorAll('select, textarea, button');
    formElements.forEach(function(element) {
        element.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
        });

        element.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
        });
    });
});