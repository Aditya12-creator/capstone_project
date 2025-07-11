// Global variables
let photos = [];
let contacts = [];
let groups = [];
let chats = [];
let currentUser = {
    id: 1,
    name: 'Aditya Kumar',
    phone: '+1234567890',
    email: 'aditya@example.com',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200'
};
let currentPhotoId = null;
let currentFilter = 'none';
let currentChatId = null;

// DOM elements
const photosFeed = document.getElementById('photosFeed');
const chatsList = document.getElementById('chatsList');
const chatArea = document.getElementById('chatArea');
const contactsGrid = document.getElementById('contactsGrid');
const groupsGrid = document.getElementById('groupsGrid');
const uploadForm = document.getElementById('uploadForm');
const photoInput = document.getElementById('photoInput');
const fileUploadArea = document.getElementById('fileUploadArea');
const previewSection = document.getElementById('previewSection');
const previewImage = document.getElementById('previewImage');
const photoModal = document.getElementById('photoModal');
const addContactModal = document.getElementById('addContactModal');
const createGroupModal = document.getElementById('createGroupModal');
const forwardModal = document.getElementById('forwardModal');
const themeToggle = document.getElementById('themeToggle');
const toast = document.getElementById('toast');
const loadingSpinner = document.getElementById('loadingSpinner');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadData();
    setupEventListeners();
    updateStats();
    initializeTheme();
    renderAllContent();
}

// Data Management
function loadData() {
    // Load contacts
    const savedContacts = localStorage.getItem('familySnapContacts');
    if (savedContacts) {
        contacts = JSON.parse(savedContacts);
    } else {
        contacts = [
            {
                id: 1,
                name: 'Mom',
                phone: '+1234567891',
                email: 'mom@family.com',
                avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100',
                relation: 'family',
                status: 'online',
                lastSeen: Date.now()
            },
            {
                id: 2,
                name: 'Dad',
                phone: '+1234567892',
                email: 'dad@family.com',
                avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=100',
                relation: 'family',
                status: 'offline',
                lastSeen: Date.now() - 3600000
            },
            {
                id: 3,
                name: 'Sarah',
                phone: '+1234567893',
                email: 'sarah@friends.com',
                avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=100',
                relation: 'friend',
                status: 'online',
                lastSeen: Date.now()
            },
            {
                id: 4,
                name: 'Mike',
                phone: '+1234567894',
                email: 'mike@friends.com',
                avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
                relation: 'friend',
                status: 'away',
                lastSeen: Date.now() - 1800000
            }
        ];
        saveContacts();
    }

    // Load groups
    const savedGroups = localStorage.getItem('familySnapGroups');
    if (savedGroups) {
        groups = JSON.parse(savedGroups);
    } else {
        groups = [
            {
                id: 1,
                name: 'Family',
                description: 'Our lovely family group',
                avatar: 'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=100',
                members: [1, 2], // Mom and Dad
                admin: 1,
                created: Date.now() - 86400000
            },
            {
                id: 2,
                name: 'Best Friends',
                description: 'College buddies forever!',
                avatar: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=100',
                members: [3, 4], // Sarah and Mike
                admin: 1,
                created: Date.now() - 172800000
            }
        ];
        saveGroups();
    }

    // Load photos
    const savedPhotos = localStorage.getItem('familySnapPhotos');
    if (savedPhotos) {
        photos = JSON.parse(savedPhotos);
    } else {
        photos = [
            {
                id: 1,
                caption: 'Beautiful sunset with family! ❤️',
                imageUrl: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=800',
                author: currentUser,
                sharedWith: 'contacts',
                specificContacts: [],
                tags: ['sunset', 'family', 'beautiful'],
                likes: [],
                comments: [],
                timestamp: Date.now() - 172800000,
                filter: 'warm',
                views: 0
            },
            {
                id: 2,
                caption: 'Coffee time with friends ☕',
                imageUrl: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800',
                author: contacts[2], // Sarah
                sharedWith: 'specific',
                specificContacts: [currentUser.id],
                tags: ['coffee', 'friends', 'cozy'],
                likes: [currentUser.id],
                comments: [
                    {
                        id: 1,
                        author: currentUser,
                        text: 'Looks delicious! ☕',
                        timestamp: Date.now() - 86400000
                    }
                ],
                timestamp: Date.now() - 259200000,
                filter: 'vintage',
                views: 5
            }
        ];
        savePhotos();
    }

    // Load chats
    const savedChats = localStorage.getItem('familySnapChats');
    if (savedChats) {
        chats = JSON.parse(savedChats);
    } else {
        chats = [
            {
                id: 1,
                type: 'individual',
                participant: contacts[0], // Mom
                messages: [
                    {
                        id: 1,
                        sender: contacts[0],
                        text: 'Hi honey! How was your day?',
                        timestamp: Date.now() - 3600000,
                        type: 'text'
                    },
                    {
                        id: 2,
                        sender: currentUser,
                        text: 'Great mom! Just shared some photos 📸',
                        timestamp: Date.now() - 3000000,
                        type: 'text'
                    }
                ],
                lastMessage: Date.now() - 3000000,
                unreadCount: 0
            },
            {
                id: 2,
                type: 'group',
                group: groups[0], // Family group
                messages: [
                    {
                        id: 1,
                        sender: contacts[1], // Dad
                        text: 'Looking forward to the weekend!',
                        timestamp: Date.now() - 7200000,
                        type: 'text'
                    }
                ],
                lastMessage: Date.now() - 7200000,
                unreadCount: 1
            }
        ];
        saveChats();
    }
}

