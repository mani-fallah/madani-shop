const db = require('../util/database');

module.exports = class User {
    constructor(id, full_name, phone, email, password_hash, role, university_id, status, created_at, updated_at) {
        this.id = id;
        this.full_name = full_name;
        this.phone = phone;
        this.email = email;
        this.password_hash = password_hash;
        this.role = role;
        this.university_id = university_id;
        this.status = status;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    getAllUsers(){
        return db.execute('SELECT * FROM users');
    }
    addUser() {
        return db.execute('insert into users(full_name,phone,email,password_hash,role,university_id,status) values (?,?,?,?,?,?,?)',
            [this.full_name, this.phone, this.email, this.password_hash, this.role,this.university_id,'active']);
    }

    findByEmail(email) {
        return db.execute('select * from users where email=?',[email])
    }

    // findById(id) {
    //     db.execute('select * from users where id=?',[id]).then(([result,info]) => {
    //       console.log(result[0]);
    //        return result[0];
    //     }).catch((err) => {
    //         console.error(err);
    //     })
    // }
    findById(id) {
        // نکته ۱: حتماً باید return را بنویسید تا Promise برگردد
        return db.execute('select * from users where id=?', [id])
            .then(([result, info]) => {
                // این نتیجه به تابعی که این متد را صدا زده پاس داده می‌شود
                return result[0];
            })
            .catch((err) => {
                console.error(err);
                throw err; // خطا را به بالا پرتاب کنید تا در کنترلر مدیریت شود
            });
    }

    update(userData) {
        if (userData.password && userData.password.trim() !== '') {
            return db.execute(
                `UPDATE users 
             SET full_name=?, phone=?, email=?, password_hash=?, role=?, status=?, university_id=?, updated_at=NOW() 
             WHERE id=?`,
                [
                    userData.full_name,
                    userData.phone,
                    userData.email,
                    userData.password_hash, // توجه: اینجا باید رمز هش شده باشد (در کنترلر توضیح دادم)
                    userData.role,
                    userData.status,
                    userData.university_id,
                    userData.id
                ]
            );
        } else {
            return db.execute(
                `UPDATE users 
             SET full_name=?, phone=?, email=?, role=?, status=?, university_id=?, updated_at=NOW() 
             WHERE id=?`,
                [
                    userData.full_name,
                    userData.phone,
                    userData.email,
                    userData.role,
                    userData.status,
                    userData.university_id,
                    userData.id
                ]
            );
        }
    }

    owners() {
        return db.execute('SELECT * FROM users where role=?',['provider_owner']);
    }


}