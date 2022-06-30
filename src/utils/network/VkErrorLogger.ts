import { ErrorData } from "@vkontakte/vk-bridge";
import { toStringOrEmpty } from "../utils";

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

export default logVkError;
