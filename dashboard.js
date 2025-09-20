// Dashboard Management System
class DashboardManager {
    constructor() {
        this.user = null;
        this.stats = {
            totalReports: 0,
            totalCharts: 0,
            dataProcessed: 0,
            apiCalls: 0
        };
        this.init();
    }

    init() {
        this.checkAuthentication();
        this.loadUserData();
        this.setupEventListeners();
        this.loadDashboardData();
        this.initializeFileUpload();
    }

    checkAuthentication() {
        const authData = this.getAuthData();
        if (!authData.isAuthenticated) {
            window.location.href = 'auth.html';
            return;
        }
        this.user = authData.user;
    }

    getAuthData() {
        const user = localStorage.getItem('mahillm_user');
        const token = localStorage.getItem('mahillm_token');
        const authTime = localStorage.getItem('mahillm_auth_time');

        if (user && token && authTime) {
            const tokenAge = Date.now() - parseInt(authTime);
            const tokenValid = tokenAge < 24 * 60 * 60 * 1000;

            if (tokenValid) {
                return {
                    user: JSON.parse(user),
                    token,
                    isAuthenticated: true
                };
            } else {
                this.clearAuthData();
            }
        }

        return { isAuthenticated: false };
    }

    clearAuthData() {
        localStorage.removeItem('mahillm_user');
        localStorage.removeItem('mahillm_token');
        localStorage.removeItem('mahillm_auth_time');
    }

    loadUserData() {
        if (this.user) {
            // Update user info in header
            const userName = document.getElementById('userName');
            const userEmail = document.getElementById('userEmail');
            const userAvatar = document.getElementById('userAvatar');

            if (userName) userName.textContent = this.user.name || 'User';
            if (userEmail) userEmail.textContent = this.user.email || '';
            if (userAvatar) {
                userAvatar.textContent = (this.user.name || 'U').charAt(0).toUpperCase();
                if (this.user.avatar && this.user.avatar !== 'https://via.placeholder.com/40') {
                    userAvatar.style.backgroundImage = `url(${this.user.avatar})`;
                    userAvatar.style.backgroundSize = 'cover';
                    userAvatar.style.backgroundPosition = 'center';
                }
            }

            // Show admin panel if user is admin
            if (this.user.role === 'admin') {
                const adminPanel = document.getElementById('adminPanel');
                if (adminPanel) adminPanel.style.display = 'block';
            }
        }
    }

    setupEventListeners() {
        // File upload handling
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        }

        // Drag and drop handling
        const uploadArea = document.getElementById('uploadArea');
        if (uploadArea) {
            uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
            uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        }

