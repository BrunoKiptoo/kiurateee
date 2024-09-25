//src/config/constants.ts
import bcrypt from "bcryptjs";
import { baseApiURL } from "../config/env";
import countries from "./constants/countries";

export const APP_URLS = {
  baseApiURL: baseApiURL,
};

export const appVersion = "v1";

export const BCRYPT_SALT = 10;
export const PAGINATION = 10;

export const harshPassword = async (password: string) => {
  const salt = bcrypt.genSaltSync(BCRYPT_SALT);
  return bcrypt.hashSync(password, salt);
};

export const comparePassword = async (password: string, hashPassword: string) => {
  return bcrypt.compareSync(password, hashPassword);
};

export const passwordStrength = async (password: string) => {
  // const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
  // return strongRegex.test(password);

  const lengthCheck = password.length >= 8;
  const uppercaseCheck = /[A-Z]/.test(password);
  const lowercaseCheck = /[a-z]/.test(password);
  const numberCheck = /[0-9]/.test(password);
  const specialCharCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return lengthCheck && uppercaseCheck && lowercaseCheck && numberCheck && specialCharCheck;
};

export const getPaymentCurrency = async (country = "nigeria") => {
  return country === "kenya" ? "KES" : country === "ghana" ? "GHS" : "NGN";
};

export const getCountryCode = async (country: string) => {
  const requestCountry = countries.find((c) => c.name.toLowerCase() === country.toLowerCase());
  return { countryCode: requestCountry?.dialCode, currencyCode: requestCountry?.currencyCode };
};
