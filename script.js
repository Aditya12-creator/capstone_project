// Global variables
let photos = [];
let currentPhotoId = null;
let currentFilter = 'none';
let currentView = 'grid';
let currentTab = 'photos';

// DOM elements
const photosGrid = document.getElementById('photosGrid');
const userPhotosGrid = document.getElementById('userPhotosGrid');
const likedPhotosGrid = document.getElementById('likedPhotosGrid');
const trendingPhotos = document.getElementById('trendingPhotos');
const uploadForm = document.getElementById('uploadForm');
const photoInput = document.getElementById('photoInput');
const fileUploadArea = document.getElementById('fileUploadArea');
const previewSection = document.getElementById('previewSection');
const previewImage = document.getElementById('previewImage');
const photoModal = document.getElementById('photoModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalTags = document.getElementById('modalTags');
const modalLikeBtn = document.getElementById('modalLikeBtn');
const modalLikeIcon = document.getElementById('modalLikeIcon');
const modalLikeCount = document.getElementById('modalLikeCount');
const modalCommentCount = document.getElementById('modalCommentCount');
const commentsList = document.getElementById('commentsList');
const commentForm = document.getElementById('commentForm');
const commentInput = document.getElementById('commentInput');
const themeToggle = document.getElementById('themeToggle');
const toast = document.getElementById('toast');
const loadingSpinner = document.getElementById('loadingSpinner');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadPhotos();
    setupEventListeners();
    updateStats();
    initializeTheme();
    startFloatingAnimation();
}

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('pixelvibe-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('pixelvibe-theme', newTheme);
    updateThemeIcon(newTheme);
    
    showToast('Theme changed successfully!', 'success');
}

