import { isDevEnv } from "@shared/utils/utils";
import {
  AnyRequestMethodName,
  ErrorData,
} from "@vkontakte/vk-bridge";
import { VKBridgeError } from "./types/VkBridgeFetch";

type VkErrorTypes = Pick<ErrorData, "error_type">["error_type"];
type VkErrorPrintableTypes = Record<VkErrorTypes, string>;
const VK_ERROR_TYPES_PRINT: VkErrorPrintableTypes = {
  api_error: "API error",
  auth_error: "Auth error",
  client_error: "Client error",
};

export const logVkBridgeError = <T extends AnyRequestMethodName>(
  err: unknown,
  method: T
) => {
  const failedFetchText = `Failed to fetch ${method}`;
  const errText = isVkErrorData(err) ? vkErrorToText(err) : err;
  if (isDevEnv()) {
    console.log(`${failedFetchText}\n${errText}`);
  }
};

export const vkErrorToText = ({
  error_type: type,
  error_data: data,
}: ErrorData) => {
  const typeText = `${VK_ERROR_TYPES_PRINT[type]}`;
  const dataText = `${JSON.stringify(data)}`;
  const errorText = `${typeText}:\n${dataText}`;
  return errorText;
};

export const vkBridgeErrorToString = (err?: VKBridgeError) => {
  if (!err) return "";
  if (typeof err === "string") return err;
  return vkErrorToText(err);
};

export const isVkErrorData = (error: any): error is ErrorData => {
  return (
    typeof error.error_type === "string" &&
    typeof error.error_data === "object"
  );
};
