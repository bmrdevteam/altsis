const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const moment = require("moment");
const validator = require("validator");

var config = require("../config/config.js");

const { conn } = require("../databases/connection");

const userSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      unique: true,
    },
    userName: String,
    password: {
      type: String,
      select: false, //alwasy exclude password in user document
    },
    auth: String,
    email: String,
    tel: String,
    snsId: [
      mongoose.Schema(
        {
          provider: String,
          email: String,
        },
        { _id: false }
      ),
    ],
    schools: [
      mongoose.Schema(
        {
          schoolId: String,
          schoolName: String,
        },
        { _id: false }
      ),
    ],
    profile: String,
    academyId: String,
    academyName: String,
  },
  { timestamps: true }
);

const check = {
  userId: (val) =>
    validator.isLength(val, { min: 4, max: 20 }) &&
    validator.isAlphanumeric(val),
  userName: (val) => validator.isLength(val, { min: 2, max: 20 }),
  email: (val) => validator.isEmail(val),
};

userSchema.methods.validationCheck = function (key) {
  if (!key) {
    for (const key in check) {
      if (!check[key](this[key])) return false;
    }
  }
  return check[key](this[key]);
};

userSchema.pre("save", function (next) {
  var user = this;
  if (user.isModified("password")) {
    //비밀번호가 바뀔때만 암호화
    bcrypt.genSalt(config.saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = async function (plainPassword) {
  var user = this;
  try {
    const isMatch = await bcrypt.compare(plainPassword, user.password);
    return isMatch;
  } catch (err) {
    return err;
  }
};

userSchema.statics.generatePassword = function () {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let password = "";
  for (var i = 0; i < 12; i++) {
    var randomNumber = Math.floor(Math.random() * chars.length);
    password += chars[randomNumber];
  }
  return password;
};

module.exports = (dbName) => {
  return conn[dbName].model("User", userSchema);
};
