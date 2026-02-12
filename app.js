// ==========================================
// تطبيق Mini App - نظام النقاط والملف الشخصي
// ==========================================

// ===== المتغيرات العامة =====
let userData = null;
let userPoints = 0;
const POINTS_KEY = 'telegram_app_points';

// ==========================================
// التحدي 1: عند تحميل الصفحة
// ==========================================
window.onload = function() {
    console.log('✅ الصفحة محملة');
    
    // تحميل النقاط المحفوظة
    loadPoints();
    
    // جلب بيانات تلغرام
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.expand();
        
        userData = tg.initDataUnsafe?.user;
        console.log('بيانات المستخدم:', userData);
        
        if (userData) {
            updateProfile(userData);
        }
    } else {
        console.log('⚠️ لا يوجد Telegram WebApp');
    }
};

// ==========================================
// التحدي 2: نظام النقاط
// ==========================================

// تحميل النقاط من LocalStorage
function loadPoints() {
    const saved = localStorage.getItem(POINTS_KEY);
    if (saved) {
        userPoints = parseInt(saved);
        console.log('📦 النقاط المحفوظة:', userPoints);
    }
    updatePointsDisplay();
}

// حفظ النقاط في LocalStorage
function savePoints() {
    localStorage.setItem(POINTS_KEY, userPoints);
    console.log('💾 تم حفظ النقاط:', userPoints);
}

// تحديث عرض النقاط في جميع الأماكن
function updatePointsDisplay() {
    const navDisplay = document.getElementById('pointsDisplay');
    const totalDisplay = document.getElementById('totalDisplay');
    
    if (navDisplay) navDisplay.textContent = userPoints;
    if (totalDisplay) totalDisplay.textContent = userPoints;
}

// إضافة نقطة مع تأثيرات بصرية
function addPoint() {
    const coin = document.getElementById('coin');
    
    // 1. زيادة النقاط
    userPoints += 1;
    updatePointsDisplay();
    
    // 2. تأثير الدوران
    coin.classList.add('spin');
    setTimeout(() => coin.classList.remove('spin'), 600);
    
    // 3. إنشاء جسيمات ذهبية
    createParticles(coin);
    
    // 4. تأثير الاهتزاز
    if (navigator.vibrate) {
        navigator.vibrate(50); // اهتزاز للهواتف
    }
    
    // 5. حفظ البيانات
    localStorage.setItem('points', userPoints);
    
    console.log('⭐ نقطة جديدة! المجموع:', userPoints);
}

// إنشاء جسيمات ذهبية
function createParticles(coin) {
    const rect = coin.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // اتجاه عشوائي
        const angle = (i / 8) * Math.PI * 2;
        const distance = 100 + Math.random() * 50;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        particle.style.setProperty('--x', `${x}px`);
        particle.style.setProperty('--y', `${y}px`);
        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;
        
        // لون عشوائي ذهبي/برتقالي
        const colors = ['#ffd700', '#ffed4e', '#ff6b6b', '#4ecdc4'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        document.body.appendChild(particle);
        
        // إزالة بعد الانتهاء
        setTimeout(() => particle.remove(), 800);
    }
}
    
    console.log('⭐ نقطة جديدة! المجموع:', userPoints);
}

// ==========================================
// التحدي 3: الملف الشخصي
// ==========================================

// تحديث بيانات الملف الشخصي
function updateProfile(user) {
    const name = user.first_name + ' ' + (user.last_name || '');
    const initial = user.first_name ? user.first_name.charAt(0).toUpperCase() : '👤';
    
    // تحديث الناف بار
    const navInitial = document.getElementById('navInitial');
    const navImg = document.getElementById('navImg');
    
    if (navInitial) navInitial.textContent = initial;
    if (user.photo_url && navImg) {
        navImg.src = user.photo_url;
        navImg.style.display = 'block';
        navInitial.style.display = 'none';
    }
    
    // تحديث صفحة الملف الشخصي
    const profileInitial = document.getElementById('profileInitial');
    const profileImg = document.getElementById('profileImg');
    
    if (profileInitial) profileInitial.textContent = initial;
    if (user.photo_url && profileImg) {
        profileImg.src = user.photo_url;
        profileImg.style.display = 'block';
        profileInitial.style.display = 'none';
    }
    
    // تحديث النصوص
    setText('userName', name);
    setText('userUsername', user.username ? '@' + user.username : 'غير متوفر');
    setText('userId', user.id || '-');
    setText('userLanguage', user.language_code || 'غير معروف');
}

// دالة مساعدة لتعيين النص
function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

// فتح صفحة الملف الشخصي
function openProfile() {
    console.log('🖱️ تم النقر على الصورة!');
    const overlay = document.getElementById('profileOverlay');
    if (overlay) overlay.style.display = 'flex';
}

// إغلاق صفحة الملف الشخصي
function closeProfile() {
    const overlay = document.getElementById('profileOverlay');
    if (overlay) overlay.style.display = 'none';
}

// إغلاق بالنقر خارج الصندوق
function closeProfileOutside(event) {
    if (event.target.id === 'profileOverlay') {
        closeProfile();
    }
}
