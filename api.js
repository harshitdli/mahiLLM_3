// Mock API for MahiLLM Backend
class MahiLLMAPI {
    constructor() {
        this.baseURL = 'https://api.mahillm.com'; // Replace with actual API URL
        this.mockData = this.initializeMockData();
    }

    initializeMockData() {
        return {
            users: [
                {
                    id: '1',
                    email: 'admin@mahillm.com',
                    name: 'Admin User',
                    role: 'admin',
                    avatar: 'https://via.placeholder.com/40',
                    createdAt: new Date('2024-01-01'),
                    lastLogin: new Date(),
                    stats: {
                        reportsGenerated: 1247,
                        chartsCreated: 892,
                        dataProcessed: 156.7,
                        apiCalls: 8934
                    }
                },
                {
                    id: '2',
                    email: 'user@example.com',
                    name: 'Demo User',
                    role: 'user',
                    avatar: 'https://via.placeholder.com/40',
                    createdAt: new Date('2024-01-15'),
                    lastLogin: new Date(),
                    stats: {
                        reportsGenerated: 23,
                        chartsCreated: 15,
                        dataProcessed: 12.4,
                        apiCalls: 156
                    }
                }
            ],
            reports: [
                {
                    id: '1',
                    userId: '2',
                    title: 'Sales Analysis Q3',
                    type: 'sales',
                    status: 'completed',
                    createdAt: new Date(),
                    fileSize: 2.5,
                    insights: [
                        'Revenue increased by 23%',
                        'Top performing category: Technology',
                        'Customer satisfaction: 94%'
                    ]
                },
                {
                    id: '2',
                    userId: '2',
                    title: 'Customer Demographics',
                    type: 'demographics',
                    status: 'completed',
                    createdAt: new Date(Date.now() - 86400000),
                    fileSize: 1.8,
                    insights: [
                        'Age group 25-34 dominates',
                        'Geographic spread: 60% urban',
                        'Gender distribution: 55% female'
                    ]
                }
            ],
            analytics: {
                totalUsers: 1247,
                activeUsers: 892,
                totalReports: 5634,
                totalCharts: 8934,
                totalDataProcessed: 156.7,
                systemUptime: 99.9,
                averageResponseTime: 1.2
            }
        };
    }

    // Authentication endpoints
    async authenticate(email, password) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const user = this.mockData.users.find(u => u.email === email);
                
