// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const passwordToggle = document.getElementById('passwordToggle');
const passwordIcon = document.getElementById('passwordIcon');
const loginBtn = document.getElementById('loginBtn');
const loadingOverlay = document.getElementById('loadingOverlay');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

// Error message elements
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');

// Mobile menu toggle
mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
});

// Password visibility toggle
passwordToggle.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    if (type === 'text') {
        passwordIcon.classList.remove('fa-eye');
        passwordIcon.classList.add('fa-eye-slash');
    } else {
        passwordIcon.classList.remove('fa-eye-slash');
        passwordIcon.classList.add('fa-eye');
    }
});

// Form validation functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function showError(input, errorElement, message) {
    input.classList.add('error');
    errorElement.textContent = message;
    errorElement.style.opacity = '1';
}

function clearError(input, errorElement) {
    input.classList.remove('error');
    errorElement.textContent = '';
    errorElement.style.opacity = '0';
}

// Real-time validation
emailInput.addEventListener('input', () => {
    const email = emailInput.value.trim();
    if (email && !validateEmail(email)) {
        showError(emailInput, emailError, 'Please enter a valid email address');
    } else {
        clearError(emailInput, emailError);
    }
});

passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    if (password && !validatePassword(password)) {
        showError(passwordInput, passwordError, 'Password must be at least 6 characters long');
    } else {
        clearError(passwordInput, passwordError);
    }
});

// Form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    let isValid = true;
    
    // Validate email
    if (!email) {
        showError(emailInput, emailError, 'Email is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError(emailInput, emailError, 'Please enter a valid email address');
        isValid = false;
    } else {
        clearError(emailInput, emailError);
    }
    
    // Validate password
    if (!password) {
        showError(passwordInput, passwordError, 'Password is required');
        isValid = false;
    } else if (!validatePassword(password)) {
        showError(passwordInput, passwordError, 'Password must be at least 6 characters long');
        isValid = false;
    } else {
        clearError(passwordInput, passwordError);
    }
    
    if (!isValid) {
        return;
    }
    
    // Show loading state
    showLoading();
    
    try {
        // Simulate API call
        await simulateLogin(email, password);
        
        // Success - redirect to dashboard
        showNotification('Login successful! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'projects.html';
        }, 1500);
        
    } catch (error) {
        hideLoading();
        showNotification(error.message, 'error');
    }
});

// Simulate login API call
function simulateLogin(email, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Demo credentials
            if (email === 'demo@projecthub.com' && password === 'demo123') {
                resolve({ success: true, user: { email, name: 'Demo User' } });
            } else if (email === 'admin@projecthub.com' && password === 'admin123') {
                resolve({ success: true, user: { email, name: 'Admin User' } });
            } else {
                reject(new Error('Invalid email or password. Try demo@projecthub.com / demo123'));
            }
        }, 2000);
    });
}

// Loading state management
function showLoading() {
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Signing In...</span>';
    loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    loginBtn.disabled = false;
    loginBtn.innerHTML = '<span class="btn-text">Sign In</span> <i class="fas fa-arrow-right btn-icon"></i>';
    loadingOverlay.style.display = 'none';
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        animation: slideIn 0.3s ease-out;
    `;
    
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 20px;
        background: ${getNotificationColor(type)};
        color: ${getNotificationTextColor(type)};
        border-radius: 8px;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.2s ease;
        padding: 4px;
        border-radius: 4px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

function getNotificationColor(type) {
    switch (type) {
        case 'success': return '#D1FAE5';
        case 'error': return '#FEE2E2';
        case 'warning': return '#FEF3C7';
        default: return '#DBEAFE';
    }
}

function getNotificationTextColor(type) {
    switch (type) {
        case 'success': return '#065F46';
        case 'error': return '#991B1B';
        case 'warning': return '#92400E';
        default: return '#1E40AF';
    }
}

// Social login handlers
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const provider = e.currentTarget.querySelector('span').textContent;
        showNotification(`${provider} login would be implemented here`, 'info');
    });
});

// Forgot password handler
document.querySelector('.forgot-password').addEventListener('click', (e) => {
    e.preventDefault();
    showNotification('Password reset functionality would be implemented here', 'info');
});

// Sign up handler
document.querySelector('.signup-btn').addEventListener('click', (e) => {
    e.preventDefault();
    showNotification('Sign up page would be implemented here', 'info');
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .mobile-menu-toggle.active .hamburger:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .mobile-menu-toggle.active .hamburger:nth-child(2) {
        opacity: 0;
    }
    
    .mobile-menu-toggle.active .hamburger:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
    
    @media (max-width: 768px) {
        .nav-menu.active {
            display: block;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            border-radius: 0 0 8px 8px;
        }
        
        .nav-menu.active .nav-list {
            flex-direction: column;
            padding: 1rem 0;
            gap: 0;
        }
        
        .nav-menu.active .nav-link {
            display: block;
            padding: 1rem 2rem;
            border-bottom: 1px solid #f1f5f9;
        }
        
        .nav-menu.active .nav-link:hover {
            background-color: #f8fafc;
        }
    }
`;
document.head.appendChild(style);

// Demo credentials helper
document.addEventListener('DOMContentLoaded', () => {
    // Add demo credentials info
    const demoInfo = document.createElement('div');
    demoInfo.innerHTML = `
        <div style="background: #F0F9FF; border: 1px solid #BAE6FD; border-radius: 8px; padding: 12px; margin-bottom: 16px; font-size: 14px; color: #0369A1;">
            <strong>Demo Credentials:</strong><br>
            Email: demo@projecthub.com<br>
            Password: demo123
        </div>
    `;
    
    const form = document.querySelector('.login-form');
    form.insertBefore(demoInfo, form.firstChild);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'BUTTON' && e.target.type !== 'submit') {
        const form = e.target.closest('form');
        if (form) {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.click();
            }
        }
    }
});

// Auto-focus first input on page load
window.addEventListener('load', () => {
    emailInput.focus();
});