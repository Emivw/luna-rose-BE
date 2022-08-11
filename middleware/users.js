const jwt = require("jsonwebtoken");
// import {
//   getUserById,
//   getUsers,
//   insertUser,
//   updateUserById,
//   deleteUserById,
// } from "../models/userModel.js";
// export const showUsers = (req, res) => {
//   getUsers((err, results) => {
//     if (err) {
//       res.send(err);
//     } else {
//       res.json(results);
//     }
//   })
// }
// // show single User
// export const showUserById = (req, res) => {
//   getUserById(req.params.email, (err, results) => {
//     if (err) {
//       res.send(err);
//     } else {
//       res.json(results);
//     }
//   })
// }
// // createUser
// export const createUser = (req, res) => {
//   const data = req.body;
//   insertUser(data, (err, results) => {
//     if (err) {
//       res.send(err);
//     } else {
//       res.json(results);
//     }
//   })
// }
// // update User
// export const updateUser = (req, res) => {
//   const data = req.body;
//   const id = req.params.id;
//   updateUserById(data, id, (err, results) => {
//     if (err) {
//       res.send(err);
//     } else {
//       res.json(results);
//     }
//   });
// }

// // delete User
// export const deleteUser = (req, res) => {
//   const id = req.params.id;
//   deleteUserById(id, (err, results) => {
//     if (err) {
//       res.send(err);
//     } else {
//       res.json(results);
//     }
//   });
// }
module.exports = {
  validateRegister: (req, res, next) => {
    // username min length 3
    if (!req.body.email || req.body.email.length < 3) {
      return res.status(400).send({
        msg: 'Please enter a username with min. 3 chars'
      });
    }
    // password min 6 chars
    if (!req.body.password || req.body.password.length < 6) {
      return res.status(400).send({
        msg: 'Please enter a password with min. 6 chars'
      });
    }
    // password (repeat) does not match
    if (
      !req.body.password_repeat ||
      req.body.password != req.body.password_repeat
    ) {
      return res.status(400).send({
        msg: 'Both passwords must match'
      });
    }
    next();
  },
  isLoggedIn: (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(
      token,
      'SECRETKEY'
    );
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(401).send({
      msg: 'Your session is not valid!'
    });
  }
}
};