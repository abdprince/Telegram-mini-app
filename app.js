// ==========================================
// تطبيق Mini App + Supabase Database
// ==========================================

// ===== إعداد Supabase =====
const SUPABASE_URL = 'https://ijbrvdeowesiriqyissb.supabase.co'; // ← ضع رابطك هنا
const SUPABASE_KEY = 'sb_publishable_yiPtNm3_-_Wl_eTHF92qPg_EMRhYEE6'; // ← ضع المفتاح هنا

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ===== المتغيرات العامة =====
let userData = null;
let userPoints = 0;
let dbUserId = null; // معرف المستخدم في قاعدة البيانات

// ==========================================
// عند تحميل الصفحة
// ==========================================
window.onload = async function() {
    console.log('✅ الصفحة محملة');
    
    // جلب بيانات تلغرام أولاً
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.expand();
        
        userData = tg.initDataUnsafe?.user;
        console.log('📱 بيانات تلغرام:', userData);
        
        if (userData) {
            updateProfile(userData);
            // ✅ ربط مع قاعدة البيانات
            await syncUserWithDatabase();
        }
    } else {
        console.log('⚠️ لا يوجد Telegram WebApp');
        // تحميل من LocalStorage كاحتياطي
        loadPointsFromLocal();
    }
};

// ==========================================
// التحدي 2: ربط المستخدم بقاعدة البيانات
// ==========================================

async function syncUserWithDatabase() {
    try {
        const telegramId = userData.id;
        
        // 1. البحث عن المستخدم
        let { data: existingUser, error: selectError } = await supabase
            .from('users')
            .select('*')
            .eq('telegram_id', telegramId)
            .single();
        
        if (selectError && selectError.code !== 'PGRST116') {
            // خطأ غير متوقع
            throw selectError;
        }
        
        if (existingUser) {
            // ✅ المستخدم موجود، تحديث البيانات
            console.log('👤 مستخدم موجود:', existingUser);
            dbUserId = existingUser.id;
            userPoints = existingUser.points || 0;
            
            // تحديث الاسم والصورة إذا تغيرت
            await supabase
                .from('users')
                .update({
                    name: `${userData.first_name} ${userData.last_name || ''}`.trim(),
                    username: userData.username,
                    photo_url: userData.photo_url,
                    language: userData.language_code
                })
                .eq('id', dbUserId);
                
        } else {
            // ❌ مستخدم جديد، إنشاء سجل
            console.log('🆕 مستخدم جديد، إنشاء سجل...');
            
            const { data: newUser, error: insertError } = await supabase
                .from('users')
                .insert([
                    {
                        telegram_id: telegramId,
                        name: `${userData.first_name} ${userData.last_name || ''}`.trim(),
                        username: userData.username,
                        language: userData.language_code,
                        photo_url: userData.photo_url,
                        points: 0
                    }
                ])
                .select()
                .single();
            
            if (insertError) throw insertError;
            
            dbUserId = newUser.id;
            userPoints = 0;
            console.log('✅ تم إنشاء المستخدم:', newUser);
        }
        
        // تحديث الواجهة
        updatePointsDisplay();
        
        // حفظ في LocalStorage كنسخة احتياطية
        localStorage.setItem('telegram_id', telegramId);
        localStorage.setItem('points', userPoints);
        
    } catch (error) {
        console.error('❌ خطأ في قاعدة البيانات:', error);
        // الاحتياط: استخدام LocalStorage
        loadPointsFromLocal();
    }
}

// ==========================================
// التحدي 3: نظام النقاط مع قاعدة البيانات
// ==========================================

async function addPoint() {
    // تأثير بصري فوري
    userPoints += 1;
    updatePointsDisplay();
    
    // تأثير الزر
    const btn = document.getElementById('collectBtn');
    if (btn) {
        btn.style.transform = 'scale(0.9)';
        setTimeout(() => btn.style.transform = 'scale(1)', 100);
    }
    
    console.log('⭐ نقطة جديدة! المجموع:', userPoints);
    
    // ✅ تحديث قاعدة البيانات
    if (dbUserId) {
        try {
            const { error } = await supabase
                .from('users')
                .update({ points: userPoints })
                .eq('id', dbUserId);
            
            if (error) throw error;
            
            // تحديث LocalStorage كنسخة احتياطية
            localStorage.setItem('points', userPoints);
            console.log('💾 تم حفظ النقاط في السحابة');
            
        } catch (error) {
            console.error('❌ فشل الحفظ في السحابة:', error);
            localStorage.setItem('points', userPoints); // احتياطي
        }
    } else {
        // لا يوجد اتصال، احفظ محلياً فقط
        localStorage.setItem('points', userPoints);
    }
}

function updatePointsDisplay() {
    const navDisplay = document.getElementById('pointsDisplay');
    const totalDisplay = document.getElementById('totalDisplay');
    
    if (navDisplay) navDisplay.textContent = userPoints;
    if (totalDisplay) totalDisplay.textContent = userPoints;
}

function loadPointsFromLocal() {
    const saved = localStorage.getItem('points');
    if (saved) {
        userPoints = parseInt(saved);
        updatePointsDisplay();
        console.log('📦 تحميل من LocalStorage:', userPoints);
    }
}

// ==========================================
// الملف الشخصي (كما هو)
// ==========================================
function updateProfile(user) {
    const name = `${user.first_name} ${user.last_name || ''}`.trim();
    const initial = user.first_name ? user.first_name.charAt(0).toUpperCase() : '👤';
    
    const navInitial = document.getElementById('navInitial');
    const navImg = document.getElementById('navImg');
    
    if (navInitial) navInitial.textContent = initial;
    if (user.photo_url && navImg) {
        navImg.src = user.photo_url;
        navImg.style.display = 'block';
        navInitial.style.display = 'none';
    }
    
    const profileInitial = document.getElementById('profileInitial');
    const profileImg = document.getElementById('profileImg');
    
    if (profileInitial) profileInitial.textContent = initial;
    if (user.photo_url && profileImg) {
        profileImg.src = user.photo_url;
        profileImg.style.display = 'block';
        profileInitial.style.display = 'none';
    }
    
    setText('userName', name);
    setText('userUsername', user.username ? '@' + user.username : 'غير متوفر');
    setText('userId', user.id || '-');
    setText('userLanguage', user.language_code || 'غير معروف');
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function openProfile() {
    document.getElementById('profileOverlay').style.display = 'flex';
}

function closeProfile() {
    document.getElementById('profileOverlay').style.display = 'none';
}

function closeProfileOutside(event) {
    if (event.target.id === 'profileOverlay') {
        closeProfile();
    }
}