function saveContacts() {
    localStorage.setItem('familySnapContacts', JSON.stringify(contacts));
}

function saveGroups() {
    localStorage.setItem('familySnapGroups', JSON.stringify(groups));
}

function savePhotos() {
    localStorage.setItem('familySnapPhotos', JSON.stringify(photos));
}

function saveChats() {
    localStorage.setItem('familySnapChats', JSON.stringify(chats));
}

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('familysnap-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('familysnap-theme', newTheme);
    updateThemeIcon(newTheme);
    
    showToast('Theme changed successfully!', 'success');
}

function updateThemeIcon(theme) {
    themeToggle.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Event Listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Quick actions
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', handleQuickAction);
    });
    
    // File upload
    fileUploadArea.addEventListener('click', () => photoInput.click());
    fileUploadArea.addEventListener('dragover', handleDragOver);
    fileUploadArea.addEventListener('drop', handleDrop);
    photoInput.addEventListener('change', handleFileSelect);
    
    // Share type radio buttons
    document.querySelectorAll('input[name="shareType"]').forEach(radio => {
        radio.addEventListener('change', handleShareTypeChange);
    });
    
    // Image filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', handleFilterSelect);
    });
    
    // Upload form
    uploadForm.addEventListener('submit', handleUpload);
    
    // Modal events
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', closeModal);
    });
    
    // Contact and group management
    document.getElementById('addContactBtn').addEventListener('click', () => openModal('addContactModal'));
    document.getElementById('createGroupBtn').addEventListener('click', () => openModal('createGroupModal'));
    
    document.getElementById('addContactForm').addEventListener('submit', handleAddContact);
    document.getElementById('createGroupForm').addEventListener('submit', handleCreateGroup);
    
    // User menu
    document.getElementById('userMenuToggle').addEventListener('click', toggleUserMenu);
    
    // Search
    document.getElementById('globalSearch').addEventListener('input', handleGlobalSearch);
    
    // Profile tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', handleProfileTab);
    });
}

// Navigation
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
    
    // Load section-specific content
    switch(sectionId) {
        case 'chats':
            renderChats();
            break;
        case 'contacts':
            renderContacts();
            break;
        case 'groups':
            renderGroups();
            break;
    }
}

