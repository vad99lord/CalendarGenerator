import vkBridge, {
  AnyRequestMethodName,
  VKBridge,
} from "@vkontakte/vk-bridge";
import {
  QueryParams,
  VkBridgeFetchResponse,
} from "./types/VkBridgeFetch";
import { isVkErrorData, logVkBridgeError } from "./VkErrorLogger";

export const fetchVkBridge = async <T extends AnyRequestMethodName>(
  ...params: QueryParams<T>
) => {
  return fetchVkBridgeInstance(vkBridge, ...params);
};

export const fetchVkBridgeInstance = async <
  T extends AnyRequestMethodName
>(
  bridge: VKBridge,
  ...params: QueryParams<T>
): Promise<VkBridgeFetchResponse<T>> => {
  try {
    const result = await bridge.send(...params);
    // console.log(result);

    return { isError: false, data: result };
  } catch (err: unknown) {
    logVkBridgeError(err, params[0]);
    if (isVkErrorData(err)) {
      return { isError: true, data: err };
    } else {
      return { isError: true, data: null };
    }
  }
};
