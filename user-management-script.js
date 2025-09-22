// Sample user data
let users = [
    {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        phone: '+1 (555) 123-4567',
        role: 'Project Manager',
        department: 'IT',
        status: 'Active',
        lastActive: '2024-01-15',
        bio: 'Experienced project manager with 8+ years in software development.'
    },
    {
        id: 2,
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@company.com',
        phone: '+1 (555) 234-5678',
        role: 'Developer',
        department: 'IT',
        status: 'Active',
        lastActive: '2024-01-14',
        bio: 'Full-stack developer specializing in React and Node.js.'
    },
    {
        id: 3,
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'michael.chen@company.com',
        phone: '+1 (555) 345-6789',
        role: 'Designer',
        department: 'Marketing',
        status: 'Active',
        lastActive: '2024-01-13',
        bio: 'UI/UX designer with expertise in modern design systems.'
    },
    {
        id: 4,
        firstName: 'Emily',
        lastName: 'Davis',
        email: 'emily.davis@company.com',
        phone: '+1 (555) 456-7890',
        role: 'Analyst',
        department: 'Finance',
        status: 'Inactive',
        lastActive: '2024-01-10',
        bio: 'Financial analyst with strong background in data analysis.'
    },
    {
        id: 5,
        firstName: 'David',
        lastName: 'Wilson',
        email: 'david.wilson@company.com',
        phone: '+1 (555) 567-8901',
        role: 'Admin',
        department: 'HR',
        status: 'Active',
        lastActive: '2024-01-15',
        bio: 'System administrator managing company infrastructure.'
    },
    {
        id: 6,
        firstName: 'Lisa',
        lastName: 'Brown',
        email: 'lisa.brown@company.com',
        phone: '+1 (555) 678-9012',
        role: 'Project Manager',
        department: 'Operations',
        status: 'Pending',
        lastActive: '2024-01-12',
        bio: 'Operations project manager focusing on process improvement.'
    },
    {
        id: 7,
        firstName: 'James',
        lastName: 'Miller',
        email: 'james.miller@company.com',
        phone: '+1 (555) 789-0123',
        role: 'Developer',
        department: 'IT',
        status: 'Active',
        lastActive: '2024-01-14',
        bio: 'Backend developer with expertise in Python and databases.'
    },
    {
        id: 8,
        firstName: 'Anna',
        lastName: 'Garcia',
        email: 'anna.garcia@company.com',
        phone: '+1 (555) 890-1234',
        role: 'Designer',
        department: 'Marketing',
        status: 'Active',
        lastActive: '2024-01-15',
        bio: 'Graphic designer specializing in brand identity and marketing materials.'
    }
];

// Global variables
let filteredUsers = [...users];
let currentPage = 1;
let pageSize = 10;
let sortColumn = '';
let sortDirection = 'asc';
let currentAction = null;
let currentUserId = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderUsers();
    updatePagination();
    updateUserCount();
    
    // Add form validation
    setupFormValidation();
    
    // Add keyboard navigation
    setupKeyboardNavigation();
});

// Render users table
function renderUsers() {
    const tbody = document.getElementById('usersTableBody');
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const paginatedUsers = filteredUsers.slice(start, end);
    
    tbody.innerHTML = '';
    
    paginatedUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="user-info">
                    <div class="user-avatar" title="${user.firstName} ${user.lastName}">
                        ${user.firstName.charAt(0)}${user.lastName.charAt(0)}
                    </div>
                    <div class="user-details">
                        <div class="user-name">${user.firstName} ${user.lastName}</div>
                        <div class="user-email">${user.email}</div>
                    </div>
                </div>
            </td>
            <td>${user.email}</td>
            <td>
                <span class="role-badge">${user.role}</span>
            </td>
            <td>
                <span class="department-text">${user.department}</span>
            </td>
            <td>
                <span class="status-badge status-${user.status.toLowerCase()}">
                    <span class="status-dot"></span>
                    ${user.status}
                </span>
            </td>
            <td>
                <span class="last-active">${formatDate(user.lastActive)}</span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="editUser(${user.id})" title="Edit user" aria-label="Edit ${user.firstName} ${user.lastName}">
                        <i class="fas fa-edit" aria-hidden="true"></i>
                    </button>
                    <button class="action-btn assign" onclick="showAssignProjectModal(${user.id})" title="Assign project" aria-label="Assign project to ${user.firstName} ${user.lastName}">
                        <i class="fas fa-tasks" aria-hidden="true"></i>
                    </button>
                    <button class="action-btn delete" onclick="confirmDeleteUser(${user.id})" title="Delete user" aria-label="Delete ${user.firstName} ${user.lastName}">
                        <i class="fas fa-trash" aria-hidden="true"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Update table accessibility
    updateTableAccessibility();
}

