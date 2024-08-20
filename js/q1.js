// Function to generate a unique user ID
function generateUserId() {
    return 'user_' + Date.now(); // Using timestamp for simplicity
}

// Function to save form data to sessionStorage
function saveFormData() {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        console.log('No user ID found in sessionStorage.');
        return;
    }

    const formElements = document.querySelectorAll('#userForm input, #userForm select');
    formElements.forEach(element => {
        sessionStorage.setItem(`${userId}_${element.id}`, element.value);
        console.log(`Saved ${element.id} with value ${element.value} to sessionStorage`);
    });
}

// Function to load form data from sessionStorage
function loadFormData() {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        console.log('No user ID found in sessionStorage.');
        return;
    }

    const formElements = document.querySelectorAll('#userForm input, #userForm select');
    formElements.forEach(element => {
        const savedValue = sessionStorage.getItem(`${userId}_${element.id}`);
        if (savedValue) {
            element.value = savedValue;
            console.log(`Loaded ${element.id} with value ${savedValue} from sessionStorage`);
        }
    });
}

// Set up user ID on page load if not already set
window.addEventListener('load', () => {
    let userId = sessionStorage.getItem('userId');
    if (!userId) {
        userId = generateUserId();
        sessionStorage.setItem('userId', userId);
        console.log('Generated and saved new User ID:', userId);
    } else {
        console.log('Existing User ID:', userId);
    }
    document.getElementById('userId').value = userId;
    loadFormData();
});

// Add event listener to save data before leaving the page
document.getElementById('userForm').addEventListener('input', saveFormData);

// Add event listener for the start button
document.getElementById('startButton').addEventListener('click', function() {
    // Add the loading class to show spinner
    this.classList.add('loading');
    console.log('Start button clicked, showing spinner.');

    // Redirect after a short delay to show the spinner
    setTimeout(() => {
        window.location.href = 'q2.html';
        console.log('Redirecting to q2.html');
    }, 1000); // Adjust delay as needed
});
