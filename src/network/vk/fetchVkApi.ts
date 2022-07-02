import { VK_API_V } from "./Constants";
import { fetchVkBridge } from "./fetchVkBridge";
import {
  MethodsNames,
  MethodsParamsMap,
  MethodsResponsesMap,
  VkApiFetchResponse,
} from "./types/VkApi";

export const fetchVkApi = async <M extends MethodsNames>(
  method: M,
  params: MethodsParamsMap<M>,
  token: string
): Promise<VkApiFetchResponse<M>> => {
  const { isError, data } = await fetchVkBridge(
    "VKWebAppCallAPIMethod",
    {
      method: method,
      params: {
        access_token: token,
        v: VK_API_V,
        ...params,
      },
    }
  );
  if (!isError) {
    // manually extracting response since from data
    // since bridge doesn't do it for us in api case
    const { response } = data;
    if (isMethodResponse(response)) {
      return { isError, data: response };
    } else
      return {
        isError: true,
        data: `Received response for ${method} of unexpected shape: ${response}`,
      };
  } else {
    return { isError, data: null };
  }
};

// TODO: change simple casting type guard to correct checks for types?????

const isMethodResponse = <M extends MethodsNames>(
  response: any
): response is MethodsResponsesMap<M> => {
  return true;
};