        // Click outside dropdown to close
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('userDropdown');
            if (dropdown && !e.target.closest('.dropdown')) {
                dropdown.classList.remove('show');
            }
        });
    }

    initializeFileUpload() {
        // Initialize file upload with progress tracking
        console.log('File upload system initialized');
    }

    async loadDashboardData() {
        try {
            // Simulate loading user stats
            await this.loadUserStats();
            this.updateStatsDisplay();
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    async loadUserStats() {
        // Mock API call to get user statistics
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate different stats based on user
                if (this.user && this.user.role === 'admin') {
                    this.stats = {
                        totalReports: 1247,
                        totalCharts: 892,
                        dataProcessed: 156.7,
                        apiCalls: 8934
                    };
                } else {
                    this.stats = {
                        totalReports: 23,
                        totalCharts: 15,
                        dataProcessed: 12.4,
                        apiCalls: 156
                    };
                }
                resolve(this.stats);
            }, 500);
        });
    }

    updateStatsDisplay() {
        const elements = {
            totalReports: document.getElementById('totalReports'),
            totalCharts: document.getElementById('totalCharts'),
            dataProcessed: document.getElementById('dataProcessed'),
            apiCalls: document.getElementById('apiCalls')
        };

        Object.keys(elements).forEach(key => {
            if (elements[key]) {
                const value = this.stats[key];
                this.animateNumber(elements[key], 0, value, 1000);
            }
        });
    }

    animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = start + (end - start) * progress;
            element.textContent = Math.floor(current).toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        };
        requestAnimationFrame(updateNumber);
    }

    handleFileUpload(event) {
        const files = event.target.files;
        if (files.length > 0) {
            this.processFiles(files);
        }
    }

    handleDragOver(event) {
        event.preventDefault();
        event.currentTarget.classList.add('dragover');
    }

    handleDragLeave(event) {
        event.currentTarget.classList.remove('dragover');
    }

    handleDrop(event) {
        event.preventDefault();
        event.currentTarget.classList.remove('dragover');
        
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            this.processFiles(files);
        }
    }

    async processFiles(files) {
        const uploadArea = document.getElementById('uploadArea');
        const originalContent = uploadArea.innerHTML;
        
        // Show upload progress
        uploadArea.innerHTML = `
            <div class="upload-icon">
                <i class="fas fa-spinner fa-spin"></i>
            </div>
            <div class="upload-text">Processing ${files.length} file(s)...</div>
            <div class="upload-subtext">Please wait while we analyze your data</div>
        `;

        try {
            // Simulate file processing
            await this.simulateFileProcessing(files);
            
            // Show success message
            uploadArea.innerHTML = `
                <div class="upload-icon">
                    <i class="fas fa-check-circle" style="color: var(--color-primary);"></i>
                </div>
                <div class="upload-text">Files processed successfully!</div>
                <div class="upload-subtext">${files.length} file(s) uploaded and analyzed</div>
            `;

            // Update stats
            this.stats.totalReports += files.length;
            this.stats.dataProcessed += files.length * 2.5; // Simulate data size
            this.updateStatsDisplay();

            // Add to recent activity
            this.addActivityItem('upload', `Uploaded ${files.length} file(s)`);

            // Reset after 3 seconds
            setTimeout(() => {
                uploadArea.innerHTML = originalContent;
            }, 3000);

        } catch (error) {
            // Show error message
            uploadArea.innerHTML = `
                <div class="upload-icon">
                    <i class="fas fa-exclamation-triangle" style="color: var(--color-secondary);"></i>
                </div>
                <div class="upload-text">Upload failed</div>
                <div class="upload-subtext">Please try again</div>
            `;

            setTimeout(() => {
                uploadArea.innerHTML = originalContent;
            }, 3000);
        }
    }

    async simulateFileProcessing(files) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    }

    addActivityItem(type, description) {
        const activityList = document.getElementById('activityList');
        if (!activityList) return;

        const icons = {
            upload: 'fas fa-upload',
            report: 'fas fa-file-alt',
            chart: 'fas fa-chart-bar',
            download: 'fas fa-download',
            share: 'fas fa-share'
        };

        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <div class="activity-icon">
                <i class="${icons[type] || 'fas fa-circle'}"></i>
            </div>
            <div class="activity-content">
                <h5>${description}</h5>
                <p>Just now</p>
            </div>
        `;

        activityList.insertBefore(activityItem, activityList.firstChild);
    }

    // Admin functions
    manageUsers() {
        alert('User management system would open here');
        console.log('Managing users...');
    }

    systemAnalytics() {
        alert('System analytics dashboard would open here');
        console.log('Opening system analytics...');
    }

    modelConfig() {
        alert('Model configuration panel would open here');
        console.log('Opening model configuration...');
    }

    apiManagement() {
        alert('API management interface would open here');
        console.log('Opening API management...');
    }

    databaseManagement() {
        alert('Database management console would open here');
        console.log('Opening database management...');
    }

    systemLogs() {
        alert('System logs viewer would open here');
        console.log('Opening system logs...');
    }
}

// Global functions
function toggleDropdown() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

function logout() {
    if (confirm('Are you sure you want to sign out?')) {
        // Clear auth data
        localStorage.removeItem('mahillm_user');
        localStorage.removeItem('mahillm_token');
        localStorage.removeItem('mahillm_auth_time');
        
        // Redirect to home page
        window.location.href = 'index.html';
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DashboardManager();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardManager;
}
