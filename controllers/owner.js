const db = require('../util/database');
exports.postConfirmOrder = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        const providerId = req.session.providerId;

        console.log('CONFIRM ORDER clicked', { orderId, providerId });

        if (!orderId || !providerId) {
            return res.status(400).send('orderId یا providerId نامعتبر است');
        }

        const sql = `
      UPDATE orders
      SET status = 'accepted'
      WHERE id = ? AND provider_id = ? AND status = 'pending'
    `;
        const [result] = await db.execute(sql, [orderId, providerId]);

        console.log('UPDATE result:', result);

        res.redirect('/owner/orders');
    } catch (err) {
        console.error(err);
        next(err);
    }
};



exports.getOwnerOrders = async (req, res, next) => {
    try {
        const providerId = req.session.providerId;
        const date = req.query.date || null;

        console.log('OWNER ORDERS providerId =', providerId, 'date =', date);

        if (!providerId) {
            return res.status(403).send('providerId در سشن پیدا نشد؛ احتمالاً کاربر مالک نیست یا برای او provider ثبت نشده است.');
        }

        let sql = `
            SELECT o.id,
                   o.status,
                   o.final_price,
                   o.scheduled_delivery_time,
                   o.created_at,
                   u.full_name AS student_name,
                   u.phone     AS student_phone
            FROM orders o
                     JOIN users u ON u.id = o.student_id
            WHERE o.provider_id = ?
        `;
        const params = [providerId];

        if (date) {
            sql += ' AND DATE(o.scheduled_delivery_time) = DATE(?)';
            params.push(date);
        }

        sql += ' ORDER BY o.created_at DESC';

        const [orders] = await db.execute(sql, params);

        res.render('owner/orders', {
            pageTitle: 'سفارش‌های خشکشویی',
            orders,
            path: '/owner/orders',
            selectedDate: date || '',
            isLoggedIn: req.session.isLoggedIn
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
