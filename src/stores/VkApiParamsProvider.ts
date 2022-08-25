import {
  MethodsNames,
  MethodsParamsMap,
} from "../network/vk/types/VkApi";
import { VkApiFetchDeps } from "./VkApiFetchDepsProvider";

export interface VkApiParamsProvider<
  QueryParams extends object,
  Method extends MethodsNames
> {
  getVkApiParams(
    params: QueryParams &
      Pick<Required<VkApiFetchDeps>, "launchParams">
  ): MethodsParamsMap<Method>;
  method: Method;
}
