const {
    getProductById,
    getProducts,
    insertProduct,
    updateProductById,
    deleteProductById
} = require("../models/productModel.js");
module.exports = {
    // show all products
    showProducts: (req, res) => {
        getProducts((err, results) => {
            if (err) {
                res.send(err);
            } else {
                res.json(results);
            }
        })
        next();
    },
// show single product
  showProductById: (req, res) => {
        getProductById(req.params.id, (err, results) => {
            if (err) {
                res.send(err);
            } else {
                res.json(results);
            }
        })
      next();
    },
// createProduct
  createProduct: (req, res) => {
        const data = req.body;
        insertProduct(data, (err, results) => {
            if (err) {
                res.send(err);
            } else {
                res.json(results);
            }
        })
      next();
    },
// update product
  updateProduct: (req, res) => {
        const data = req.body;
        const id = req.params.id;
        updateProductById(data, id, (err, results) => {
            if (err) {
                res.send(err);
            } else {
                res.json(results);
            }
        });
      next();
    },

// delete product
  deleteProduct: (req, res) => {
        const id = req.params.id;
        deleteProductById(id, (err, results) => {
            if (err) {
                res.send(err);
            } else {
                res.json(results);
            }
        });
      next();
    }
}