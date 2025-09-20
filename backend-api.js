// Backend API for MahiLLM - Session Management and Database Operations
import { authService } from './firebase-config.js';

class MahiLLMBackendAPI {
    constructor() {
        this.baseURL = 'https://api.mahillm.com'; // Replace with your actual backend URL
        this.apiVersion = 'v1';
        this.timeout = 10000; // 10 seconds
    }

    // Generic API request method
    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}/${this.apiVersion}${endpoint}`;
        
        // Get Firebase ID token for authentication
        const idToken = await this.getIdToken();
        
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
                'X-API-Version': this.apiVersion,
                'X-Client-Type': 'web'
            },
            timeout: this.timeout
        };

        const requestOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers
            }
        };

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const response = await fetch(url, {
                ...requestOptions,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('API request failed:', error);
            return { 
                success: false, 
                error: error.message,
                code: error.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK_ERROR'
            };
        }
    }

    // Get Firebase ID token
    async getIdToken() {
        try {
            return await authService.getIdToken();
        } catch (error) {
            console.error('Failed to get ID token:', error);
            throw new Error('Authentication required');
        }
    }

    // User Management API
    async getUserProfile() {
        return await this.makeRequest('/user/profile');
    }

    async updateUserProfile(profileData) {
        return await this.makeRequest('/user/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }

    async deleteUserAccount() {
        return await this.makeRequest('/user/account', {
            method: 'DELETE'
        });
    }

    async getUserStats() {
        return await this.makeRequest('/user/stats');
    }

    async updateUserStats(statsData) {
        return await this.makeRequest('/user/stats', {
            method: 'PUT',
            body: JSON.stringify(statsData)
        });
    }

    // Session Management API
    async createSession(sessionData) {
        return await this.makeRequest('/sessions', {
            method: 'POST',
            body: JSON.stringify({
                ...sessionData,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                ipAddress: await this.getClientIP()
            })
        });
    }

    async getActiveSessions() {
        return await this.makeRequest('/sessions/active');
    }

    async terminateSession(sessionId) {
        return await this.makeRequest(`/sessions/${sessionId}`, {
            method: 'DELETE'
        });
    }

    async terminateAllSessions() {
        return await this.makeRequest('/sessions/terminate-all', {
            method: 'DELETE'
        });
    }

    // Report Management API
    async createReport(reportData) {
        return await this.makeRequest('/reports', {
            method: 'POST',
            body: JSON.stringify({
                ...reportData,
                createdAt: new Date().toISOString()
            })
        });
    }

    async getReports(filters = {}) {
        const queryParams = new URLSearchParams(filters);
        return await this.makeRequest(`/reports?${queryParams}`);
    }

    async getReport(reportId) {
        return await this.makeRequest(`/reports/${reportId}`);
    }

    async updateReport(reportId, updateData) {
        return await this.makeRequest(`/reports/${reportId}`, {
            method: 'PUT',
            body: JSON.stringify(updateData)
        });
    }

    async deleteReport(reportId) {
        return await this.makeRequest(`/reports/${reportId}`, {
            method: 'DELETE'
        });
    }

    // File Upload API
    async uploadFile(file, metadata = {}) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('metadata', JSON.stringify(metadata));

        const idToken = await this.getIdToken();
        
        try {
            const response = await fetch(`${this.baseURL}/${this.apiVersion}/files/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${idToken}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.status}`);
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('File upload failed:', error);
            return { success: false, error: error.message };
        }
    }

    async processFile(fileId, processingOptions = {}) {
        return await this.makeRequest(`/files/${fileId}/process`, {
            method: 'POST',
            body: JSON.stringify(processingOptions)
        });
    }

    async getFileStatus(fileId) {
        return await this.makeRequest(`/files/${fileId}/status`);
    }

    async downloadFile(fileId) {
        const idToken = await this.getIdToken();
        
        try {
            const response = await fetch(`${this.baseURL}/${this.apiVersion}/files/${fileId}/download`, {
                headers: {
                    'Authorization': `Bearer ${idToken}`
                }
            });

            if (!response.ok) {
                throw new Error(`Download failed: ${response.status}`);
            }

            return { success: true, blob: await response.blob() };
        } catch (error) {
            console.error('File download failed:', error);
            return { success: false, error: error.message };
        }
    }

    // Analytics API
    async getAnalytics(timeRange = '30d') {
        return await this.makeRequest(`/analytics?range=${timeRange}`);
    }

    async getUserAnalytics(userId, timeRange = '30d') {
        return await this.makeRequest(`/analytics/user/${userId}?range=${timeRange}`);
    }

    async getSystemMetrics() {
        return await this.makeRequest('/analytics/system');
    }

    // Usage Tracking API
    async trackUsage(usageData) {
        return await this.makeRequest('/usage/track', {
            method: 'POST',
            body: JSON.stringify({
                ...usageData,
                timestamp: new Date().toISOString()
            })
        });
    }

    async getUsageStats(timeRange = '30d') {
        return await this.makeRequest(`/usage/stats?range=${timeRange}`);
    }

    async checkUsageLimits() {
        return await this.makeRequest('/usage/limits');
    }

    // Subscription Management API
    async getSubscription() {
        return await this.makeRequest('/subscription');
    }

    async updateSubscription(subscriptionData) {
        return await this.makeRequest('/subscription', {
            method: 'PUT',
            body: JSON.stringify(subscriptionData)
        });
    }

    async cancelSubscription() {
        return await this.makeRequest('/subscription/cancel', {
            method: 'POST'
        });
    }

    // API Key Management
    async generateAPIKey(keyData) {
        return await this.makeRequest('/api-keys', {
            method: 'POST',
            body: JSON.stringify(keyData)
        });
    }

    async getAPIKeys() {
        return await this.makeRequest('/api-keys');
    }

    async revokeAPIKey(keyId) {
        return await this.makeRequest(`/api-keys/${keyId}`, {
            method: 'DELETE'
        });
    }

    async getAPIKeyUsage(keyId) {
        return await this.makeRequest(`/api-keys/${keyId}/usage`);
    }

    // Admin API (requires admin role)
    async getUsers(filters = {}) {
        return await this.makeRequest('/admin/users', {
            method: 'POST',
            body: JSON.stringify(filters)
        });
    }

    async updateUserRole(userId, role) {
        return await this.makeRequest(`/admin/users/${userId}/role`, {
            method: 'PUT',
            body: JSON.stringify({ role })
        });
    }

    async suspendUser(userId, reason) {
        return await this.makeRequest(`/admin/users/${userId}/suspend`, {
            method: 'POST',
            body: JSON.stringify({ reason })
        });
    }

    async getSystemLogs(filters = {}) {
        return await this.makeRequest('/admin/logs', {
            method: 'POST',
            body: JSON.stringify(filters)
        });
    }

    async getSystemHealth() {
        return await this.makeRequest('/admin/health');
    }

    async backupDatabase() {
        return await this.makeRequest('/admin/backup', {
            method: 'POST'
        });
    }

    // Utility methods
    async getClientIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error('Failed to get client IP:', error);
            return 'unknown';
        }
    }

    // Error handling
    handleAPIError(error, context = '') {
        console.error(`API Error ${context}:`, error);
        
        const errorMessages = {
            'NETWORK_ERROR': 'Network connection failed. Please check your internet connection.',
            'TIMEOUT': 'Request timed out. Please try again.',
            'UNAUTHORIZED': 'Authentication failed. Please sign in again.',
            'FORBIDDEN': 'You do not have permission to perform this action.',
            'NOT_FOUND': 'The requested resource was not found.',
            'RATE_LIMITED': 'Too many requests. Please wait before trying again.',
            'SERVER_ERROR': 'Server error. Please try again later.'
        };

        return errorMessages[error.code] || 'An unexpected error occurred.';
    }

    // Retry mechanism for failed requests
    async retryRequest(requestFn, maxRetries = 3, delay = 1000) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const result = await requestFn();
                if (result.success) {
                    return result;
                }
                
                if (attempt === maxRetries) {
                    return result;
                }
                
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, delay * attempt));
            } catch (error) {
                if (attempt === maxRetries) {
                    return { success: false, error: error.message };
                }
                
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, delay * attempt));
            }
        }
    }

    // Batch operations
    async batchRequest(requests) {
        const promises = requests.map(request => this.makeRequest(request.endpoint, request.options));
        
        try {
            const results = await Promise.allSettled(promises);
            return results.map((result, index) => ({
                request: requests[index],
                success: result.status === 'fulfilled',
                data: result.status === 'fulfilled' ? result.value : null,
                error: result.status === 'rejected' ? result.reason : null
            }));
        } catch (error) {
            console.error('Batch request failed:', error);
            return { success: false, error: error.message };
        }
    }
}

// Create and export API instance
export const backendAPI = new MahiLLMBackendAPI();

// Export for use in other modules
export default backendAPI;
