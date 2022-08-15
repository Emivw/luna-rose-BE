const express = require('express');
const router = express.Router();
const db = require('../config/db.js')
// const auth = require('./authentication')
const bcrypt = require('bcrypt');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')
const userMiddleware = require('../middleware/users.js');
const fs = require('fs');
const saltRounds = 10;
// import {
//   showUsers,
//   showUserById,
//   createUser,
//   updateUser,
//   deleteUser,
// } from "../middleware/users.js";
router.get('/api/products', (req, res, next) => {
  db.query(
    `SELECT * FROM products`,
    (err, result) => {
      // user does not exists
      if (err) {
        return res.status(400).send({
          msg: err
        });
      }
      if (result.length !== 0) {
        return res.send(result);
      }
    })
});
router.get('/api/products/:id', (req, res, next) => {
  db.query(
    `SELECT * FROM products WHERE id = ?,
    req.params.id`,
    (err, result) => {
      // user does not exists
      if (err) {
        return res.status(400).send({
          msg: err
        });
      }
      if (result.length !== 0) {
        return res.send(result);
      }
    })
});
router.get('/api/users', (req, res, next) => {
  db.query(
    `SELECT * FROM users`,
    (err, result) => {
      // user does not exists
      if (err) {
        return res.status(400).send({
          msg: err
        });
      }
      if (result.length !== 0) {
        return res.send(result);
      }
    })
});
router.get('/api/users/:id', (req, res, next) => {
  db.query(
    `SELECT * FROM users WHERE userId = ?,
    req.params.userId`,
    (err, result) => {
      // user does not exists
      if (err) {
        return res.status(400).send({
          msg: err
        });
      }
      if (result.length !== 0) {
        return res.send(result);
      }
    })
});
router.post('/api/register', express.json(), userMiddleware.validateRegister, (req, res) => {

  let { email, userPassword, password_repeat, fullName, userRole } = req.body;
  //creating user object
  const joinDate = new Date();
  const user = {
    email,
    userPassword,
    fullName,
    userRole,
    joinDate
  }

  if (!email) {
    return res.status(400).send({
      msg: 'email should not be empty'
    });
  }

  // password (repeat) does not match
  if (
    !password_repeat ||
    userPassword != password_repeat
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
    let userPassword = 'pass1';
    const saltRounds = 10;
    const bcrypt = require('bcrypt');
    // username is available
    bcrypt.hash(userPassword, saltRounds, function (err, hash) {
      // Store hash in your password DB.
      userPassword = hash;
      console.log(userPassword, hash);
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
router.post('/api/login', (req, res, next) => {
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
        req.body.userPassword,
        result[0]['userPassword'],
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
              fullName: result[0].fullName,
              joinDate: result[0].joinDate,
              userPassword: result[0].userPassword,
              userRole: result[0].userRole,
              userId: result[0].userId,
              cart: result[0].cart
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

// get single product


// create new product
// router.post('/products', createProduct);

// // update Product
// router.put('/products/:id', updateProduct);

// // delete Product
// router.delete('/products/:id', deleteProduct);




module.exports = router;