// Update table accessibility attributes
function updateTableAccessibility() {
    const table = document.getElementById('usersTable');
    const rows = table.querySelectorAll('tbody tr');
    
    rows.forEach((row, index) => {
        row.setAttribute('role', 'row');
        row.setAttribute('aria-rowindex', index + 2); // +2 because header is row 1
        
        const cells = row.querySelectorAll('td');
        cells.forEach((cell, cellIndex) => {
            cell.setAttribute('role', 'cell');
            cell.setAttribute('aria-describedby', `col-${cellIndex}`);
        });
    });
}

// Filter users
function filterUsers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const roleFilter = document.getElementById('roleFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const departmentFilter = document.getElementById('departmentFilter').value;
    
    filteredUsers = users.filter(user => {
        const matchesSearch = !searchTerm || 
            user.firstName.toLowerCase().includes(searchTerm) ||
            user.lastName.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.role.toLowerCase().includes(searchTerm);
            
        const matchesRole = !roleFilter || user.role === roleFilter;
        const matchesStatus = !statusFilter || user.status === statusFilter;
        const matchesDepartment = !departmentFilter || user.department === departmentFilter;
        
        return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
    });
    
    currentPage = 1;
    renderUsers();
    updatePagination();
    updateUserCount();
}

// Clear search
function clearSearch() {
    document.getElementById('searchInput').value = '';
    filterUsers();
}

// Reset filters
function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('roleFilter').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('departmentFilter').value = '';
    filterUsers();
    showToast('Filters reset successfully', 'success');
}

// Sort table
function sortTable(column) {
    const header = document.querySelector(`th[onclick="sortTable('${column}')"]`);
    const currentSort = header.getAttribute('aria-sort');
    
    // Reset all sort indicators
    document.querySelectorAll('th[aria-sort]').forEach(th => {
        th.setAttribute('aria-sort', 'none');
        th.querySelector('.sort-icon').className = 'fas fa-sort sort-icon';
    });
    
    // Determine new sort direction
    if (currentSort === 'ascending') {
        sortDirection = 'desc';
        header.setAttribute('aria-sort', 'descending');
        header.querySelector('.sort-icon').className = 'fas fa-sort-down sort-icon';
    } else {
        sortDirection = 'asc';
        header.setAttribute('aria-sort', 'ascending');
        header.querySelector('.sort-icon').className = 'fas fa-sort-up sort-icon';
    }
    
    sortColumn = column;
    
    // Sort the filtered users
    filteredUsers.sort((a, b) => {
        let aValue = a[column];
        let bValue = b[column];
        
        // Handle different data types
        if (column === 'lastActive') {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
        } else if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }
        
        if (sortDirection === 'asc') {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
    });
    
    renderUsers();
}

// Pagination functions
function updatePagination() {
    const totalPages = Math.ceil(filteredUsers.length / pageSize);
    const paginationNumbers = document.getElementById('paginationNumbers');
    const paginationInfo = document.getElementById('paginationInfo');
    
    // Update pagination info
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, filteredUsers.length);
    paginationInfo.textContent = `Showing ${start}-${end} of ${filteredUsers.length} users`;
    
    // Clear existing page numbers
    paginationNumbers.innerHTML = '';
    
    // Calculate page range to show
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-number ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.onclick = () => goToPage(i);
        pageBtn.setAttribute('aria-label', `Go to page ${i}`);
        pageBtn.setAttribute('aria-current', i === currentPage ? 'page' : 'false');
        paginationNumbers.appendChild(pageBtn);
    }
    
    // Update navigation buttons
    const firstBtn = document.querySelector('button[onclick="changePage(\'first\')"]');
    const prevBtn = document.querySelector('button[onclick="changePage(\'prev\')"]');
    const nextBtn = document.querySelector('button[onclick="changePage(\'next\')"]');
    const lastBtn = document.querySelector('button[onclick="changePage(\'last\')"]');
    
    firstBtn.disabled = currentPage === 1;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    lastBtn.disabled = currentPage === totalPages || totalPages === 0;
}

