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

    isAdmin(id){
        let out ;
        db.execute('SELECT role FROM users WHERE id = ?',[id]).then(
            (isAdmin) => {
                out = (isAdmin[0][0].role === 'admin')
            },
        ).catch(error => console.log(error));
        return out;
    }
}