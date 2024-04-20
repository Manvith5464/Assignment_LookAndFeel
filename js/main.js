let reviews = [];

// Load data from JSON file
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    // Handle the loaded data
    const places = data.Places;
    const reviews = data.Reviews;
    const placeTypes = data['Business Type'];

    // Render  places list on the reviews page
    const businessListContainer = document.getElementById('business-list');
    if (businessListContainer) {
      places.forEach(place => {
        const businessElement = document.createElement('div');
        businessElement.textContent = place.name;
        businessElement.addEventListener('click', () => {
          renderBusinessDetails(business);
          window.location.href = 'business-details.html';
        });
        businessListContainer.appendChild(businessElement);
      });
    }

 
   
    // Render place details on the place-details page
    const renderPlaceDetails = (place) => {
      const placeName = document.getElementById('place-name');
      const placeImage = document.getElementById('place-image');
      const placeAddress = document.getElementById('place-address');
      const placePhone = document.getElementById('place-phone');
      const placeWebsite = document.getElementById('place-website');
      const placeReviewsContainer = document.getElementById('place-reviews');

      if (placeName && placeImage && placeAddress && placePhone && placeWebsite && placeReviewsContainer) {
        placeName.textContent = place.name;
        placeImage.src = place.image; // Replace with your image file path
        placeAddress.textContent = `${place.address}, ${place.city}, ${place.state} ${place.zipcode}`;
        placePhone.textContent = place.phone;
        placeWebsite.href = place.website;

        // Clear existing reviews
        placeReviewsContainer.innerHTML = '';

        // Render reviews for the place
        const placeReviews = reviews.filter(review => review.placeId === place.business_id);
        placeReviews.forEach(review => {
          const reviewElement = document.createElement('div');
          reviewElement.classList.add('review');
          reviewElement.innerHTML = `
            <p>${review.rating} stars by ${review.reviewedBy}</p>
            <button class="edit-review-btn">Edit</button>
            <button class="delete-review-btn">Delete</button>
          `;
          placeReviewsContainer.appendChild(reviewElement);
        });

        // Add event listeners for CRUD operations
        addReviewEventListeners(place.business_id);
      }
    };

    // Check the current page URL and render the appropriate content
    const currentPage = window.location.href.split('/').pop();
    if (currentPage === 'place-details.html') {
      const urlParams = new URLSearchParams(window.location.search);
      const placeId = urlParams.get('id');
      const place = places.find(p => p.business_id === placeId);
      if (place) {
        renderPlaceDetails(place);
      }
    }
  })
  .catch(error => console.error('Error loading data:', error));

// Add Review Modal functionality
const modal = document.getElementById('add-review-modal');
const addReviewBtn = document.getElementById('add-review-btn');
const closeModal = document.getElementsByClassName('close')[0];
const addReviewForm = document.getElementById('add-review-form');

addReviewBtn.onclick = () => {
  modal.style.display = 'block';
};

closeModal.onclick = () => {
  modal.style.display = 'none';
};

window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};

addReviewForm.onsubmit = (event) => {
  event.preventDefault();
  const rating = document.getElementById('rating').value;
  const reviewedBy = document.getElementById('reviewed-by').value;

  // Get the place ID from the URL or other means
  const urlParams = new URLSearchParams(window.location.search);
  const placeId = urlParams.get('id');

  const newReview = {
    placeId,
    rating,
    reviewedBy
  };

  reviews.push(newReview);
  renderPlaceDetails(places.find(place => place.business_id === placeId));
  modal.style.display = 'none';
  addReviewForm.reset();
};

// Add event listeners for CRUD operations
const addReviewEventListeners = (placeId) => {
  const addReviewBtn = document.getElementById('add-review-btn');
  const placeReviewsContainer = document.getElementById('place-reviews');

  addReviewBtn.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  placeReviewsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('edit-review-btn')) {
      const reviewElement = event.target.parentElement;
      const review = reviews.find(
        (r) =>
          r.placeId === placeId &&
          r.rating === reviewElement.querySelector('p').textContent.split(' ')[0] &&
          r.reviewedBy === reviewElement.querySelector('p').textContent.split(' by ')[1]
      );

      if (review) {
        // Open an edit modal or form to edit the review
        console.log('Edit review:', review);
      }
    } else if (event.target.classList.contains('delete-review-btn')) {
      const reviewElement = event.target.parentElement;
      const review = reviews.find(
        (r) =>
          r.placeId === placeId &&
          r.rating === reviewElement.querySelector('p').textContent.split(' ')[0] &&
          r.reviewedBy === reviewElement.querySelector('p').textContent.split(' by ')[1]
      );

      if (review) {
        // Remove the review from the global variable
        reviews = reviews.filter((r) => r !== review);

        // Re-render the place details to update the UI
        renderPlaceDetails(places.find(place => place.business_id === placeId));
       }
    }
  });  
};
