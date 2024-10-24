import mongoose, { Schema, Document } from "mongoose";

export interface IEnv {
  nodeEnv?: string;
  baseApiURL?: string;
  MAILGUN_API_KEY?: string;
  MAILGUN_DOMAIN?: string;
  API_KEY?: string;
  AUTH_TOKEN_SECRET?: string;
  ACCESS_TOKEN_EXPIRY?: string;
  REFRESH_TOKEN_EXPIRY?: string;
  JWT_SECRET?: string;
  bucketName?: string;
  accessKey?: string;
  secretKey?: string;
}

export interface IMetadata {
  total: number;
  current_page: number;
  has_next_page: boolean;
  has_previous_page: boolean;
  next_page: number | null;
  previous_page: number | null;
  last_page: number;
}
export interface IUser {
  id: string;
  name: string;
  mobileNumber: string;
  tag: string;
  profile_picture?: {
    public_id: string;
    url: string;
  };
  following: mongoose.Types.ObjectId[];
  followers: mongoose.Types.ObjectId[];
}

export interface ICategory {
  title: string;
  description: string;
  cover_image: string; // URL as a string
}

export interface IVideodata {
  author_name: string;
  author_url: string;
  height: number;
  html: string;
  provider_name: string;
  provider_url: string;
  thumbnail_height: number;
  thumbnail_url: string;
  thumbnail_width: number;
  title: string;
  type: string;
  version: string;
  width: number;
  thumbnail: string;
}

export interface IVideo extends Document {
  videoId: string;
  source: string;
  category: Schema.Types.ObjectId;
  date: Date;
  videodata: IVideodata;
  user_id: Schema.Types.ObjectId;
}

export interface IFolder extends Document {
  link: string;
  category: Schema.Types.ObjectId;
  cover_image: string;
  title: string;
  description: string;
  user_id: Schema.Types.ObjectId;
}
