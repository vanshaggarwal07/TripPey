// rewards.js

// Function to earn points
function earnPoints() {
    // Example: Increment rewards balance by 10 points
    const rewardsBalance = document.getElementById('rewardsBalance');
    const currentPoints = parseInt(rewardsBalance.textContent);
    rewardsBalance.textContent = currentPoints + 10;
}

// Event listener for the "Earn Points" button
document.getElementById('earnPointsBtn').addEventListener('click', earnPoints);

// Function to fetch and display exclusive experiences
function fetchExclusiveExperiences() {
    // Example: Fetching exclusive experiences from a backend API
    // Replace this with actual logic to fetch exclusive experiences
    const exclusiveExperiencesList = document.getElementById('exclusiveExperiencesList');
    exclusiveExperiencesList.innerHTML = ''; // Clear previous results

    const exclusiveExperiences = [
        'Exclusive Cooking Class',
        'Private Guided Tour',
        'VIP Dining Experience',
        'Cultural Workshop'
    ];

    exclusiveExperiences.forEach(experience => {
        const listItem = document.createElement('li');
        listItem.textContent = experience;
        exclusiveExperiencesList.appendChild(listItem);
    });
}

// Call the function to fetch and display exclusive experiences when the page loads
fetchExclusiveExperiences();
