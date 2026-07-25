const { body } = require("express-validator");

const updateProfileValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("phone")
    .optional({ checkFalsy: true })
    .trim()
    .isMobilePhone("any")
    .withMessage("Invalid phone number"),

  body("headline")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 120 })
    .withMessage("Headline cannot exceed 120 characters"),

  body("bio")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),

  body("location")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage("Location cannot exceed 100 characters"),

  body("experienceLevel")
    .optional({ checkFalsy: true })
    .isIn(["Fresher", "Intern", "Junior", "Mid-Level", "Senior", "Lead"])
    .withMessage("Invalid experience level"),

  body("skills")
    .optional()
    .isArray()
    .withMessage("Skills must be an array"),

  body("skills.*")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Each skill must be a non-empty string"),

  body("linkedin")
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage("Invalid LinkedIn URL"),

  body("github")
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage("Invalid GitHub URL"),

  body("portfolio")
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage("Invalid Portfolio URL"),
];

module.exports = {
  updateProfileValidator,
};