const db = require('../util/database');


module.exports = class City {
    constructor(id,name,type,owner_user_id,city_id,address,description,is_active) {
        this.id = id;
        this.type = type;
        this.owner_user_id = owner_user_id;
        this.city_id = city_id;
        this.address = address;
        this.description = description;
        this.is_active = is_active;
    }

    getCities() {
        return db.execute("SELECT * FROM cities");
    }
}