                if (user && this.validatePassword(password)) {
                    const token = this.generateToken(user);
                    resolve({
                        success: true,
                        user: {
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            role: user.role,
                            avatar: user.avatar
                        },
                        token
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Invalid credentials'
                    });
                }
            }, 1000);
        });
    }

    async authenticateWithProvider(provider, token) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockUser = {
                    id: Date.now().toString(),
                    email: `user@${provider}.com`,
                    name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
                    role: 'user',
                    avatar: `https://via.placeholder.com/40`,
                    provider
                };

                const jwtToken = this.generateToken(mockUser);
                resolve({
                    success: true,
                    user: mockUser,
                    token: jwtToken
                });
            }, 1000);
        });
    }

    // User management endpoints
    async getUsers(page = 1, limit = 10) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const startIndex = (page - 1) * limit;
                const endIndex = startIndex + limit;
                const users = this.mockData.users.slice(startIndex, endIndex);
                
                resolve({
                    success: true,
                    users,
                    pagination: {
                        page,
                        limit,
                        total: this.mockData.users.length,
                        pages: Math.ceil(this.mockData.users.length / limit)
                    }
                });
            }, 500);
        });
    }

    async createUser(userData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newUser = {
                    id: Date.now().toString(),
                    ...userData,
                    createdAt: new Date(),
                    lastLogin: new Date(),
                    stats: {
                        reportsGenerated: 0,
                        chartsCreated: 0,
                        dataProcessed: 0,
                        apiCalls: 0
                    }
                };

                this.mockData.users.push(newUser);
                resolve({
                    success: true,
                    user: newUser
                });
            }, 800);
        });
    }

    async updateUser(userId, updateData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const userIndex = this.mockData.users.findIndex(u => u.id === userId);
                
                if (userIndex !== -1) {
                    this.mockData.users[userIndex] = {
                        ...this.mockData.users[userIndex],
                        ...updateData
                    };
                    resolve({
                        success: true,
                        user: this.mockData.users[userIndex]
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'User not found'
                    });
                }
            }, 600);
        });
    }

    async deleteUser(userId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const userIndex = this.mockData.users.findIndex(u => u.id === userId);
                
                if (userIndex !== -1) {
                    this.mockData.users.splice(userIndex, 1);
                    resolve({
                        success: true,
                        message: 'User deleted successfully'
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'User not found'
                    });
                }
            }, 600);
        });
    }

    // Report management endpoints
    async getReports(userId = null, page = 1, limit = 10) {
        return new Promise((resolve) => {
            setTimeout(() => {
                let reports = this.mockData.reports;
                
                if (userId) {
                    reports = reports.filter(r => r.userId === userId);
                }

                const startIndex = (page - 1) * limit;
                const endIndex = startIndex + limit;
                const paginatedReports = reports.slice(startIndex, endIndex);
                
                resolve({
                    success: true,
                    reports: paginatedReports,
                    pagination: {
                        page,
                        limit,
                        total: reports.length,
                        pages: Math.ceil(reports.length / limit)
                    }
                });
            }, 500);
        });
    }

    async createReport(userId, reportData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newReport = {
                    id: Date.now().toString(),
                    userId,
                    ...reportData,
                    status: 'processing',
                    createdAt: new Date()
                };

                this.mockData.reports.push(newReport);
                resolve({
                    success: true,
                    report: newReport
                });
            }, 1000);
        });
    }

    // Analytics endpoints
    async getAnalytics() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    analytics: this.mockData.analytics
                });
            }, 300);
        });
    }

    async getUserAnalytics(userId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const user = this.mockData.users.find(u => u.id === userId);
                
                if (user) {
                    resolve({
                        success: true,
                        analytics: user.stats
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'User not found'
                    });
                }
            }, 400);
        });
    }

    // System management endpoints
    async getSystemHealth() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    health: {
                        status: 'healthy',
                        uptime: '99.9%',
                        responseTime: '1.2s',
                        memoryUsage: '68%',
                        cpuUsage: '45%',
                        activeConnections: 1247,
                        lastBackup: new Date(Date.now() - 3600000)
                    }
                });
            }, 200);
        });
    }

    async getSystemLogs(page = 1, limit = 50) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockLogs = [
                    {
                        id: '1',
                        timestamp: new Date(),
                        level: 'info',
                        message: 'User authentication successful',
                        userId: '2',
                        ip: '192.168.1.1'
                    },
                    {
                        id: '2',
                        timestamp: new Date(Date.now() - 300000),
                        level: 'info',
                        message: 'Report generated successfully',
                        userId: '2',
                        reportId: '1'
                    },
                    {
                        id: '3',
                        timestamp: new Date(Date.now() - 600000),
                        level: 'warning',
                        message: 'High memory usage detected',
                        system: true
                    }
                ];

                const startIndex = (page - 1) * limit;
                const endIndex = startIndex + limit;
                const paginatedLogs = mockLogs.slice(startIndex, endIndex);
                
                resolve({
                    success: true,
                    logs: paginatedLogs,
                    pagination: {
                        page,
                        limit,
                        total: mockLogs.length,
                        pages: Math.ceil(mockLogs.length / limit)
                    }
                });
            }, 400);
        });
    }

    // Utility methods
    validatePassword(password) {
        // Mock password validation
        return password === 'admin123' || password === 'password123';
    }

    generateToken(user) {
        // Mock JWT token generation
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role,
            exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };
        
        return Buffer.from(JSON.stringify(payload)).toString('base64');
    }

    verifyToken(token) {
        try {
            const payload = JSON.parse(Buffer.from(token, 'base64').toString());
            
            if (payload.exp < Date.now()) {
                return { valid: false, reason: 'expired' };
            }
            
            return { valid: true, payload };
        } catch (error) {
            return { valid: false, reason: 'invalid' };
        }
    }

    // Database management
    async getDatabaseStats() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    stats: {
                        totalUsers: this.mockData.users.length,
                        totalReports: this.mockData.reports.length,
                        databaseSize: '156.7 MB',
                        lastBackup: new Date(Date.now() - 3600000),
                        connectionPool: {
                            active: 45,
                            idle: 5,
                            total: 50
                        },
                        queryPerformance: {
                            averageResponseTime: '12ms',
                            slowQueries: 3,
                            cacheHitRate: '94.2%'
                        }
                    }
                });
            }, 300);
        });
    }

    async backupDatabase() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: 'Database backup initiated',
                    backupId: Date.now().toString(),
                    estimatedTime: '5-10 minutes'
                });
            }, 500);
        });
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MahiLLMAPI;
} else {
    window.MahiLLMAPI = MahiLLMAPI;
}
