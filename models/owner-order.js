// models/owner-orders.js
const db = require('../util/database');

module.exports = class OwnerOrders {
    static fetchByProviderAndDate(providerId, date) {
        const sql = `
      SELECT o.id,
             o.status,
             o.final_price,
             o.scheduled_delivery_time,
             o.created_at,
             u.full_name       AS student_name,
             u.phone           AS student_phone
      FROM orders o
      JOIN users u ON u.id = o.student_id
      WHERE o.provider_id = ?
        AND DATE(o.scheduled_delivery_time) = DATE(?)
      ORDER BY o.created_at DESC
    `;
        return db.execute(sql, [providerId, date]);
    }

    static confirm(orderId, providerId) {
        const sql = `
      UPDATE orders
      SET status = 'accepted'
      WHERE id = ? AND provider_id = ? AND status = 'pending'
    `;
        return db.execute(sql, [orderId, providerId]);
    }
};
