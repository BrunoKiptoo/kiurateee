"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCallbackUrl = exports.getCountryCode = exports.getPaymentCurrency = exports.getPaystackHeaders = exports.passwordStrength = exports.comparePassword = exports.harshPassword = exports.PAGINATION = exports.BCRYPT_SALT = exports.appVersion = exports.APP_URLS = void 0;
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
const getPaystackHeaders = async (country) => {
    const headers = {
        Authorization: `Bearer ${country === "nigeria" ? env_1.PAYSTACK_NG_SECRET_KEY : null}`,
        "Content-Type": "application/json",
    };
    return headers;
};
exports.getPaystackHeaders = getPaystackHeaders;
const getPaymentCurrency = async (country = "nigeria") => {
    return country === "kenya" ? "KES" : country === "ghana" ? "GHS" : "NGN";
};
exports.getPaymentCurrency = getPaymentCurrency;
const getCountryCode = async (country) => {
    const requestCountry = countries_1.default.find((c) => c.name.toLowerCase() === country.toLowerCase());
    return { countryCode: requestCountry === null || requestCountry === void 0 ? void 0 : requestCountry.dialCode, currencyCode: requestCountry === null || requestCountry === void 0 ? void 0 : requestCountry.currencyCode };
};
exports.getCountryCode = getCountryCode;
const getCallbackUrl = async (service, country = "nigeria") => {
    let callbackUrl = "";
    switch (service) {
        case "kiurate_initiate_payment":
            callbackUrl = `${exports.APP_URLS.baseApiURL}/api/v1/payments/verify_payment?country=${country}`;
            break;
        default:
            break;
    }
    return callbackUrl;
};
exports.getCallbackUrl = getCallbackUrl;
//# sourceMappingURL=constants.js.map