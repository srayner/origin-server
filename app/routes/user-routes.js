const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Token = require("../model/token");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const checkAuth = require("../middleware/check-auth");
const mailer = require("../helpers/email");

module.exports = function(app, db) {
  // USER signup
  app.post("/user/signup", (req, res) => {
    User.find({ email: req.body.email })
      .exec()
      .then(user => {
        if (user.length >= 1) {
          return res
            .status(409)
            .json({ message: "Email address already taken." });
        } else {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(500).json({ error: err });
            } else {
              const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash,
                verified: false
              });
              const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY);
              const url = "http://localhost:3000/verify?token=" + token;
              const link = '<a href="' + url + '">' + url + "</a>";
              mailBody =
                "Thanks for signing up to Origin Genealogy. To complete your registation click or " +
                "paste this link into your browser: " +
                link;
              user
                .save()
                .then(result => {
                  mailer(
                    req.body.email,
                    "Origin Genealogy account verification.",
                    mailBody
                  );
                  res.status(201).json({ message: "User created." });
                })
                .catch(err => {
                  res.status(500).json({ error: err });
                });
            }
          });
        }
      })
      .catch();
  });

  // USER verify
  app.post("/user/verify", (req, res) => {
    try {
      const token = req.token;
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      User.find({ email: decoded.email })
        .exec()
        .then(users => {
          if (users.length < 1) {
            return res.status(400).json({ Message: "Bad request." });
          }
          user[0].verified = true;
          user[0].save();
          res.status(200).json({ Message: "User verified." });
        });
    } catch (error) {
      return res.status(400).json({ message: "Bad request." });
    }
  });

  // USER login
  app.post("/user/login", (req, res) => {
    User.find({ email: req.body.email })
      .exec()
      .then(users => {
        if (users.length < 1) {
          return res.status(401).json({ Message: "Unauthorized." });
        }
        bcrypt.compare(
          req.body.password,
          users[0].password,
          (error, result) => {
            if (error) {
              return res.status(401).json({ Message: "Unauthorized." });
            }
            if (result) {
              const token = jwt.sign(
                {
                  email: users[0].email,
                  userId: users[0]._id
                },
                process.env.JWT_KEY,
                {
                  expiresIn: "15m"
                }
              );
              const refreshToken = jwt.sign(
                {
                  email: users[0].email,
                  userId: users[0]._id
                },
                process.env.JWT_REFRESH_KEY,
                {
                  expiresIn: "24h"
                }
              );
              db.collection("tokens").insertOne(
                { refreshToken },
                (err, result) => {
                  if (err) {
                    console.log(err);
                  }
                }
              );
              return res.status(200).json({
                message: "Login suceeded.",
                token: token,
                refreshToken: refreshToken
              });
            }
            return res.status(401).json({ Message: "Unauthorized." });
          }
        );
      })
      .catch();
  });

  // USER token refresh
  app.post("/user/token", (req, res) => {
    const postData = req.body;
    if (postData.refreshToken) {
      const refreshToken = postData.refreshToken;
      Token.findOne({ refreshToken }, (err, data) => {
        if (!data) {
          res.status(404).json({ Message: "Not found." });
        } else {
          const decoded = jwt.verify(
            data.refreshToken,
            process.env.JWT_REFRESH_KEY
          );
          const token = jwt.sign(
            { email: decoded.email, userId: decoded._id },
            process.env.JWT_KEY,
            { expiresIn: "15m" }
          );
          res.status(200).json({ token });
        }
      });
    } else {
      res.status(400).json({ Message: "Refresh token is required." });
    }
  });

  // USER delete
  app.delete("/user/:id", checkAuth, (req, res) => {
    User.remove({ _id: req.body.id })
      .exec()
      .then(() => {
        res.status(200).json({ Message: "User deleted." });
      })
      .catch(() => {
        res.status(500).json({ error: err });
      });
  });

  // USER patch
  app.patch("/users/:id", checkAuth, (req, res) => {
    const id = req.params.id;
    const details = { _id: new mongoose.Types.ObjectId(id) };
    db.collection("users").findOne(details, (err, user) => {
      if (err) {
        res.send({ error: "An error has occured." });
      } else {
        const allowed = ["forenames", "surname", "address"];
        const filtered = Object.keys(req.body)
          .filter(key => allowed.includes(key))
          .reduce((obj, key) => {
            obj[key] = req.body[key];
            return obj;
          }, {});
        const update = { $set: filtered };
        db.collection("users").updateOne(details, update, function(err, item) {
          if (err) {
            res.send({ error: "An error has occured." });
          } else {
            res.send({ message: "User " + id + " updated." });
          }
        });
      }
    });
  });

  // INDEX users
  app.get("/users", checkAuth, (req, res) => {
    db.collection("users")
      .find({})
      .toArray(function(err, result) {
        if (err) {
          res.send({ error: "An error occurred" });
        } else {
          res.send(result);
        }
      });
  });
};
