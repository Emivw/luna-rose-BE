// import connection
const conn = require("../config/db.js");
module.exports = {
    getProducts: (result) => {
        conn.query("SELECT * FROM products", (err, results) => {
            if (err) {
                console.log(err);
                result(err, null);
            } else {
                result(null, results);
            }
        })
    },
  getProductById: (id, result) => {
        conn.query("SELECT * FROM products WHERE prod_id = ?",
            [id],
            (err, results) => {
                if (err) {
                    console.log(err);
                    result(err, null);
                } else {
                    result(null, results[0]);
                }
            });
    },
    //  insert a new product
    insertProduct:  (data, result) => {
        conn.query("INSERT INTO products SET ?", [data],
            (err, results) => {
                if (err) {
                    console.log(err);
                    result(err, null);
                } else {
                    result(null, results);
                }
            });
    },

    //  update products
    updateProductById: (data, id, result) => {
        conn.query(`UPDATE products SET ? where ${conn.escape(req.body.prod_id)}`, [data, id],
            (err, results) => {
                if (err) {
                    console.log(err);
                    result(err, null);
                } else {
                    result(null, results);
                }
            });
    },

    //  delete product
    deleteProductById: (id, result) => {
        conn.query("DELETE FROM product WHERE id = ?", [id],
            (err, results) => {
                if (err) {
                    console.log(err);
                    result(err, null);
                } else {
                    result(null, results);
                }
            });
    }
}
