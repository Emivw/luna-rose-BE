const express = require('express');
const router = express.Router();
const db = require('../config/db.js')
// const auth = require('./authentication')
const bcrypt = require('bcrypt');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')
const userMiddleware = require('../middleware/users.js');
const {
  showProducts,
  showProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../middleware/product.js");
// import {
//   showUsers,
//   showUserById,
//   createUser,
//   updateUser,
//   deleteUser,
// } from "../middleware/users.js";
router.post('/api/register', express.json(), userMiddleware.validateRegister, (req, res) => {

  let { email, user_password, password_repeat, firstname, lastname, gender, user_role} = req.body
  //creating user object
  const user = {
    email,
    user_password,
    firstname,
    lastname,
    address,
    gender,
    user_role
  }

  if (!email) {
    return res.status(400).send({
      msg: 'email should not be empty'
    });
  }

  // password (repeat) does not match
  if (
    !password_repeat ||
    password != password_repeat
  ) {
    return res.status(400).send({
      msg: 'Both passwords must match'
    });

  }


  db.query(`SELECT * FROM users WHERE email=?`, email, (err, result) => {

    if (err) {
      return res.status(400).send({
        msg: err
      })
    }

    //check whether username already exist or not
    if (result.length !== 0) {
      return res.status(409).send({
        msg: 'This email is already in use!'
      });
    }
    // username is available
    bcrypt.hash(password, 8).then((hash) => {
      //set the password to hash value
      user.password = hash

    }).then(() => {
      db.query("INSERT INTO users SET ?", user, (err, result) => {
        if (err) {
          return res.status(400).send({
            msg: err
          })
        }



        db.query('SELECT * FROM users WHERE email=?', email, 
        (err, result) => {
          if (err) {
            return res.status(400).send({
              msg: err
            })
          }

          return res.status(201)
            .send({
              userdata: user,
              msg: "successfully registered"
            })
        })

      })
    })
  });
})
router.post('api/login', (req, res, next) => {
  db.query(
    `SELECT * FROM users WHERE email = ${db.escape(req.body.email)};`,
    (err, result) => {
      // user does not exists
      if (err) {
        return res.status(400).send({
          msg: err
        });
      }
      if (result.length === 0) {
        return res.status(401).send({
          msg: 'email or password is incorrect!'
        });
      }
      // check password
      bcrypt.compare(
        req.body.user_password,
        result[0]['user_password'],
        (bErr, bResult) => {
          // wrong password
          if (bErr) {
            return res.status(401).send({
              msg: 'email or password is incorrect!'
            });
          }
          if (bResult) {
            const token = jwt.sign({
                email: result[0].email,
                firstname: result[0].firstname,
                lastname: result[0].lastname,
                gender: result[0].gender,
                user_password: result[0].user_password,
                address: result[0].address,
                user_role: result[0].user_role,
                userId: result[0].id
              },
              'SECRETKEY', {
                expiresIn: '7d'
              }
            );
            return res.status(200).send({
              msg: 'Logged in!',
              token,
              user: result[0]
            });
          }
          return res.status(401).send({
            msg: 'Username or password is incorrect!'
          });
        }
      );
    }
  );
});
router.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
  console.log(req.userData);
  res.send('This is the secret content. Only logged in users can see that!');
});

// router.get('api/users/',  (req, res, next) => {
// db.query(`SELECT * FROM users`, 
//     (err, result) => {
//       // user does not exists
//       if (err) {
//         return res.status(400).send({
//           msg: err
//         });
//       }
//       if (result.length !=== 0) {
//         return res.status(200).send({
//           msg: 'users successfully loaded'
//         });
//       }
//     })
// });


// get all products
router.get('/products', showProducts);

// get single product
router.get('/products/:id', showProductById);

// create new product
router.post('/products', createProduct);

// update Product
router.put('/products/:id', updateProduct);

// delete Product
router.delete('/products/:id', deleteProduct);




module.exports = router;