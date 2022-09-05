import { toStringOrEmpty } from "@utils/utils";
import {
  AnyRequestMethodName,
  ErrorData,
} from "@vkontakte/vk-bridge";

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
  console.log(`${failedFetchText}\n${errText}`);
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

export const isVkErrorData = (error: any): error is ErrorData => {
  return (
    typeof error.error_type === "string" &&
    typeof error.error_data === "object"
  );
};

/**
 * @deprecated Doesn't fully covers nested undocumented errors
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logVkError = (err: ErrorData) => {
  const errorText = errorToText(err);
  console.log(errorText);
};

const errorToText = ({
  error_data: errorData,
  error_type: errorType,
}: ErrorData) => {
  switch (errorType) {
    case "api_error": {
      const {
        error_code: code,
        error_msg: msg,
        request_params: requestParams,
      } = errorData;
      return `${code} : ${msg},
      parameters requested: ${requestParams}`;
    }
    case "auth_error": {
      const {
        error_code: code,
        error_reason: reason,
        error_description: description,
      } = errorData;
      return `${code} : ${reason},
      ${toStringOrEmpty(description)}`;
    }
    case "client_error": {
      const {
        error_code: code,
        error_reason: reason,
        error_description: description,
      } = errorData;
      return `${code} : ${reason},
      ${toStringOrEmpty(description)}`;
    }
  }
};
