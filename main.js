document.addEventListener('DOMContentLoaded', function () {
    // Automatically redirect to Google Form on page load after a delay
    setTimeout(function() {
        window.location.href = "https://forms.gle/B5n5JHsK4gBhB4mt5"; // Replace with your actual Google Form link
    }, 3000); // Redirect after 3 seconds (you can change this delay)

    // Create and display a search bar on the page
    const searchContainer = document.createElement('div');
    searchContainer.style.margin = '20px';
    
    const searchLabel = document.createElement('label');
    searchLabel.setAttribute('for', 'site-search');
    searchLabel.innerText = 'Search our site: ';
    
    const searchInput = document.createElement('input');
    searchInput.setAttribute('type', 'search');
    searchInput.setAttribute('id', 'site-search');
    searchInput.setAttribute('name', 'q');
    searchInput.setAttribute('placeholder', 'Search...');
    searchInput.style.padding = '10px';
    searchInput.style.fontSize = '16px';
    searchInput.style.width = '300px';
    
    const searchButton = document.createElement('button');
    searchButton.innerText = 'Search';
    searchButton.style.padding = '10px 20px';
    searchButton.style.marginLeft = '10px';
    searchButton.style.fontSize = '16px';

    // Append elements to the search container
    searchContainer.appendChild(searchLabel);
    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(searchButton);
    
    // Append the search container to the body (or to a specific element on the page)
    document.body.appendChild(searchContainer);
    
    // Handle search functionality
    searchButton.addEventListener('click', function () {
        const query = searchInput.value;
        if (query) {
            // Redirect to search results page with the query as a parameter
            window.location.href = /search-results?q=${encodeURIComponent(query)};
        } else {
            alert('Please enter a search term.');
        }
    });

    // Optionally: Allow search to work when pressing 'Enter'
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const query = searchInput.value;
            if (query) {
                window.location.href = /search-results?q=${encodeURIComponent(query)};
            } else {
                alert('Please enter a search term.');
            }
        }
    });
});
