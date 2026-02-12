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

// إضافة نقطة جديدة
function addPoint() {
    userPoints += 1;
    updatePointsDisplay();
    savePoints();
    
    // تأثير بصري على الزر
    const btn = document.getElementById('collectBtn');
    if (btn) {
        btn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 100);
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
