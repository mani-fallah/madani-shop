// models/provider.js
const db = require('../util/database');

module.exports = class Provider {
    constructor(id, name, type, owner_user_id, city_id, address, description, is_active, created_at) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.owner_user_id = owner_user_id;
        this.city_id = city_id;
        this.address = address;
        this.description = description;
        this.is_active = is_active;
        this.created_at = created_at;
    }

    // متد استاتیک برای اینسرت
    static create(data) {
        const sql = `
            INSERT INTO providers 
                (name, type, owner_user_id, city_id,imageurl ,address, description, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?,?)
        `;
        const params = [
            data.name,
            data.type,
            data.owner_user_id || null,
            data.city_id,
            data.imageurl || null,
            data.address || null,
            data.description || null,
            data.is_active ? 1 : 0
        ];
        return db.execute(sql, params); // یا db.query بسته به util شما[web:26][web:25]
    }

    static getLaundries() {
      const sql = `
            SELECT p.*, c.name AS city_name
            FROM providers p
            LEFT JOIN cities c ON c.id = p.city_id
            WHERE p.type = 'laundry' AND p.is_active = 1
            ORDER BY p.name ASC
        `;
      return db.execute(sql);
  }


    static findById(id) {
        const sql = `
      SELECT p.*, c.name AS city_name
      FROM providers p
      LEFT JOIN cities c ON c.id = p.city_id
      WHERE p.id = ?
      LIMIT 1
    `;
        return db.execute(sql, [id]);
    }
};
