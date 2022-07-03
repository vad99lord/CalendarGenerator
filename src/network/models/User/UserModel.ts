import { BirthDate } from "../Birthday/Birthday";
import { BaseUserModel } from "./BaseUserModel";

export type UserPhotoModel = {
  photo100: string;
  photo200: string;
  photoMax: string;
};

export const DEFAULT_USER_PHOTOS: UserPhotoModel = {
  photo100: "https://vk.com/images/camera_100.png",
  photo200: "https://vk.com/images/camera_200.png",
  photoMax: "https://vk.com/images/camera_200.png",
} as const;

export type UserModel = BaseUserModel &
  UserPhotoModel & {
    birthday?: BirthDate;
  };
