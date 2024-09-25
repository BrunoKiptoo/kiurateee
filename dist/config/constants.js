"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCountryCode = exports.getPaymentCurrency = exports.passwordStrength = exports.comparePassword = exports.harshPassword = exports.PAGINATION = exports.BCRYPT_SALT = exports.appVersion = exports.APP_URLS = void 0;
//src/config/constants.ts
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../config/env");
const countries_1 = __importDefault(require("./constants/countries"));
exports.APP_URLS = {
    baseApiURL: env_1.baseApiURL,
};
exports.appVersion = "v1";
exports.BCRYPT_SALT = 10;
exports.PAGINATION = 10;
const harshPassword = async (password) => {
    const salt = bcryptjs_1.default.genSaltSync(exports.BCRYPT_SALT);
    return bcryptjs_1.default.hashSync(password, salt);
};
exports.harshPassword = harshPassword;
const comparePassword = async (password, hashPassword) => {
    return bcryptjs_1.default.compareSync(password, hashPassword);
};
exports.comparePassword = comparePassword;
const passwordStrength = async (password) => {
    // const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
    // return strongRegex.test(password);
    const lengthCheck = password.length >= 8;
    const uppercaseCheck = /[A-Z]/.test(password);
    const lowercaseCheck = /[a-z]/.test(password);
    const numberCheck = /[0-9]/.test(password);
    const specialCharCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return lengthCheck && uppercaseCheck && lowercaseCheck && numberCheck && specialCharCheck;
};
exports.passwordStrength = passwordStrength;
const getPaymentCurrency = async (country = "nigeria") => {
    return country === "kenya" ? "KES" : country === "ghana" ? "GHS" : "NGN";
};
exports.getPaymentCurrency = getPaymentCurrency;
const getCountryCode = async (country) => {
    const requestCountry = countries_1.default.find((c) => c.name.toLowerCase() === country.toLowerCase());
    return { countryCode: requestCountry === null || requestCountry === void 0 ? void 0 : requestCountry.dialCode, currencyCode: requestCountry === null || requestCountry === void 0 ? void 0 : requestCountry.currencyCode };
};
exports.getCountryCode = getCountryCode;
//# sourceMappingURL=constants.js.map