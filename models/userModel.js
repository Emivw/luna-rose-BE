// import connection
import conn from "../config/db.js"

export const getUsers = (result) => {
    conn.query("SELECT * FROM users", (err, results) => {
        if (err) {
            console.log(err);
            result(err, null);
        } else {
            result(null, results);
        }
    })
}
export const getUsersById = (email, result) => {
    conn.query("SELECT * FROM users WHERE email = ?",
        [email],
        (err, results) => {
            if (err) {
                console.log(err);
                result(err, null);
            } else {
                result(null, results[0]);
            }
        });
};
//  insert a new product
export const insertUser = (data, result) => {
    conn.query("INSERT INTO users SET ?", [data],
        (err, results) => {
            if (err) {
                console.log(err);
                result(err, null);
            } else {
                result(null, results);
            }
        });
};

//  update products
export const updateUserById = (data, id, result) => {
    conn.query(`UPDATE users SET ? WHERE user_id = ?`, [data, id],
        (err, results) => {
            if (err) {
                console.log(err);
                result(err, null);
            } else {
                result(null, results);
            }
        });
};

//  delete product
export const deleteUserById = (id, result) => {
    conn.query("DELETE FROM users WHERE user_id = ?", [id],
        (err, results) => {
            if (err) {
                console.log(err);
                result(err, null);
            } else {
                result(null, results);
            }
        });
}

