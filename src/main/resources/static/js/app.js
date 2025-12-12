const API_BASE_URL = 'http://localhost:8080/api';

const TokenManager = {
    setToken(token) { localStorage.setItem('authToken', token); },
    getToken() { return localStorage.getItem('authToken'); },
    removeToken() { localStorage.removeItem('authToken'); },
    setUserInfo(userInfo) { localStorage.setItem('userInfo', JSON.stringify(userInfo)); },
    getUserInfo() { return JSON.parse(localStorage.getItem('userInfo') || 'null'); },
    removeUserInfo() { localStorage.removeItem('userInfo'); },
    isAuthenticated() { return !!this.getToken(); }
};

const API = {
    async request(endpoint, options = {}) {
        const token = TokenManager.getToken();
        const headers = { 'Content-Type': 'application/json', ...options.headers };
        if (token && !options.skipAuth) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
        if (response.status === 401) {
            TokenManager.removeToken();
            TokenManager.removeUserInfo();
            window.location.href = '/index.html';
        }
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Request failed');
        return data;
    },
    get(endpoint) { return this.request(endpoint, { method: 'GET' }); },
    post(endpoint, body, skipAuth = false) { return this.request(endpoint, { method: 'POST', body: JSON.stringify(body), skipAuth }); },
    put(endpoint, body) { return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body) }); },
    delete(endpoint) { return this.request(endpoint, { method: 'DELETE' }); }
};

// Theme Management
function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    }
}

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
}

// Auth Page Logic
if (location.pathname === '/' || location.pathname.includes('index.html')) {
    if (TokenManager.isAuthenticated()) window.location.href = '/dashboard.html';

    document.addEventListener('DOMContentLoaded', () => {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        document.getElementById('showRegister').addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
        });
        document.getElementById('showLogin').addEventListener('click', (e) => {
            e.preventDefault();
            registerForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        });

        document.getElementById('loginFormElement').addEventListener('submit', async (e) => {
            e.preventDefault();
            const errorEl = document.getElementById('loginError');
            errorEl.classList.add('hidden');
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            try {
                const res = await API.post('/auth/login', { username, password }, true);
                TokenManager.setToken(res.token);
                TokenManager.setUserInfo(res);  // Adjust based on backend response
                window.location.href = '/dashboard.html';
            } catch (err) {
                errorEl.textContent = err.message;
                errorEl.classList.remove('hidden');
            }
        });

    });
}

// Dashboard Shared Logic
if (location.pathname.includes('dashboard.html')) {
    if (!TokenManager.isAuthenticated()) window.location.href = '/index.html';

    document.addEventListener('DOMContentLoaded', () => {
        const userInfo = TokenManager.getUserInfo();
        if (userInfo) document.getElementById('userWelcome').textContent = `Welcome, ${userInfo.username || 'User'}`;

        document.getElementById('logoutBtn').addEventListener('click', () => {
            TokenManager.removeToken();
            TokenManager.removeUserInfo();
            window.location.href = '/index.html';
        });

        document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    });
}

initTheme();