function updateThemeIcon(theme) {
    themeToggle.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Load photos from localStorage
function loadPhotos() {
    const savedPhotos = localStorage.getItem('pixelvibePhotos');
    if (savedPhotos) {
        photos = JSON.parse(savedPhotos);
    } else {
        // Add enhanced sample photos
        photos = [
            {
                id: 1,
                title: 'Golden Hour Magic',
                description: 'Captured this breathtaking sunset during my evening walk. The way the light danced through the clouds was absolutely mesmerizing.',
                imageUrl: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=800',
                category: 'nature',
                tags: ['sunset', 'golden hour', 'landscape', 'nature'],
                likes: 127,
                comments: [
                    { 
                        author: 'Sarah Chen', 
                        text: 'This is absolutely stunning! The colors are incredible.', 
                        timestamp: Date.now() - 86400000,
                        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50'
                    },
                    { 
                        author: 'Mike Rodriguez', 
                        text: 'Perfect timing! Nature photography at its finest.', 
                        timestamp: Date.now() - 43200000,
                        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50'
                    }
                ],
                timestamp: Date.now() - 172800000,
                filter: 'warm',
                views: 1543,
                author: 'Alex Johnson'
            },
            {
                id: 2,
                title: 'Urban Nights',
                description: 'The city never sleeps, and neither does its beauty. This shot captures the vibrant energy of downtown after midnight.',
                imageUrl: 'https://images.pexels.com/photos/2476632/pexels-photo-2476632.jpeg?auto=compress&cs=tinysrgb&w=800',
                category: 'city',
                tags: ['cityscape', 'night', 'urban', 'lights'],
                likes: 89,
                comments: [
                    { 
                        author: 'Emma Wilson', 
                        text: 'Love the neon reflections! Great composition.', 
                        timestamp: Date.now() - 129600000,
                        avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=50'
                    }
                ],
                timestamp: Date.now() - 259200000,
                filter: 'dramatic',
                views: 892,
                author: 'Alex Johnson'
            },
            {
                id: 3,
                title: 'Forest Serenity',
                description: 'Sometimes you need to disconnect from the digital world and reconnect with nature. This peaceful forest path reminded me of that.',
                imageUrl: 'https://images.pexels.com/photos/1559117/pexels-photo-1559117.jpeg?auto=compress&cs=tinysrgb&w=800',
                category: 'nature',
                tags: ['forest', 'path', 'peaceful', 'green'],
                likes: 156,
                comments: [],
                timestamp: Date.now() - 345600000,
                filter: 'cool',
                views: 2341,
                author: 'Alex Johnson'
            },
            {
                id: 4,
                title: 'Coffee & Dreams',
                description: 'My favorite corner café where ideas brew as strong as the coffee. Perfect spot for creative inspiration.',
                imageUrl: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800',
                category: 'art',
                tags: ['coffee', 'café', 'lifestyle', 'cozy'],
                likes: 73,
                comments: [
                    { 
                        author: 'David Kim', 
                        text: 'This makes me want to grab a coffee right now!', 
                        timestamp: Date.now() - 86400000,
                        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=50'
                    }
                ],
                timestamp: Date.now() - 432000000,
                filter: 'vintage',
                views: 654,
                author: 'Alex Johnson'
            },
            {
                id: 5,
                title: 'Ocean Waves',
                description: 'The rhythmic dance of waves against the shore. There\'s something therapeutic about watching the ocean.',
                imageUrl: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=800',
                category: 'nature',
                tags: ['ocean', 'waves', 'beach', 'blue'],
                likes: 201,
                comments: [
                    { 
                        author: 'Lisa Park', 
                        text: 'I can almost hear the waves! Beautiful capture.', 
                        timestamp: Date.now() - 172800000,
                        avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=50'
                    },
                    { 
                        author: 'Tom Anderson', 
                        text: 'This takes me back to my last vacation. Amazing!', 
                        timestamp: Date.now() - 86400000,
                        avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=50'
                    }
                ],
                timestamp: Date.now() - 518400000,
                filter: 'cool',
                views: 3210,
                author: 'Alex Johnson'
            }
        ];
        savePhotos();
    }
    renderPhotos();
    renderTrendingPhotos();
}

// Save photos to localStorage
function savePhotos() {
    localStorage.setItem('pixelvibePhotos', JSON.stringify(photos));
}

// Render photos in different grids
function renderPhotos() {
    renderPhotoGrid(photosGrid, photos);
    renderPhotoGrid(userPhotosGrid, photos);
    renderLikedPhotos();
}

function renderPhotoGrid(container, photoArray) {
    if (!container) return;
    
    container.innerHTML = '';
    container.className = `photos-grid ${currentView}`;
    
    photoArray.forEach(photo => {
        const photoCard = createPhotoCard(photo);
        container.appendChild(photoCard);
    });
    
    attachPhotoEventListeners();
}

function renderLikedPhotos() {
    if (!likedPhotosGrid) return;
    
    const likedPhotos = photos.filter(photo => photo.liked);
    renderPhotoGrid(likedPhotosGrid, likedPhotos);
}

function renderTrendingPhotos() {
    if (!trendingPhotos) return;
    
    const trending = [...photos]
        .sort((a, b) => (b.likes + b.views) - (a.likes + a.views))
        .slice(0, 6);
    
    renderPhotoGrid(trendingPhotos, trending);
}

// Create photo card HTML
function createPhotoCard(photo) {
    const card = document.createElement('div');
    card.className = 'photo-card';
    card.dataset.photoId = photo.id;
    
    const formattedDate = formatTimeAgo(photo.timestamp);
    const filterClass = photo.filter && photo.filter !== 'none' ? `filter-${photo.filter}` : '';
    
    card.innerHTML = `
        <img src="${photo.imageUrl}" alt="${photo.title}" class="${filterClass}">
        <div class="photo-overlay">
            <div class="overlay-content">
                <h3>${photo.title}</h3>
                <p>${photo.description}</p>
                <div class="overlay-stats">
                    <span><i class="fas fa-heart"></i> ${photo.likes}</span>
                    <span><i class="fas fa-comment"></i> ${photo.comments.length}</span>
                    <span><i class="fas fa-eye"></i> ${photo.views || 0}</span>
                </div>
            </div>
        </div>
        <div class="photo-info">
            <h3>${photo.title}</h3>
            <p>${truncateText(photo.description, 100)}</p>
            <div class="photo-tags">
                ${photo.tags ? photo.tags.slice(0, 3).map(tag => `<span class="tag">#${tag}</span>`).join('') : ''}
            </div>
            <div class="photo-actions">
                <button class="like-btn ${photo.liked ? 'liked' : ''}" data-photo-id="${photo.id}">
                    <i class="fas fa-heart"></i>
                    <span>${photo.likes}</span>
                </button>
                <span class="photo-date">${formattedDate}</span>
            </div>
        </div>
    `;
    
    return card;
}

// Utility functions
function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function formatTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
}

// Event listeners setup
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // View toggle
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', handleViewToggle);
    });
    
    // Filter tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', handleFilterTab);
    });
    
    // Profile tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', handleProfileTab);
    });
    
    // File upload
    fileUploadArea.addEventListener('click', () => photoInput.click());
    fileUploadArea.addEventListener('dragover', handleDragOver);
    fileUploadArea.addEventListener('drop', handleDrop);
    photoInput.addEventListener('change', handleFileSelect);
    
    // Image filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', handleFilterSelect);
    });
    
    // Upload form
    uploadForm.addEventListener('submit', handleUpload);
    
    // Modal events
    document.querySelector('.modal-close').addEventListener('click', closePhotoModal);
    document.querySelector('.modal-backdrop').addEventListener('click', closePhotoModal);
    modalLikeBtn.addEventListener('click', handleModalLike);
    commentForm.addEventListener('submit', handleCommentSubmit);
    
    // Download and share buttons
    document.getElementById('downloadBtn').addEventListener('click', handleDownload);
    document.getElementById('shareBtn').addEventListener('click', handleShare);
}

// Navigation handler
function handleNavigation(e) {
    e.preventDefault();
    const targetSection = this.dataset.section;
    showSection(targetSection);
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    this.classList.add('active');
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

// View toggle handler
function handleViewToggle(e) {
    currentView = this.dataset.view;
    document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
    renderPhotos();
}

// Filter tab handler
function handleFilterTab(e) {
    const filter = this.dataset.filter;
    document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
    this.classList.add('active');
    
    const filteredPhotos = filter === 'all' ? photos : photos.filter(photo => photo.category === filter);
    renderPhotoGrid(trendingPhotos, filteredPhotos);
}

// Profile tab handler
function handleProfileTab(e) {
    const tab = this.dataset.tab;
    currentTab = tab;
    
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
    
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    document.getElementById(`${tab}-tab`).classList.add('active');
}

// File handling
function handleDragOver(e) {
    e.preventDefault();
    this.classList.add('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelect({ target: { files } });
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            previewSection.classList.add('active');
            applyFilter(currentFilter);
        };
        reader.readAsDataURL(file);
    }
}

// Filter selection
function handleFilterSelect(e) {
    e.preventDefault();
    currentFilter = this.dataset.filter;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
    applyFilter(currentFilter);
}

function applyFilter(filter) {
    previewImage.className = `preview-image ${filter !== 'none' ? `filter-${filter}` : ''}`;
}

// Photo upload
function handleUpload(e) {
    e.preventDefault();
    
    const file = photoInput.files[0];
    const title = document.getElementById('photoTitle').value;
    const description = document.getElementById('photoDescription').value;
    const category = document.getElementById('photoCategory').value;
    const tags = document.getElementById('photoTags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    if (!file || !title || !category) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    showLoading(true);
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const newPhoto = {
            id: Date.now(),
            title: title,
            description: description,
            imageUrl: e.target.result,
            category: category,
            tags: tags,
            likes: 0,
            comments: [],
            timestamp: Date.now(),
            filter: currentFilter,
            views: 0,
            author: 'Alex Johnson'
        };
        
        photos.unshift(newPhoto);
        savePhotos();
        renderPhotos();
        renderTrendingPhotos();
        updateStats();
        
        // Reset form
        uploadForm.reset();
        previewSection.classList.remove('active');
        currentFilter = 'none';
        document.querySelector('.filter-btn[data-filter="none"]').classList.add('active');
        
        showLoading(false);
        showToast('Photo uploaded successfully!', 'success');
        
        // Navigate to home
        showSection('home');
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelector('.nav-link[data-section="home"]').classList.add('active');
    };
    reader.readAsDataURL(file);
}

// Photo interactions
function attachPhotoEventListeners() {
    document.querySelectorAll('.photo-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.like-btn')) {
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

function toggleLike(photoId) {
    const photo = photos.find(p => p.id === photoId);
    if (photo) {
        if (photo.liked) {
            photo.likes--;
            photo.liked = false;
        } else {
            photo.likes++;
            photo.liked = true;
        }
        savePhotos();
        renderPhotos();
        renderTrendingPhotos();
        updateStats();
        
        if (currentPhotoId === photoId) {
            updateModalLikeButton();
        }
    }
}

// Modal functionality
function openPhotoModal(photoId) {
    currentPhotoId = photoId;
    const photo = photos.find(p => p.id === photoId);
    
    if (photo) {
        // Increment view count
        photo.views = (photo.views || 0) + 1;
        savePhotos();
        
        const filterClass = photo.filter && photo.filter !== 'none' ? `filter-${photo.filter}` : '';
        modalImage.src = photo.imageUrl;
        modalImage.className = `modal-image ${filterClass}`;
        modalTitle.textContent = photo.title;
        modalDescription.textContent = photo.description;
        
        // Update tags
        modalTags.innerHTML = photo.tags ? 
            photo.tags.map(tag => `<span class="tag">#${tag}</span>`).join('') : '';
        
        // Update author and date
        document.getElementById('modalAuthor').textContent = photo.author || 'Alex Johnson';
        document.getElementById('modalDate').textContent = formatTimeAgo(photo.timestamp);
        
        updateModalLikeButton();
        updateModalCommentCount();
        renderComments(photo.comments);
        
        photoModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closePhotoModal() {
    photoModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    currentPhotoId = null;
}

function updateModalLikeButton() {
    const photo = photos.find(p => p.id === currentPhotoId);
    if (photo) {
        modalLikeCount.textContent = photo.likes;
        modalLikeIcon.className = photo.liked ? 'fas fa-heart' : 'far fa-heart';
        modalLikeBtn.classList.toggle('liked', photo.liked);
    }
}

function updateModalCommentCount() {
    const photo = photos.find(p => p.id === currentPhotoId);
    if (photo) {
        modalCommentCount.textContent = photo.comments.length;
    }
}

function handleModalLike() {
    if (currentPhotoId) {
        toggleLike(currentPhotoId);
    }
}

// Comments functionality
function renderComments(comments) {
    commentsList.innerHTML = '';
    
    comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';
        commentDiv.innerHTML = `
            <img src="${comment.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50'}" 
                 alt="${comment.author}" class="comment-avatar">
            <div class="comment-content">
                <div class="comment-author">${comment.author || 'Anonymous'}</div>
                <div class="comment-text">${comment.text}</div>
                <div class="comment-time">${formatTimeAgo(comment.timestamp)}</div>
            </div>
        `;
        commentsList.appendChild(commentDiv);
    });
    
    // Scroll to bottom
    commentsList.scrollTop = commentsList.scrollHeight;
}

