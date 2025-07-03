// Global variables
let photos = [];
let currentPhotoId = null;

// DOM elements
const photosGrid = document.getElementById('photosGrid');
const userPhotosGrid = document.getElementById('userPhotosGrid');
const uploadForm = document.getElementById('uploadForm');
const photoInput = document.getElementById('photoInput');
const previewContainer = document.getElementById('previewContainer');
const previewImage = document.getElementById('previewImage');
const photoModal = document.getElementById('photoModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalLikeBtn = document.getElementById('modalLikeBtn');
const modalLikeIcon = document.getElementById('modalLikeIcon');
const modalLikeCount = document.getElementById('modalLikeCount');
const commentsList = document.getElementById('commentsList');
const commentForm = document.getElementById('commentForm');
const commentInput = document.getElementById('commentInput');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadPhotos();
    setupEventListeners();
    updateStats();
});

// Load photos from localStorage
function loadPhotos() {
    const savedPhotos = localStorage.getItem('photoSharePhotos');
    if (savedPhotos) {
        photos = JSON.parse(savedPhotos);
    } else {
        // Add some sample photos if no photos exist
        photos = [
            {
                id: 1,
                title: 'Beautiful Sunset',
                description: 'A stunning sunset over the mountains',
                imageUrl: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=800',
                likes: 15,
                comments: [
                    { text: 'Amazing shot!', timestamp: Date.now() - 86400000 },
                    { text: 'Love the colors!', timestamp: Date.now() - 43200000 }
                ],
                timestamp: Date.now() - 172800000
            },
            {
                id: 2,
                title: 'City Lights',
                description: 'The city comes alive at night',
                imageUrl: 'https://images.pexels.com/photos/2476632/pexels-photo-2476632.jpeg?auto=compress&cs=tinysrgb&w=800',
                likes: 23,
                comments: [
                    { text: 'Beautiful cityscape!', timestamp: Date.now() - 129600000 }
                ],
                timestamp: Date.now() - 259200000
            },
            {
                id: 3,
                title: 'Nature Walk',
                description: 'Peaceful morning in the forest',
                imageUrl: 'https://images.pexels.com/photos/1559117/pexels-photo-1559117.jpeg?auto=compress&cs=tinysrgb&w=800',
                likes: 8,
                comments: [],
                timestamp: Date.now() - 345600000
            }
        ];
        savePhotos();
    }
    renderPhotos();
}

// Save photos to localStorage
function savePhotos() {
    localStorage.setItem('photoSharePhotos', JSON.stringify(photos));
}

// Render photos in the grid
function renderPhotos() {
    photosGrid.innerHTML = '';
    userPhotosGrid.innerHTML = '';
    
    photos.forEach(photo => {
        const photoCard = createPhotoCard(photo);
        photosGrid.appendChild(photoCard);
        userPhotosGrid.appendChild(photoCard.cloneNode(true));
    });
    
    // Re-attach event listeners to cloned cards
    attachPhotoEventListeners();
}

// Create photo card HTML
function createPhotoCard(photo) {
    const card = document.createElement('div');
    card.className = 'photo-card';
    card.dataset.photoId = photo.id;
    
    const formattedDate = new Date(photo.timestamp).toLocaleDateString();
    
    card.innerHTML = `
        <img src="${photo.imageUrl}" alt="${photo.title}">
        <div class="photo-info">
            <h3>${photo.title}</h3>
            <p>${photo.description}</p>
            <div class="photo-actions">
                <button class="like-btn" data-photo-id="${photo.id}">
                    <span>❤️</span>
                    <span>${photo.likes}</span>
                </button>
                <span class="photo-date">${formattedDate}</span>
            </div>
        </div>
    `;
    
    return card;
}

