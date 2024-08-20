// q3.js

// Define generateUserId function
function generateUserId() {
    return 'user_' + Date.now(); // Using timestamp for simplicity
}

// Existing code
document.addEventListener("DOMContentLoaded", () => {
    // Display results
    const results = JSON.parse(sessionStorage.getItem('results')) || {};

    console.log('Stored Results:', results); // Log stored results

    const recommendations = {
        'Normal': 'You are doing well. Keep up the good work and maintain a balanced lifestyle.',
        'Mild': 'You might want to take some time for yourself and try relaxation techniques.',
        'Moderate': 'Consider talking to a mental health professional and practice stress management.',
        'Severe': 'Seek professional help immediately. It’s important to address these issues with a specialist.',
        'Extremely Severe': 'Professional help is crucial. Please seek support from a mental health professional urgently.'
    };

    const resultContainer = document.getElementById('result-container');

    Object.keys(results).forEach(category => {
        const severity = results[category];

        console.log(`${category}: ${severity}`); // Log category and severity

        const resultBox = document.createElement('div');
        resultBox.className = 'result-box';
        resultBox.innerHTML = `
            <h3>${category}</h3>
            <div class="level">${severity}</div>
            <div class="recommendation">${recommendations[severity]}</div>
        `;

        resultContainer.appendChild(resultBox);
    });

    // Add event listener to the "Start Again" button
    const startAgainBtn = document.getElementById('start-again-btn');
    if (startAgainBtn) {
        startAgainBtn.addEventListener('click', () => {
            // Generate a new user ID
            const newUserId = generateUserId();
            sessionStorage.setItem('userId', newUserId);
            
            // Clear sessionStorage to reset stored data
            sessionStorage.removeItem('results');
            sessionStorage.removeItem('selectedAnswers');

            // Redirect to the questionnaire page
            window.location.href = 'q1.html'; // Change this to the actual path of your questionnaire page
        });
    }
});

function getSeverity(category, score) {
    const ranges = DASS_severity_ratings[category];
    if (score < ranges[0][1]) return DASS_severity[category][0];
    if (score < ranges[1][1]) return DASS_severity[category][1];
    if (score < ranges[2][1]) return DASS_severity[category][2];
    if (score < ranges[3][1]) return DASS_severity[category][3];
    return DASS_severity[category][4];
}
