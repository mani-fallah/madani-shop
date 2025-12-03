const User = require('../models/User');
const db = require('../util/database');
exports.getSignup = (req, res, next) => {
    res.render('sign-up', {
        path: '/signup',
        pageTitle: 'Signup',
        error: false,
        errorText: '',
        fullName: '',
        password: '',
    });
}

exports.getLogin = (req, res, next) => {
    res.render('login', {
        path: '/login',
        pageTitle: 'Login',
        error: false,
        errorText: ''
    })
}

exports.postSignup = (req, res, next) => {

    const fullName = req.body.full_name;
    const password = req.body.password_hash;
    const email = req.body.email;
    const phone = req.body.phone;
    const role = req.body.role;
    const univ_id = req.body.university_id;
    const user = new User(null, fullName, phone, email, password, role, univ_id);


    user.addUser().then(() => {
        res.redirect('/login');
    }).catch(err => {
        if (err.sqlState === '23000') {
            res.status(409).render('sign-up', {
                path: '/signup',
                error: true,
                pageTitle: 'Signup',
                errorText: 'Email/phone number already exists',
                fullName: fullName,
                password: password,
            });
        }
    });
}
exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = new User();
    user.findByEmail(email)
        .then(([foundUser]) => {
            if (foundUser.length === 0) {
                return res.render('login', {
                    path: '/login',
                    pageTitle: 'Login',
                    error: true,
                    errorText: 'email not found',
                });
            }

            if (foundUser[0].password_hash !== password) {
                return res.render('login', {
                    path: '/login',
                    pageTitle: 'Login',
                    error: true,
                    errorText: 'wrong password'
                });
            }

            // ✅ اینجا کاربر درست است → سشن را ست می‌کنیم
            req.session.isLoggedIn = true;
            req.session.user = foundUser[0];

            // حتما از save استفاده کن تا قبل از redirect ذخیره شود
            req.session.save(err => {
                if (err) console.log(err);
                res.redirect('/');   // آدرس صفحه اصلی
            });
        })
        .catch(err => console.log(err));
};

// exports.postLogin = (req, res, next) => {
//     console.log(req.body);
//     const email = req.body.email;
//     const password = req.body.password;
//
//     const user = new User();
//     user.findByEmail(email).then(([foundUser, info]) => {
//         if (foundUser.length > 0) {
//             if (foundUser[0].password_hash === password) {
//                 res.render('index',{
//                     path: '/',
//                     pageTitle: 'home',
//                     isLoggedIn: true,
//                 })
//             } else {
//                 res.render('login', {
//                     path: '/login',
//                     pageTitle: 'Login',
//                     error: true,
//                     errorText: 'wrong password'
//                 });
//
//             }
//         } else {
//             res.render('login', {
//                 path: '/login',
//                 pageTitle: 'Login',
//                 error: true,
//                 errorText: 'email not found',
//             });
//         }
//
//     }).catch(err => {
//         console.log(err);
//     })
// }

exports.getIndex = (req,res,next) => {
    let status = false;
    if(  req.session.user )
    {
        status = req.session.user.role==='admin';
    }
    res.render('index',{
        path: '/',
        pageTitle: 'home',
        isLoggedIn: req.session.isLoggedIn,
        isAdmin: status,
    })

}


exports.getLogout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        }
        res.redirect('/login');
    });
};