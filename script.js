// ===== تطبيق الملف الشخصي =====
class TelegramApp {
    constructor() {
        this.user = null;
        this.init();
    }

    init() {
        // تهيئة Telegram WebApp
        if (window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp;
            tg.expand(); // توسيع التطبيق
            
            // جلب بيانات المستخدم
            this.user = tg.initDataUnsafe?.user;
            
            if (this.user) {
                this.updateUI();
                console.log('✅ تم جلب بيانات المستخدم:', this.user);
            } else {
                console.log('❌ لم يتم العثور على بيانات المستخدم');
                this.setDefaultUser();
            }
        } else {
            console.log('⚠️ التطبيق يعمل خارج تلغرام');
            this.setDefaultUser();
        }

        this.setupEventListeners();
    }

    // تحديث واجهة المستخدم
    updateUI() {
        const { first_name, last_name, username, id, language_code, photo_url } = this.user;
        
        const fullName = `${first_name} ${last_name || ''}`.trim();
        const initial = first_name.charAt(0).toUpperCase();

        // تحديث الناف بار
        document.getElementById('navInitial').textContent = initial;
        
        if (photo_url) {
            document.getElementById('navImg').src = photo_url;
            document.getElementById('navImg').style.display = 'block';
            document.getElementById('navInitial').style.display = 'none';
        }

        // تحديث صفحة الملف الشخصي
        document.getElementById('profileInitial').textContent = initial;
        
        if (photo_url) {
            document.getElementById('profileImg').src = photo_url;
            document.getElementById('profileImg').style.display = 'block';
            document.getElementById('profileInitial').style.display = 'none';
        }

        // تحديث البيانات النصية
        document.getElementById('userName').textContent = fullName;
        document.getElementById('userUsername').textContent = username ? `@${username}` : 'غير متوفر';
        document.getElementById('userId').textContent = id;
        document.getElementById('userLanguage').textContent = language_code || 'غير معروف';
    }

    // بيانات افتراضية إذا لم يكن هناك تلغرام
    setDefaultUser() {
        document.getElementById('userName').textContent = 'زائر';
        document.getElementById('userUsername').textContent = 'غير متوفر';
        document.getElementById('userId').textContent = '-';
        document.getElementById('userLanguage').textContent = '-';
    }

    // إعداد مستمعي الأحداث
    setupEventListeners() {
        // فتح صفحة الملف الشخصي
        document.getElementById('navAvatar').addEventListener('click', () => {
            document.getElementById('profilePage').classList.add('active');
        });

        // إغلاق صفحة الملف الشخصي
        document.getElementById('closeBtn').addEventListener('click', () => {
            document.getElementById('profilePage').classList.remove('active');
        });

        // إغلاق بالنقر خارج الصندوق
        document.getElementById('profilePage').addEventListener('click', (e) => {
            if (e.target === document.getElementById('profilePage')) {
                document.getElementById('profilePage').classList.remove('active');
            }
        });
    }
}

// تشغيل التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    new TelegramApp();
});
