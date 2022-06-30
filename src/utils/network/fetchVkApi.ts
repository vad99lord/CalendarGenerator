import vkBridge, {
  AnyRequestMethodName,
  ErrorData, VKBridge,
  VKBridgeSend
} from "@vkontakte/vk-bridge";
import logVkError from "./VkErrorLogger";

//extra variable makes possible to extract generic parameters from send function
let send: VKBridgeSend;
export type QueryParams<T extends AnyRequestMethodName> = Parameters<typeof send<T>>;

export const fetchVkApi = async <T extends AnyRequestMethodName>(
  ...params: QueryParams<T>
) => {
  return fetchBridgeVkApi(vkBridge, ...params);
};

export const fetchBridgeVkApi = async <
  T extends AnyRequestMethodName
>(
  bridge: VKBridge,
  ...params: QueryParams<T>
) => {
  try {
    const result = await bridge.send(...params);
    return result;
  } catch (err) {
    if (isErrorData(err)) {
      logVkError(err);
      return err;
    } else {
      console.log(err);
      //TODO no rethrow?
      throw err;
    }
  }
};

export const isErrorData = (error: any): error is ErrorData => {
  return (
    typeof error.error_type === "string" &&
    typeof error.error_data === "object"
  );
};

export const isValidResponse = <T>(
  response: T | ErrorData
): response is T => !isErrorData(response);