// Attach event listeners to photo cards
function attachPhotoEventListeners() {
    document.querySelectorAll('.photo-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('like-btn') && !e.target.parentElement.classList.contains('like-btn')) {
                const photoId = parseInt(this.dataset.photoId);
                openPhotoModal(photoId);
            }
        });
    });
    
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const photoId = parseInt(this.dataset.photoId);
            toggleLike(photoId);
        });
    });
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            showSection(targetId);
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // File input
    photoInput.addEventListener('change', handleFileSelect);
    
    // Upload form
    uploadForm.addEventListener('submit', handleUpload);
    
    // Modal
    document.querySelector('.close').addEventListener('click', closePhotoModal);
    window.addEventListener('click', function(e) {
        if (e.target === photoModal) {
            closePhotoModal();
        }
    });
    
    // Modal like button
    modalLikeBtn.addEventListener('click', function() {
        if (currentPhotoId) {
            toggleLike(currentPhotoId);
            updateModalLikeButton();
        }
    });
    
    // Comment form
    commentForm.addEventListener('submit', handleCommentSubmit);
}

// Show specific section
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

// Handle file selection
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            previewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

// Handle photo upload
function handleUpload(e) {
    e.preventDefault();
    
    const file = photoInput.files[0];
    const title = document.getElementById('photoTitle').value;
    const description = document.getElementById('photoDescription').value;
    
    if (!file || !title) {
        alert('Please select a photo and enter a title');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const newPhoto = {
            id: Date.now(),
            title: title,
            description: description,
            imageUrl: e.target.result,
            likes: 0,
            comments: [],
            timestamp: Date.now()
        };
        
        photos.unshift(newPhoto);
        savePhotos();
        renderPhotos();
        updateStats();
        
        // Reset form
        uploadForm.reset();
        previewContainer.style.display = 'none';
        
        // Show success message
        alert('Photo uploaded successfully!');
        
        // Navigate to home
        showSection('home');
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelector('.nav-link[href="#home"]').classList.add('active');
    };
    reader.readAsDataURL(file);
}

// Toggle like on photo
function toggleLike(photoId) {
    const photo = photos.find(p => p.id === photoId);
    if (photo) {
        photo.likes++;
        savePhotos();
        renderPhotos();
        updateStats();
    }
}

// Open photo modal
function openPhotoModal(photoId) {
    currentPhotoId = photoId;
    const photo = photos.find(p => p.id === photoId);
    
    if (photo) {
        modalImage.src = photo.imageUrl;
        modalTitle.textContent = photo.title;
        modalDescription.textContent = photo.description;
        
        updateModalLikeButton();
        renderComments(photo.comments);
        
        photoModal.style.display = 'block';
    }
}

// Close photo modal
function closePhotoModal() {
    photoModal.style.display = 'none';
    currentPhotoId = null;
}

// Update modal like button
function updateModalLikeButton() {
    const photo = photos.find(p => p.id === currentPhotoId);
    if (photo) {
        modalLikeCount.textContent = photo.likes;
    }
}

// Render comments
function renderComments(comments) {
    commentsList.innerHTML = '';
    
    comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';
        commentDiv.innerHTML = `
            <p>${comment.text}</p>
            <small>${new Date(comment.timestamp).toLocaleString()}</small>
        `;
        commentsList.appendChild(commentDiv);
    });
}

// Handle comment submission
function handleCommentSubmit(e) {
    e.preventDefault();
    
    const commentText = commentInput.value.trim();
    if (!commentText || !currentPhotoId) return;
    
    const photo = photos.find(p => p.id === currentPhotoId);
    if (photo) {
        const newComment = {
            text: commentText,
            timestamp: Date.now()
        };
        
        photo.comments.push(newComment);
        savePhotos();
        renderComments(photo.comments);
        
        commentInput.value = '';
    }
}

// Update profile stats
function updateStats() {
    const totalPhotos = photos.length;
    const totalLikes = photos.reduce((sum, photo) => sum + photo.likes, 0);
    
    document.getElementById('totalPhotos').textContent = totalPhotos;
    document.getElementById('totalLikes').textContent = totalLikes;
}