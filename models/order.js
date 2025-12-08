// models/laundry-order.js
const db = require('../util/database');

module.exports = class LaundryOrder {
    static create(data) {
        const sql = `
      INSERT INTO orders
        (student_id, university_id, provider_id, pickup_point_id,
         status, total_price, delivery_fee, final_price,
         scheduled_delivery_time, student_note)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        const params = [
            data.student_id,
            data.university_id || 1,
            data.provider_id,
            data.pickup_point_id || 1,
            'pending',
            data.final_price,
            0,
            data.final_price,
            data.scheduled_delivery_time,
            data.student_note || null
        ];
        return db.execute(sql, params);
    }
};
