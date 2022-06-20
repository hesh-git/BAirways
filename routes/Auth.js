const { urlencoded } = require("body-parser");
const { check, validationResult } = require("express-validator");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const express = require("express");
const loginSiteController = require("../controllers/LoginSiteController");

const router = express.Router();

//GET requests
router.get("/", loginSiteController.login_page);

router.get("/register", loginSiteController.signup_page);

//POST request
router.post(
  "/auth_login",
  urlencodedParser,
  [
    check("email", "Email is not valid").isEmail().normalizeEmail(),
    check("password","Password should be filled")
      .not()
      .isEmpty()
  ],
  loginSiteController.login_post
);
router.post(
  "/register",
  urlencodedParser,
  [
    check("fName", "First name must be at least 3 characters long")
      .exists()
      .isLength({ min: 3, max: 30 }),
    check("lName", "Last name must be at least 3 characters long")
      .exists()
      .isLength({ min: 3, max: 30 }),
    check("email", "Email is not valid").isEmail().normalizeEmail(),
    check("password","Password is not in the required form. Password should contain at least 8 characters and should be alphanumeric")
      .not()
      .isEmpty()
      .isLength({ min: 8, max: 10 }),
    check("conPassword", "Passwords do not match").custom(
      (value, { req }) => value === req.body.password
    ),
    check("contact", "Mobile number should contain only numbers")
      .isInt()
      .exists(),
  ],
  loginSiteController.signup_post
);

module.exports = router;