// Quick Actions
function handleQuickAction(e) {
    const action = this.dataset.action;
    
    switch(action) {
        case 'share-photo':
            showSection('upload');
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            document.querySelector('.nav-link[data-section="upload"]').classList.add('active');
            break;
        case 'create-group':
            openModal('createGroupModal');
            break;
        case 'add-contact':
            openModal('addContactModal');
            break;
    }
}

// File Upload
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
            loadContactsSelector();
        };
        reader.readAsDataURL(file);
    }
}

function handleShareTypeChange(e) {
    const shareType = e.target.value;
    const specificContactsGroup = document.getElementById('specificContactsGroup');
    
    if (shareType === 'specific') {
        specificContactsGroup.style.display = 'block';
        loadContactsSelector();
    } else {
        specificContactsGroup.style.display = 'none';
    }
}

function loadContactsSelector() {
    const selector = document.getElementById('contactsSelector');
    if (!selector) return;
    
    selector.innerHTML = '';
    
    contacts.forEach(contact => {
        const contactItem = document.createElement('div');
        contactItem.className = 'contact-selector-item';
        contactItem.innerHTML = `
            <input type="checkbox" id="contact-${contact.id}" value="${contact.id}">
            <label for="contact-${contact.id}">
                <img src="${contact.avatar}" alt="${contact.name}" class="contact-avatar-small">
                <span>${contact.name}</span>
                <span class="contact-relation">${contact.relation}</span>
            </label>
        `;
        selector.appendChild(contactItem);
    });
}

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

// Photo Upload
function handleUpload(e) {
    e.preventDefault();
    
    const file = photoInput.files[0];
    const captionInput = document.getElementById('photoCaption');
    const shareType = document.querySelector('input[name="shareType"]:checked').value;
    const tagsInput = document.getElementById('photoTags');
    
    if (!file) {
        showToast('Please select an image file to upload', 'error');
        return;
    }
    
    const caption = captionInput ? captionInput.value.trim() : '';
    const tags = tagsInput ? tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    
    let specificContacts = [];
    if (shareType === 'specific') {
        const selectedContacts = document.querySelectorAll('#contactsSelector input[type="checkbox"]:checked');
        specificContacts = Array.from(selectedContacts).map(cb => parseInt(cb.value));
        
        if (specificContacts.length === 0) {
            showToast('Please select at least one contact to share with', 'error');
            return;
        }
    }
    
    showLoading(true);
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const newPhoto = {
            id: Date.now(),
            caption: caption,
            imageUrl: e.target.result,
            author: currentUser,
            sharedWith: shareType,
            specificContacts: specificContacts,
            tags: tags,
            likes: [],
            comments: [],
            timestamp: Date.now(),
            filter: currentFilter,
            views: 0
        };
        
        photos.unshift(newPhoto);
        savePhotos();
        renderAllContent();
        updateStats();
        
        // Reset form
        uploadForm.reset();
        previewSection.classList.remove('active');
        currentFilter = 'none';
        document.querySelector('.filter-btn[data-filter="none"]').classList.add('active');
        document.getElementById('specificContactsGroup').style.display = 'none';
        
        showLoading(false);
        showToast('Photo shared successfully!', 'success');
        
        // Navigate to home
        showSection('home');
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelector('.nav-link[data-section="home"]').classList.add('active');
    };
    
    reader.onerror = function() {
        showLoading(false);
        showToast('Error reading the image file. Please try again.', 'error');
    };
    
    reader.readAsDataURL(file);
}

// Render Functions
function renderAllContent() {
    renderPhotosFeed();
    renderRecentActivity();
    renderStories();
    updateStats();
}

function renderPhotosFeed() {
    if (!photosFeed) return;
    
    photosFeed.innerHTML = '';
    
    // Filter photos based on privacy settings
    const visiblePhotos = photos.filter(photo => {
        if (photo.author.id === currentUser.id) return true;
        if (photo.sharedWith === 'public') return true;
        if (photo.sharedWith === 'contacts') return true; // Assuming all contacts can see
        if (photo.sharedWith === 'specific') {
            return photo.specificContacts.includes(currentUser.id);
        }
        return false;
    });
    
    visiblePhotos.forEach(photo => {
        const photoCard = createPhotoCard(photo);
        photosFeed.appendChild(photoCard);
    });
    
    attachPhotoEventListeners();
}

