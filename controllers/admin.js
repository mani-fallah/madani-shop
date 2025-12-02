const User = require('../models/User');

exports.getAllUsers =  (req, res, next) => {
    const users = new User();
    users.getAllUsers().then(([users,info]) => {
        res.render('admin/see-users', {
           path:'/admin/see-users',
            pageTitle: 'See Users',
            allUsers: users,
            isAdmin: req.session.user.role === 'admin',
        });
    }).catch((err) => {
        console.log(err);
    })
}