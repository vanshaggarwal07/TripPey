document.addEventListener('DOMContentLoaded', async function() {
    const axiosInstance = axios.create({
        baseURL: 'http://localhost:3000/api'
    });

    // Function to fetch data from the backend and populate sections
    async function fetchDataAndPopulateSections(endpoint, sectionId, listId) {
        try {
            const response = await axiosInstance.get(endpoint);
            const data = response.data;
            const section = document.getElementById(sectionId);
            const list = document.getElementById(listId);
            section.innerHTML = `<h2 class="section-title">${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}</h2>`;
            if (data.length === 0) {
                list.innerHTML = '<p>No items found.</p>';
            } else {
                list.innerHTML = ''; // Clear previous content
                data.forEach(item => {
                    const listItem = createListItem(item);
                    list.appendChild(listItem);
                });
            }
        } catch (error) {
            console.error(`Error fetching ${sectionId} data:`, error);
        }
    }

    // Function to create a list item for each data item
    function createListItem(item) {
        const listItem = document.createElement('div');
        listItem.classList.add('item');
        listItem.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <p>Location: ${item.location}</p>
            <p>Price: ${item.price}</p>
            <button class="bookBtn" data-id="${item._id}">Book Now</button>
        `;
        return listItem;
    }

    // Fetch and populate accommodations data
    await fetchDataAndPopulateSections('/accommodations', 'accommodations', 'accommodationsList');

    // Fetch and populate restaurants data
    await fetchDataAndPopulateSections('/restaurants', 'restaurants', 'restaurantsList');

    // Fetch and populate activities data
    await fetchDataAndPopulateSections('/activities', 'activities', 'activitiesList');

    // Simulate earning points on button click
    const earnPointsBtn = document.getElementById('earnPointsBtn');
    const rewardsBalance = document.getElementById('rewardsBalance');
    const exclusiveExperiences = document.getElementById('exclusiveExperiences');

    earnPointsBtn.addEventListener('click', async function () {
        try {
            const username = 'exampleUser'; // Replace 'exampleUser' with actual username
            const points = 10; // Points to earn
            // Simulate earning points (increment rewards balance)
            const currentBalance = parseInt(rewardsBalance.textContent);
            const newBalance = currentBalance + points; // Increment by 10 points
            rewardsBalance.textContent = newBalance;

            // Simulate unlocking exclusive experiences for certain points threshold
            if (newBalance >= 50) {
                exclusiveExperiences.innerHTML = '<p>Congratulations! You have unlocked an exclusive cultural experience.</p>';
            }

            // Simulate earning points by interacting with backend (optional)
            // await axiosInstance.post('/earn-points', { username, points });
        } catch (error) {
            console.error('Error earning points:', error);
        }
    });

    // Add event listener to book buttons (example: could link to external booking platforms)
    document.querySelectorAll('.bookBtn').forEach(btn => {
        btn.addEventListener('click', async function () {
            const accommodationId = btn.getAttribute('data-id'); // Get accommodation ID
            try {
                const response = await axiosInstance.post('/book-accommodation', { accommodationId });
                alert(response.data.message);
            } catch (error) {
                console.error('Error booking accommodation:', error);
            }
        });
    });

    // Login form submission
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        try {
            const response = await axiosInstance.post('/login', { username, password });
            alert(response.data.message);
            // Simulate setting user session (optional)
            // sessionStorage.setItem('user', JSON.stringify(response.data.user));
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please try again.');
        }
    });

    // Interactive features
    // Example: Change background color on header click
    const header = document.querySelector('.header');
    header.addEventListener('click', function() {
        const colors = ['#ff9999', '#99ff99', '#9999ff', '#ffff99'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        header.style.backgroundColor = randomColor;
    });

    // Example: Toggle visibility of footer on mouseover/mouseout
    const footer = document.querySelector('.footer');
    footer.addEventListener('mouseover', function() {
        footer.style.visibility = 'hidden';
    });
    footer.addEventListener('mouseout', function() {
        footer.style.visibility = 'visible';
    });
});