function createPhotoCard(photo) {
    const card = document.createElement('div');
    card.className = 'photo-card';
    card.dataset.photoId = photo.id;
    
    const formattedDate = formatTimeAgo(photo.timestamp);
    const filterClass = photo.filter && photo.filter !== 'none' ? `filter-${photo.filter}` : '';
    const isLiked = photo.likes.includes(currentUser.id);
    
    card.innerHTML = `
        <div class="photo-header">
            <div class="author-info">
                <img src="${photo.author.avatar}" alt="${photo.author.name}" class="author-avatar">
                <div class="author-details">
                    <h4>${photo.author.name}</h4>
                    <span>${formattedDate}</span>
                </div>
            </div>
            <div class="photo-menu">
                <button class="btn-icon">
                    <i class="fas fa-ellipsis-h"></i>
                </button>
            </div>
        </div>
        
        <div class="photo-image-container">
            <img src="${photo.imageUrl}" alt="${photo.caption}" class="${filterClass}">
        </div>
        
        <div class="photo-actions">
            <button class="action-btn like-btn ${isLiked ? 'liked' : ''}" data-photo-id="${photo.id}">
                <i class="fas fa-heart"></i>
                <span>${photo.likes.length}</span>
            </button>
            <button class="action-btn comment-btn" data-photo-id="${photo.id}">
                <i class="fas fa-comment"></i>
                <span>${photo.comments.length}</span>
            </button>
            <button class="action-btn share-btn" data-photo-id="${photo.id}">
                <i class="fas fa-share"></i>
            </button>
        </div>
        
        <div class="photo-info">
            <div class="photo-likes">
                ${photo.likes.length > 0 ? `<strong>${photo.likes.length} ${photo.likes.length === 1 ? 'like' : 'likes'}</strong>` : ''}
            </div>
            <div class="photo-caption">
                <strong>${photo.author.name}</strong> ${photo.caption}
            </div>
            ${photo.tags.length > 0 ? `
                <div class="photo-tags">
                    ${photo.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>
            ` : ''}
            ${photo.comments.length > 0 ? `
                <div class="photo-comments-preview">
                    <button class="view-comments" data-photo-id="${photo.id}">
                        View all ${photo.comments.length} comments
                    </button>
                </div>
            ` : ''}
        </div>
    `;
    
    return card;
}

function renderRecentActivity() {
    const recentActivity = document.getElementById('recentActivity');
    if (!recentActivity) return;
    
    recentActivity.innerHTML = '';
    
    // Get recent photos and interactions
    const recentItems = photos
        .slice(0, 5)
        .map(photo => ({
            type: 'photo',
            data: photo,
            timestamp: photo.timestamp
        }));
    
    recentItems.forEach(item => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        if (item.type === 'photo') {
            activityItem.innerHTML = `
                <img src="${item.data.author.avatar}" alt="${item.data.author.name}" class="activity-avatar">
                <div class="activity-content">
                    <p><strong>${item.data.author.name}</strong> shared a photo</p>
                    <span class="activity-time">${formatTimeAgo(item.timestamp)}</span>
                </div>
                <img src="${item.data.imageUrl}" alt="Photo" class="activity-thumbnail">
            `;
        }
        
        recentActivity.appendChild(activityItem);
    });
}

function renderStories() {
    const storiesContainer = document.getElementById('storiesContainer');
    if (!storiesContainer) return;
    
    // For now, just show the "Add Story" button
    // In a real app, you'd load actual stories here
}

