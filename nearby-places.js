// nearby-places.js

// Function to fetch nearby places using Google Places API
function fetchNearbyPlaces(location, searchQuery, cuisineFilter) {
    const request = {
        location: location,
        radius: '500',  // Radius in meters
        type: ['restaurant'] // Currently fetching restaurants only, you can adjust based on your needs
    };

    if (searchQuery) {
        request.keyword = searchQuery;
    }

    const service = new google.maps.places.PlacesService(document.createElement('div'));
    service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            // Filter places based on cuisine if filter is applied
            if (cuisineFilter) {
                results = results.filter(place => place.types.includes(cuisineFilter));
            }
            // Display nearby places
            displayNearbyPlaces(results, 'restaurants-list');
        }
    });
}

// Function to display nearby places
function displayNearbyPlaces(places, listId) {
    const placesList = document.getElementById(listId);
    placesList.innerHTML = ''; // Clear previous results

    places.forEach(place => {
        const name = place.name;
        const address = place.vicinity;
        const rating = place.rating || 'Not available';
        const listItem = document.createElement('div');
        listItem.classList.add('place-item');
        listItem.innerHTML = `
            <h4>${name}</h4>
            <p>Address: ${address}</p>
            <p>Rating: ${rating}</p>
        `;
        placesList.appendChild(listItem);
    });
}

// Get user's current location and fetch nearby places
navigator.geolocation.getCurrentPosition(position => {
    const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };
    // Initially fetch nearby places without filters
    fetchNearbyPlaces(userLocation);
}, error => {
    console.error('Error getting user location:', error);
});

// Function to apply search and filters
function applyFilters() {
    const searchQuery = document.getElementById('search').value.trim().toLowerCase();
    const cuisineFilter = document.getElementById('cuisine').value.toLowerCase();

    // Get user's current location
    navigator.geolocation.getCurrentPosition(position => {
        const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        // Fetch nearby places with applied filters
        fetchNearbyPlaces(userLocation, searchQuery, cuisineFilter);
    }, error => {
        console.error('Error getting user location:', error);
    });
}

// Event listener for the "Apply Filters" button
document.getElementById('applyFilters').addEventListener('click', applyFilters);
