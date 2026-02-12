// ===== تطبيق الملف الشخصي =====
class TelegramApp {
    constructor() {
        this.user = null;
        this.isTelegram = false;
        
        // انتظر حتى يتم تحميل Telegram WebApp
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        console.log('🚀 بدء تهيئة التطبيق...');
        
        // التحقق من Telegram WebApp
        if (window.Telegram?.WebApp) {
            this.isTelegram = true;
            const tg = window.Telegram.WebApp;
            
            // توسيع التطبيق
            tg.expand();
            tg.ready(); // إعلام تلغرام بأن التطبيق جاهز
            
            // جلب بيانات المستخدم
            this.user = tg.initDataUnsafe?.user;
            
            console.log('📱 بيانات تلغرام:', tg.initDataUnsafe);
            
            if (this.user) {
                console.log('✅ تم العثور على المستخدم:', this.user);
                this.updateUI();
            } else {
                console.log('⚠️ لا يوجد مستخدم، استخدام بيانات افتراضية');
                this.setDefaultUser();
            }
        } else {
            console.log('❌ التطبيق يعمل خارج تلغرام');
            this.setDefaultUser();
        }

        this.setupEventListeners();
    }

    // تحديث واجهة المستخدم
    updateUI() {
        const { first_name, last_name, username, id, language_code, photo_url } = this.user;
        
        const fullName = `${first_name} ${last_name || ''}`.trim();
        const initial = first_name ? first_name.charAt(0).toUpperCase() : '👤';

        // ===== تحديث الناف بار =====
        const navInitial = document.getElementById('navInitial');
        const navImg = document.getElementById('navImg');
        
        if (navInitial) navInitial.textContent = initial;
        
        if (photo_url && navImg) {
            navImg.src = photo_url;
            navImg.style.display = 'block';
            navInitial.style.display = 'none';
        }

        // ===== تحديث صفحة الملف الشخصي =====
        const profileInitial = document.getElementById('profileInitial');
        const profileImg = document.getElementById('profileImg');
        
        if (profileInitial) profileInitial.textContent = initial;
        
        if (photo_url && profileImg) {
            profileImg.src = photo_url;
            profileImg.style.display = 'block';
            profileInitial.style.display = 'none';
        }

        // ===== تحديث البيانات النصية =====
        const setText = (id, text) => {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        };

        setText('userName', fullName);
        setText('userUsername', username ? `@${username}` : 'غير متوفر');
        setText('userId', id || '-');
        setText('userLanguage', language_code || 'غير معروف');
    }

    // بيانات افتراضية
    setDefaultUser() {
        const setText = (id, text) => {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        };

        setText('userName', 'زائر');
        setText('userUsername', 'غير متوفر');
        setText('userId', '-');
        setText('userLanguage', '-');
    }

    // ===== إعداد الأحداث =====
    setupEventListeners() {
        console.log('🔧 إعداد مستمعي الأحداث...');

        // فتح صفحة الملف الشخصي
        const navAvatar = document.getElementById('navAvatar');
        const profilePage = document.getElementById('profilePage');
        const closeBtn = document.getElementById('closeBtn');

        if (navAvatar) {
            navAvatar.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🖱️ تم النقر على الصورة!');
                
                if (profilePage) {
                    profilePage.style.display = 'flex';
                    // تأخير بسيط لإضافة الكلاس للأنيميشن
                    setTimeout(() => {
                        profilePage.classList.add('active');
                    }, 10);
                }
            });
            console.log('✅ تم ربط حدث النقر على الصورة');
        } else {
            console.error('❌ لم يتم العثور على navAvatar');
        }

        // إغلاق صفحة الملف الشخصي
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🔘 تم النقر على زر الإغلاق');
                
                if (profilePage) {
                    profilePage.classList.remove('active');
                    setTimeout(() => {
                        profilePage.style.display = 'none';
                    }, 300); // انتظر انتهاء الأنيميشن
                }
            });
        }

        // إغلاق بالنقر خارج الصندوق
        if (profilePage) {
            profilePage.addEventListener('click', (e) => {
                if (e.target === profilePage) {
                    profilePage.classList.remove('active');
                    setTimeout(() => {
                        profilePage.style.display = 'none';
                    }, 300);
                }
            });
        }
    }
}

// ===== تشغيل التطبيق =====
const app = new TelegramApp();

// اختبار بسيط - أضف في نهاية الملف
setTimeout(() => {
    console.log('🧪 اختبار يدوي');
    const navAvatar = document.getElementById('navAvatar');
    console.log('العنصر موجود؟', !!navAvatar);
    
    // محاكاة نقر
    if (navAvatar) {
        navAvatar.style.border = '3px solid red'; // تأكد من ظهوره
    }
}, 1000);
