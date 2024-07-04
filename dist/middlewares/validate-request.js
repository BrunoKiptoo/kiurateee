"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFormData = exports.validate = void 0;
const express_validator_1 = require("express-validator");
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const extractedErrors = {};
        const keys = Object.keys(errors.mapped());
        const values = Object.values(errors.mapped());
        keys.forEach((key, index) => {
            extractedErrors[key] = values[index].msg;
        });
        return res.status(400).send({ status: "Failed", errors: extractedErrors });
    }
    next();
};
exports.validate = validate;
const parseFormData = (req, _res, next) => {
    if (req.body) {
        req.body = JSON.parse(req.body);
        console.log(req.body);
    }
    next();
};
exports.parseFormData = parseFormData;
//# sourceMappingURL=validate-request.js.map