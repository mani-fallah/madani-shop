const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const errorController = require('./controllers/error');
const shopRouter = require('./routes/shop');
const adminRouter = require('./routes/admin');

const app = express();

// تنظیم view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// پارس‌کردن body
app.use(bodyParser.urlencoded({ extended: false }));

// فایل‌های استاتیک
app.use(express.static(path.join(__dirname, 'public')));

// ---------- تنظیم SESSION روی دیتابیس MySQL ----------
const sessionStore = new MySQLStore({
    host: 'localhost',
    user: 'root',
    database: 'madani_shop', // همون دیتابیسی که در util/database استفاده می‌کنی
    password: 'Mani2004'
});

app.use(
    session({
        secret: 'یک-رشته-خیلی-طولانی-و-تصادفی-برای-سشن', // حتما بعداً عوضش کن
        resave: false,
        saveUninitialized: false,
        store: sessionStore
    })
);
// ------------------------------------------------------

// میدل‌ویر گلوبال برای در دسترس بودن isLoggedIn در همه‌ی viewها
app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.currentUser = req.session.user;
    console.log(req.session.user);
    next();
});

// روترهای اصلی
app.use('/admin', adminRouter);
app.use(shopRouter);

// هندل 404
app.use(errorController.get404);

// اجرای سرور
app.listen(3000);