function renderContacts() {
    if (!contactsGrid) return;
    
    contactsGrid.innerHTML = '';
    
    contacts.forEach(contact => {
        const contactCard = document.createElement('div');
        contactCard.className = 'contact-card';
        contactCard.innerHTML = `
            <div class="contact-avatar-container">
                <img src="${contact.avatar}" alt="${contact.name}" class="contact-avatar">
                <div class="status-indicator ${contact.status}"></div>
            </div>
            <div class="contact-info">
                <h4>${contact.name}</h4>
                <p class="contact-relation">${contact.relation}</p>
                <p class="contact-status">
                    ${contact.status === 'online' ? 'Online' : 
                      contact.status === 'away' ? 'Away' : 
                      `Last seen ${formatTimeAgo(contact.lastSeen)}`}
                </p>
            </div>
            <div class="contact-actions">
                <button class="btn-icon" onclick="startChat(${contact.id})">
                    <i class="fas fa-comment"></i>
                </button>
                <button class="btn-icon" onclick="viewContactProfile(${contact.id})">
                    <i class="fas fa-user"></i>
                </button>
            </div>
        `;
        contactsGrid.appendChild(contactCard);
    });
}

function renderGroups() {
    if (!groupsGrid) return;
    
    groupsGrid.innerHTML = '';
    
    groups.forEach(group => {
        const groupCard = document.createElement('div');
        groupCard.className = 'group-card';
        groupCard.innerHTML = `
            <div class="group-avatar">
                <img src="${group.avatar}" alt="${group.name}">
            </div>
            <div class="group-info">
                <h4>${group.name}</h4>
                <p>${group.description}</p>
                <span class="group-members">${group.members.length} members</span>
            </div>
            <div class="group-actions">
                <button class="btn-icon" onclick="openGroupChat(${group.id})">
                    <i class="fas fa-comment"></i>
                </button>
                <button class="btn-icon" onclick="viewGroupInfo(${group.id})">
                    <i class="fas fa-info-circle"></i>
                </button>
            </div>
        `;
        groupsGrid.appendChild(groupCard);
    });
}

function renderChats() {
    if (!chatsList) return;
    
    chatsList.innerHTML = '';
    
    chats.forEach(chat => {
        const chatItem = document.createElement('div');
        chatItem.className = 'chat-item';
        chatItem.dataset.chatId = chat.id;
        
        let chatName, chatAvatar, lastMessage;
        
        if (chat.type === 'individual') {
            chatName = chat.participant.name;
            chatAvatar = chat.participant.avatar;
        } else {
            chatName = chat.group.name;
            chatAvatar = chat.group.avatar;
        }
        
        if (chat.messages.length > 0) {
            const lastMsg = chat.messages[chat.messages.length - 1];
            lastMessage = lastMsg.text;
        } else {
            lastMessage = 'No messages yet';
        }
        
        chatItem.innerHTML = `
            <div class="chat-avatar">
                <img src="${chatAvatar}" alt="${chatName}">
                ${chat.type === 'individual' && chat.participant.status === 'online' ? 
                    '<div class="status-indicator online"></div>' : ''}
            </div>
            <div class="chat-info">
                <h4>${chatName}</h4>
                <p class="last-message">${truncateText(lastMessage, 50)}</p>
            </div>
            <div class="chat-meta">
                <span class="chat-time">${formatTimeAgo(chat.lastMessage)}</span>
                ${chat.unreadCount > 0 ? `<span class="unread-badge">${chat.unreadCount}</span>` : ''}
            </div>
        `;
        
        chatItem.addEventListener('click', () => openChat(chat.id));
        chatsList.appendChild(chatItem);
    });
}

// Contact Management
function handleAddContact(e) {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value.trim();
    const phone = document.getElementById('contactPhone').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const relation = document.getElementById('contactRelation').value;
    
    if (!name || !phone || !relation) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    const newContact = {
        id: Date.now(),
        name: name,
        phone: phone,
        email: email,
        avatar: `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo-${Math.floor(Math.random() * 1000000)}.jpeg?auto=compress&cs=tinysrgb&w=100`,
        relation: relation,
        status: 'offline',
        lastSeen: Date.now()
    };
    
    contacts.push(newContact);
    saveContacts();
    renderContacts();
    updateStats();
    
    closeModal();
    showToast('Contact added successfully!', 'success');
    
    // Reset form
    document.getElementById('addContactForm').reset();
}