function handleCommentSubmit(e) {
    e.preventDefault();
    
    const commentText = commentInput.value.trim();
    if (!commentText || !currentPhotoId) return;
    
    const photo = photos.find(p => p.id === currentPhotoId);
    if (photo) {
        const newComment = {
            author: 'You',
            text: commentText,
            timestamp: Date.now(),
            avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50'
        };
        
        photo.comments.push(newComment);
        savePhotos();
        renderComments(photo.comments);
        updateModalCommentCount();
        
        commentInput.value = '';
        showToast('Comment added!', 'success');
    }
}

// Download and share functionality
function handleDownload() {
    const photo = photos.find(p => p.id === currentPhotoId);
    if (photo) {
        const link = document.createElement('a');
        link.href = photo.imageUrl;
        link.download = `${photo.title.replace(/\s+/g, '_')}.jpg`;
        link.click();
        showToast('Photo downloaded!', 'success');
    }
}

function handleShare() {
    const photo = photos.find(p => p.id === currentPhotoId);
    if (photo && navigator.share) {
        navigator.share({
            title: photo.title,
            text: photo.description,
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href);
        showToast('Link copied to clipboard!', 'success');
    }
}

// Stats update
function updateStats() {
    const totalPhotos = photos.length;
    const totalLikes = photos.reduce((sum, photo) => sum + photo.likes, 0);
    const totalComments = photos.reduce((sum, photo) => sum + photo.comments.length, 0);
    
    // Update profile stats
    const totalPhotosEl = document.getElementById('totalPhotos');
    const totalLikesEl = document.getElementById('totalLikes');
    const totalCommentsEl = document.getElementById('totalComments');
    
    if (totalPhotosEl) totalPhotosEl.textContent = totalPhotos;
    if (totalLikesEl) totalLikesEl.textContent = totalLikes;
    if (totalCommentsEl) totalCommentsEl.textContent = totalComments;
    
    // Update hero stats
    const totalPhotosHero = document.getElementById('totalPhotosHero');
    const totalLikesHero = document.getElementById('totalLikesHero');
    const totalCommentsHero = document.getElementById('totalCommentsHero');
    
    if (totalPhotosHero) animateNumber(totalPhotosHero, totalPhotos);
    if (totalLikesHero) animateNumber(totalLikesHero, totalLikes);
    if (totalCommentsHero) animateNumber(totalCommentsHero, totalComments);
}

function animateNumber(element, target) {
    const start = parseInt(element.textContent) || 0;
    const duration = 1000;
    const startTime = Date.now();
    
    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(start + (target - start) * progress);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    update();
}

// Utility functions
function showToast(message, type = 'info') {
    const toastIcon = toast.querySelector('.toast-icon');
    const toastMessage = toast.querySelector('.toast-message');
    
    toast.className = `toast ${type}`;
    toastMessage.textContent = message;
    
    switch (type) {
        case 'success':
            toastIcon.className = 'fas fa-check-circle toast-icon';
            break;
        case 'error':
            toastIcon.className = 'fas fa-exclamation-circle toast-icon';
            break;
        default:
            toastIcon.className = 'fas fa-info-circle toast-icon';
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function showLoading(show) {
    loadingSpinner.style.display = show ? 'flex' : 'none';
}

function startFloatingAnimation() {
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        shape.style.animationDelay = `${index * -4}s`;
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && photoModal.style.display === 'block') {
        closePhotoModal();
    }
    
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 'u':
                e.preventDefault();
                showSection('upload');
                break;
            case 'h':
                e.preventDefault();
                showSection('home');
                break;
        }
    }
});

// Smooth scrolling for better UX
document.documentElement.style.scrollBehavior = 'smooth';