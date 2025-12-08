const User = require('../models/User');
const City = require('../models/City');
const Provider = require('../models/Provider');
const iranProvinces = [
    "آذربایجان شرقی",
    "آذربایجان غربی",
    "اردبیل",
    "اصفهان",
    "البرز",
    "ایلام",
    "بوشهر",
    "تهران",
    "چهارمحال و بختیاری",
    "خراسان جنوبی",
    "خراسان رضوی",
    "خراسان شمالی",
    "خوزستان",
    "زنجان",
    "سمنان",
    "سیستان و بلوچستان",
    "فارس",
    "قزوین",
    "قم",
    "کردستان",
    "کرمان",
    "کرمانشاه",
    "کهگیلویه و بویراحمد",
    "گلستان",
    "گیلان",
    "لرستان",
    "مازندران",
    "مرکزی",
    "هرمزگان",
    "همدان",
    "یزد"
];

exports.getAllUsers =  (req, res, next) => {
    const users = new User();
    let s= false;
    if (req.session.user) {
        s = req.session.user.role;
    }
    users.getAllUsers().then(([users,info]) => {
        res.render('admin/see-users', {
           path:'/admin/see-users',
            pageTitle: 'See Users',
            allUsers: users,
            isAdmin: s,
        });
    }).catch((err) => {
        console.log(err);
    })
}

exports.getAdminIndex = (req, res, next) => {
    res.render('admin/admin', {
        path:'/admin',
        pageTitle: 'Admin Index',
        isAdmin: req.session.user.role === 'admin',
    })
}

// exports.getUserDetail = (req, res, next) => {
//     let s = false
//     if (req.session.user) {
//         s = req.session.user.role === 'admin'
//     }
//     const user = new User();
//     const selected = user.findById(req.params.userId);
//     console.log('selected is: ')
//     console.log(selected)
//     res.render('admin/user-detail', {
//         path:'/admin/see-detail/:userId',
//         pageTitle: 'User Detail',
//         isAdmin: s,
//         user : selected,
//     })

exports.getUserDetail = async (req, res, next) => {
    let s = false;
    if (req.session.user) {
        s = req.session.user.role === 'admin';
    }

    const user = new User();

    try {
        const selected = await user.findById(req.params.userId);

        console.log('selected is: ', selected);

        res.render('admin/user-detail', {
            path: '/admin/see-users/:userId',
            pageTitle: 'User Detail',
            isAdmin: s,
            user: selected,
        });
    } catch (err) {
        console.log(err);
    }


}


exports.postEditUser = async (req, res, next) => {
    const { user_id, full_name, phone, email, password, role, status, university_id } = req.body;

    try {
        let finalPassword = password;

        if (password && password.trim() !== '') {

        }

        const updatedUserData = {
            id: user_id,
            full_name: full_name,
            phone: phone,
            email: email,
            password: finalPassword,
            role: role,
            status: status,
            university_id: university_id
        };

        const userModel = new User();
        await userModel.update(updatedUserData);

        console.log('User updated successfully!');

        res.redirect(`/admin/see-users/${user_id}`);

    } catch (err) {
        console.log('Error updating user:', err);
        res.status(500).render('500', { pageTitle: 'Error', path: '/500' });
    }
};

exports.getAddProviders = async  (req, res, next) => {
    let s = false;
    const user = new User();
    const city = new City();
    let cities = [];
    let providers_owner = []
    await user.owners().then(([o,i])=>{
        providers_owner = o;
    }).catch((err)=>{
        console.log(err);
    })
    await city.getCities().then(([c,i])=>{
        cities = c;
        console.log(cities);
    }).catch((err)=>{
        console.log(err);
    })
    if (req.session.user) {
        s = req.session.user.role === 'admin';
    }
    res.render('admin/add-provider', {
        path:'/admin/add-provider',
        pageTitle: 'Add Provider',
        isAdmin: s,
        cities : cities,
        providers_owner : providers_owner,
    })
}

exports.postAddProvider = async (req, res) => {
    try {
        const {
            name,
            type,
            owner_user_id,
            city_id,
            address,
            imageurl,
            description,
            is_active
        } = req.body;


        await Provider.create({
            name,
            type,
            owner_user_id,
            city_id,
            imageurl,
            address,
            description,
            is_active: is_active === 'on' // چک‌باکس
        });

        res.redirect('/admin/add-provider'); // هر مسیری که برای لیست داری
    } catch (err) {
        console.error(err);
        res.status(500).send('خطا در ثبت سرویس');
    }
}