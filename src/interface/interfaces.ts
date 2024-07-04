import mongoose from "mongoose";
export interface IEnv {
  nodeEnv?: string | undefined;
  mongoURI?: string | undefined;
  baseApiURL?: string | undefined;
  MAILGUN_API_KEY?: string | undefined;
  MAILGUN_DOMAIN?: string | undefined;
  PAYSTACK_NG_SECRET_KEY?: string | undefined;
  API_KEY?: string | undefined;
  AUTH_TOKEN_SECRET?: string | undefined;
  ACCESS_TOKEN_EXPIRY?: string | undefined;
  REFRESH_TOKEN_EXPIRY?: string | undefined;
  bucketName?: string | undefined;
  accessKey?: string | undefined;
  secretKey?: string | undefined;
}

export interface NetworkCall {
  url: string;
  method: string;
  payload?: { [key: string]: string | number | object };
  headers?: any;
}

export interface ISubscribeToPaystack {
  email: string;
  plan_code: string;
  country: string;
}

export interface CreateCustomer {
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  country: string;
}

export interface IUser {
  [x: string]: any;
  first_name: string;
  last_name: string;
  phone_number: string;
  phone_number_verified: boolean;
  email: string;
  email_verified: boolean;
  createdAt?: string;
  updatedAt?: string;
  password: string;
  deviceType: string;
  role: string;
  country: string;
  country_code: string;
  currency: string;
  customer_code: string;
  subscription_code: string;
  email_token: string;
  password_retries: number;
  account_locked: boolean;
  account_status: string;
  reset_password_details: {
    reset_token: string;
    reset_token_expiry: string;
  };
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface IOTPData {
  OTP?: string;
  phone_number: string;
  country: string;
  otp_type: string;
  email?: string;
}

export interface IPaymentData {
  user_id: mongoose.Types.ObjectId;
  email: string;
  name: string;
  phone: string;
  currency: string;
  country: string;
  amount: number;
  channels: string[];
}

export interface IMetadata {
  total: number;
  total_active_subscriptions: number;
  total_pending_subscriptions: number;
  total_expired_subscriptions: number;
  current_page: number;
  has_next_page: boolean;
  has_previous_page: boolean;
  next_page: number;
  previous_page: number;
  last_page: number;
}

export interface IReturnData {
  profiles: any[];
  metadata: IMetadata | undefined;
}

export interface IUpdatePrescription {
  user: mongoose.Schema.Types.ObjectId;
  prescription_id: any;
  source: string;
  target: string;
}