function changePage(direction) {
    const totalPages = Math.ceil(filteredUsers.length / pageSize);
    
    switch (direction) {
        case 'first':
            currentPage = 1;
            break;
        case 'prev':
            if (currentPage > 1) currentPage--;
            break;
        case 'next':
            if (currentPage < totalPages) currentPage++;
            break;
        case 'last':
            currentPage = totalPages;
            break;
    }
    
    renderUsers();
    updatePagination();
}

function goToPage(page) {
    currentPage = page;
    renderUsers();
    updatePagination();
}

function changePageSize() {
    pageSize = parseInt(document.getElementById('pageSize').value);
    currentPage = 1;
    renderUsers();
    updatePagination();
}

// Update user count
function updateUserCount() {
    const userCount = document.getElementById('userCount');
    userCount.textContent = `Showing ${filteredUsers.length} of ${users.length} users`;
}

// Modal functions
function showAddUserModal() {
    const modal = document.getElementById('addUserModal');
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    
    // Focus on first input
    setTimeout(() => {
        document.getElementById('firstName').focus();
    }, 100);
    
    // Trap focus in modal
    trapFocus(modal);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    
    // Clear form if it's the add user modal
    if (modalId === 'addUserModal') {
        document.getElementById('addUserForm').reset();
        clearFormErrors();
    }
    
    // Return focus to trigger element
    if (modalId === 'addUserModal') {
        document.querySelector('button[onclick="showAddUserModal()"]').focus();
    }
}

function showAssignProjectModal(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    currentUserId = userId;
    
    // Update user info in modal
    document.getElementById('assignUserName').textContent = `${user.firstName} ${user.lastName}`;
    document.getElementById('assignUserRole').textContent = user.role;
    
    const modal = document.getElementById('assignProjectModal');
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    
    // Focus on project select
    setTimeout(() => {
        document.getElementById('projectSelect').focus();
    }, 100);
    
    trapFocus(modal);
}

// Form validation
function setupFormValidation() {
    const form = document.getElementById('addUserForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
    
    form.addEventListener('submit', handleFormSubmit);
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = `${getFieldLabel(fieldName)} is required`;
    }
    
    // Email validation
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    if (fieldName === 'phone' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    // Bio length validation
    if (fieldName === 'bio' && value.length > 500) {
        isValid = false;
        errorMessage = 'Bio must be less than 500 characters';
    }
    
    showFieldError(field, isValid ? '' : errorMessage);
    return isValid;
}

function showFieldError(field, message) {
    const errorElement = document.getElementById(`${field.name}Error`);
    if (errorElement) {
        errorElement.textContent = message;
        field.setAttribute('aria-invalid', message ? 'true' : 'false');
        
        if (message) {
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }
    }
}

function clearFieldError(field) {
    showFieldError(field, '');
}

function clearFormErrors() {
    const form = document.getElementById('addUserForm');
    const errorElements = form.querySelectorAll('.error-message');
    const inputElements = form.querySelectorAll('input, select, textarea');
    
    errorElements.forEach(el => el.textContent = '');
    inputElements.forEach(el => {
        el.classList.remove('error');
        el.setAttribute('aria-invalid', 'false');
    });
}

function getFieldLabel(fieldName) {
    const labels = {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email Address',
        phone: 'Phone Number',
        role: 'Role',
        department: 'Department',
        status: 'Status',
        bio: 'Bio'
    };
    return labels[fieldName] || fieldName;
}

function handleFormSubmit(event) {
    event.preventDefault();
    submitUserForm();
}

// Form submission
function submitUserForm() {
    const form = document.getElementById('addUserForm');
    const formData = new FormData(form);
    let isValid = true;
    
    // Validate all fields
    const inputs = form.querySelectorAll('input[required], select[required]');
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showToast('Please correct the errors in the form', 'error');
        return;
    }
    
    // Create new user object
    const newUser = {
        id: users.length + 1,
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone') || '',
        role: formData.get('role'),
        department: formData.get('department'),
        status: formData.get('status'),
        lastActive: new Date().toISOString().split('T')[0],
        bio: formData.get('bio') || ''
    };
    
    // Add user to array
    users.push(newUser);
    
    // Update display
    filterUsers();
    closeModal('addUserModal');
    showToast(`User ${newUser.firstName} ${newUser.lastName} added successfully`, 'success');
}

