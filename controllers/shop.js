const User = require('../models/User');
const Provider = require('../models/Provider');
const LaundryOrder = require('../models/order');
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
    let isProvider = false;
    if(  req.session.user )
    {
        status = req.session.user.role==='admin';
    }
    if( req.session.providerId )
    {
        isProvider = true;
    }
    res.render('index',{
        path: '/',
        pageTitle: 'home',
        isLoggedIn: req.session.isLoggedIn,
        isAdmin: status,
        isprovider: isProvider,
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

exports.getLaundry = async (req,res,next) => {
    try {
        const [laundries] = await Provider.getLaundries(); // اینجا همان نام متد
        res.render('jobs/laundry', {
            pageTitle: 'لیست خشکشویی‌ها',
            path: '/laundry',
            laundries: laundries
        });
    } catch (err) {
        console.error(err);
        next(err);
    }

}

exports.getLaundryDetails = async (req,res,next) => {

    const providerId = req.params.id;

    try {
        const [[laundry]] = await Provider.findById(providerId); // باید در مدل اضافه شود
        if (!laundry) {
            return res.status(404).send('خشکشویی پیدا نشد');
        }

        res.render('jobs/laundry-detail', {
            pageTitle: 'جزییات خشکشویی',
            path: `/laundry/${providerId}`,
            laundry: laundry,
            isLoggedIn: req.session.isLoggedIn
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

exports.postAddLaundryOrder = async (req, res, next) => {
    const providerId = req.params.id;
    const studentId = req.session.user.id;

    const {
        shoes_count,
        blanket_count,
        jacket_count,
        other_clothes_count,
        pickup_date,
        note
    } = req.body;

    const shoes = parseInt(shoes_count || 0, 10);
    const blankets = parseInt(blanket_count || 0, 10);
    const jackets = parseInt(jacket_count || 0, 10);
    const others = parseInt(other_clothes_count || 0, 10);

    const totalPrice =
        shoes   * 100000 +
        jackets * 150000 +
        blankets* 180000 +
        others  *  50000
        + 50000
    ;

    try {
        await LaundryOrder.create({
            student_id: studentId,
            provider_id: providerId,
            scheduled_delivery_time: pickup_date,
            student_note: note,
            final_price: totalPrice
        });

        res.redirect('/orders');
    } catch (err) {
        console.error(err);
        next(err);
    }
}

exports.getOrders = async (req, res, next) => {
    try {
        const studentId = req.session.user.id;

        const sql = `
      SELECT o.id,
             o.status,
             o.final_price,
             o.scheduled_delivery_time,
             o.created_at,
             p.name AS provider_name
      FROM orders o
      LEFT JOIN providers p ON p.id = o.provider_id
      WHERE o.student_id = ?
      ORDER BY o.created_at DESC
    `;
        const [orders] = await db.execute(sql, [studentId]);

        res.render('students/orders', {
            pageTitle: 'سفارش‌های من',
            orders: orders,
            path:'/orders',
            isLoggedIn: req.session.isLoggedIn
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

exports.postCancleOrder = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        const studentId = req.session.user.id;

        const sql = `
      UPDATE orders
      SET status = 'canceled_user'
      WHERE id = ? AND student_id = ? AND status IN ('pending', 'accepted', 'preparing')
    `;
        await db.execute(sql, [orderId, studentId]);

        res.redirect('/orders');
    } catch (err) {
        console.error(err);
        next(err);
    }
}