function handleCreateGroup(e) {
    e.preventDefault();
    
    const name = document.getElementById('groupName').value.trim();
    const description = document.getElementById('groupDescription').value.trim();
    const selectedMembers = Array.from(document.querySelectorAll('#membersSelector input[type="checkbox"]:checked'))
        .map(cb => parseInt(cb.value));
    
    if (!name) {
        showToast('Please enter a group name', 'error');
        return;
    }
    
    if (selectedMembers.length === 0) {
        showToast('Please select at least one member', 'error');
        return;
    }
    
    const newGroup = {
        id: Date.now(),
        name: name,
        description: description,
        avatar: `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo-${Math.floor(Math.random() * 1000000)}.jpeg?auto=compress&cs=tinysrgb&w=100`,
        members: selectedMembers,
        admin: currentUser.id,
        created: Date.now()
    };
    
    groups.push(newGroup);
    saveGroups();
    renderGroups();
    updateStats();
    
    closeModal();
    showToast('Group created successfully!', 'success');
    
    // Reset form
    document.getElementById('createGroupForm').reset();
}

// Photo Interactions
function attachPhotoEventListeners() {
    document.querySelectorAll('.photo-card').forEach(card => {
        const img = card.querySelector('.photo-image-container img');
        if (img) {
            img.addEventListener('click', function() {
                const photoId = parseInt(card.dataset.photoId);
                openPhotoModal(photoId);
            });
        }
    });
    
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const photoId = parseInt(this.dataset.photoId);
            toggleLike(photoId);
        });
    });
    
    document.querySelectorAll('.comment-btn, .view-comments').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const photoId = parseInt(this.dataset.photoId);
            openPhotoModal(photoId);
        });
    });
    
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const photoId = parseInt(this.dataset.photoId);
            openForwardModal(photoId);
        });
    });
}

function toggleLike(photoId) {
    const photo = photos.find(p => p.id === photoId);
    if (photo) {
        const likeIndex = photo.likes.indexOf(currentUser.id);
        if (likeIndex > -1) {
            photo.likes.splice(likeIndex, 1);
        } else {
            photo.likes.push(currentUser.id);
        }
        savePhotos();
        renderPhotosFeed();
        
        if (currentPhotoId === photoId) {
            updateModalLikeButton();
        }
    }
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Load specific modal content
        if (modalId === 'createGroupModal') {
            loadMembersSelector();
        }
    }
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
    currentPhotoId = null;
}

function loadMembersSelector() {
    const selector = document.getElementById('membersSelector');
    if (!selector) return;
    
    selector.innerHTML = '';
    
    contacts.forEach(contact => {
        const memberItem = document.createElement('div');
        memberItem.className = 'member-selector-item';
        memberItem.innerHTML = `
            <input type="checkbox" id="member-${contact.id}" value="${contact.id}">
            <label for="member-${contact.id}">
                <img src="${contact.avatar}" alt="${contact.name}" class="member-avatar">
                <div class="member-info">
                    <span class="member-name">${contact.name}</span>
                    <span class="member-relation">${contact.relation}</span>
                </div>
            </label>
        `;
        selector.appendChild(memberItem);
    });
}

