import { GetLaunchParamsResponse } from "@vkontakte/vk-bridge";
import StoreData from "./StoreData";

export type LaunchParams = GetLaunchParamsResponse;

export type ConfigStore = StoreData<LaunchParams>;