// User actions
function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    showToast(`Edit functionality for ${user.firstName} ${user.lastName} would be implemented here`, 'info');
}

function confirmDeleteUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    currentUserId = userId;
    currentAction = 'delete';
    
    showConfirmModal(
        'Delete User',
        `Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`,
        'Delete',
        'fas fa-trash',
        'btn-danger'
    );
}

function deleteUser(userId) {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return;
    
    const user = users[userIndex];
    users.splice(userIndex, 1);
    
    filterUsers();
    showToast(`User ${user.firstName} ${user.lastName} deleted successfully`, 'success');
}

function assignProject() {
    const projectId = document.getElementById('projectSelect').value;
    const projectRole = document.getElementById('projectRole').value;
    const notes = document.getElementById('assignmentNotes').value;
    
    if (!projectId || !projectRole) {
        showToast('Please select a project and role', 'error');
        return;
    }
    
    const user = users.find(u => u.id === currentUserId);
    const projectName = document.getElementById('projectSelect').selectedOptions[0].textContent;
    
    closeModal('assignProjectModal');
    showToast(`${user.firstName} ${user.lastName} assigned to ${projectName} as ${projectRole}`, 'success');
    
    // Clear form
    document.getElementById('assignProjectForm').reset();
}

// Confirmation modal
function showConfirmModal(title, message, buttonText, iconClass, buttonClass) {
    document.getElementById('confirmModalTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;
    document.getElementById('confirmButtonText').textContent = buttonText;
    document.getElementById('confirmIcon').className = iconClass;
    document.getElementById('confirmButton').className = `btn ${buttonClass}`;
    
    const modal = document.getElementById('confirmModal');
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    
    trapFocus(modal);
}

function confirmAction() {
    if (currentAction === 'delete' && currentUserId) {
        deleteUser(currentUserId);
    }
    
    closeModal('confirmModal');
    currentAction = null;
    currentUserId = null;
}

// Toast notifications
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const icon = document.getElementById('toastIcon');
    const messageEl = document.getElementById('toastMessage');
    
    // Set icon based on type
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    icon.className = `toast-icon ${icons[type]}`;
    messageEl.textContent = message;
    toast.className = `toast ${type} show`;
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        closeToast();
    }, 5000);
}

function closeToast() {
    const toast = document.getElementById('toast');
    toast.classList.remove('show');
}

// View toggle
function setTableView() {
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('button[onclick="setTableView()"]').classList.add('active');
    // Table view is already active
}

function setCardView() {
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('button[onclick="setCardView()"]').classList.add('active');
    showToast('Card view would be implemented here', 'info');
}

// Export functionality
function exportUsers() {
    const csvContent = generateCSV();
    downloadCSV(csvContent, 'users.csv');
    showToast('User data exported successfully', 'success');
}

function generateCSV() {
    const headers = ['Name', 'Email', 'Role', 'Department', 'Status', 'Last Active'];
    const rows = filteredUsers.map(user => [
        `${user.firstName} ${user.lastName}`,
        user.email,
        user.role,
        user.department,
        user.status,
        formatDate(user.lastActive)
    ]);
    
    const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');
    
    return csvContent;
}

function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays <= 7) {
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString();
    }
}

// Accessibility functions
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
        
        if (e.key === 'Escape') {
            const modalId = element.id;
            closeModal(modalId);
        }
    });
}

function setupKeyboardNavigation() {
    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Alt + N: Add new user
        if (e.altKey && e.key === 'n') {
            e.preventDefault();
            showAddUserModal();
        }
        
        // Alt + S: Focus search
        if (e.altKey && e.key === 's') {
            e.preventDefault();
            document.getElementById('searchInput').focus();
        }
        
        // Alt + R: Reset filters
        if (e.altKey && e.key === 'r') {
            e.preventDefault();
            resetFilters();
        }
    });
}

// Close modals when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        const modal = e.target.closest('.modal');
        if (modal) {
            closeModal(modal.id);
        }
    }
});

// Handle form input styling
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
});