function openPhotoModal(photoId) {
    currentPhotoId = photoId;
    const photo = photos.find(p => p.id === photoId);
    
    if (photo) {
        photo.views++;
        savePhotos();
        
        const modal = document.getElementById('photoModal');
        const modalImage = document.getElementById('modalImage');
        const modalAuthor = document.getElementById('modalAuthor');
        const modalDate = document.getElementById('modalDate');
        const modalDescription = document.getElementById('modalDescription');
        const modalTags = document.getElementById('modalTags');
        
        const filterClass = photo.filter && photo.filter !== 'none' ? `filter-${photo.filter}` : '';
        modalImage.src = photo.imageUrl;
        modalImage.className = `modal-image ${filterClass}`;
        modalAuthor.textContent = photo.author.name;
        modalDate.textContent = formatTimeAgo(photo.timestamp);
        modalDescription.textContent = photo.caption;
        
        modalTags.innerHTML = photo.tags.length > 0 ? 
            photo.tags.map(tag => `<span class="tag">#${tag}</span>`).join('') : '';
        
        updateModalLikeButton();
        updateModalCommentCount();
        renderModalComments(photo.comments);
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function updateModalLikeButton() {
    const photo = photos.find(p => p.id === currentPhotoId);
    if (photo) {
        const likeBtn = document.getElementById('modalLikeBtn');
        const likeIcon = document.getElementById('modalLikeIcon');
        const likeCount = document.getElementById('modalLikeCount');
        
        const isLiked = photo.likes.includes(currentUser.id);
        likeIcon.className = isLiked ? 'fas fa-heart' : 'far fa-heart';
        likeBtn.classList.toggle('liked', isLiked);
        likeCount.textContent = photo.likes.length;
        
        likeBtn.onclick = () => toggleLike(currentPhotoId);
    }
}

function updateModalCommentCount() {
    const photo = photos.find(p => p.id === currentPhotoId);
    if (photo) {
        const commentCount = document.getElementById('modalCommentCount');
        commentCount.textContent = photo.comments.length;
    }
}

function renderModalComments(comments) {
    const commentsList = document.getElementById('commentsList');
    if (!commentsList) return;
    
    commentsList.innerHTML = '';
    
    comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';
        commentDiv.innerHTML = `
            <img src="${comment.author.avatar}" alt="${comment.author.name}" class="comment-avatar">
            <div class="comment-content">
                <div class="comment-author">${comment.author.name}</div>
                <div class="comment-text">${comment.text}</div>
                <div class="comment-time">${formatTimeAgo(comment.timestamp)}</div>
            </div>
        `;
        commentsList.appendChild(commentDiv);
    });
    
    commentsList.scrollTop = commentsList.scrollHeight;
}

// Utility Functions
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

function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function updateStats() {
    const totalPhotosEl = document.getElementById('totalPhotos');
    const totalContactsEl = document.getElementById('totalContacts');
    const totalGroupsEl = document.getElementById('totalGroups');
    
    if (totalPhotosEl) totalPhotosEl.textContent = photos.filter(p => p.author.id === currentUser.id).length;
    if (totalContactsEl) totalContactsEl.textContent = contacts.length;
    if (totalGroupsEl) totalGroupsEl.textContent = groups.length;
    
    // Update chat badge
    const chatsBadge = document.getElementById('chatsBadge');
    const totalUnread = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);
    if (chatsBadge) {
        chatsBadge.textContent = totalUnread;
        chatsBadge.style.display = totalUnread > 0 ? 'block' : 'none';
    }
}

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

// Additional Functions (stubs for future implementation)
function startChat(contactId) {
    showToast('Chat feature coming soon!', 'info');
}

function viewContactProfile(contactId) {
    showToast('Contact profile feature coming soon!', 'info');
}

function openGroupChat(groupId) {
    showToast('Group chat feature coming soon!', 'info');
}

function viewGroupInfo(groupId) {
    showToast('Group info feature coming soon!', 'info');
}

function openChat(chatId) {
    showToast('Chat interface coming soon!', 'info');
}

function openForwardModal(photoId) {
    showToast('Forward feature coming soon!', 'info');
}

function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('show');
}

function handleGlobalSearch(e) {
    const query = e.target.value.toLowerCase();
    // Implement global search functionality
    console.log('Searching for:', query);
}

function handleProfileTab(e) {
    const tab = this.dataset.tab;
    
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
    
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    document.getElementById(`${tab}-tab`).classList.add('active');
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Click outside to close dropdowns
document.addEventListener('click', function(e) {
    if (!e.target.closest('.user-menu')) {
        document.getElementById('userDropdown').classList.remove('show');
    }
});