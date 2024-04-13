// filters.js

// Function to filter activities based on category and location
function applyFilters() {
    const category = document.getElementById('category').value;
    const location = document.getElementById('location').value;

    // You can perform filtering based on category and location here
    // For demonstration purposes, let's just log the selected values
    console.log('Category:', category);
    console.log('Location:', location);

    // You can then fetch activities based on the selected filters and display them
}

// Event listener for the "Apply Filters" button
document.getElementById('applyFilters').addEventListener('click', applyFilters);
