import { isDevEnv } from "@shared/utils/utils";
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  Method as RequestMethod,
} from "axios";
import { ApiResponse } from "../types/ApiResponse";
import { ApiEndpoints, ApiMethodsData } from "./ApiConfig";

export type RequestConfig<D = any> = Omit<
  AxiosRequestConfig<D>,
  "method" | "url" | "data"
>;

const UNKNOWN_ERROR_TEXT = "Unknown error occurred during fetch";

export type AxiosFetchError = string;

export type FetchAxiosParams<E extends ApiEndpoints> = {
  apiEndpoint: string;
  method: RequestMethod;
  data: ApiMethodsData[E]["request"];
  config?: RequestConfig<ApiMethodsData[E]["request"]>;
};

const fetchAxios = async <E extends ApiEndpoints>({
  apiEndpoint,
  method,
  data,
  config = {},
}: FetchAxiosParams<E>): Promise<
  ApiResponse<ApiMethodsData[E]["response"], AxiosFetchError>
> => {
  const requestConfig: AxiosRequestConfig<
    ApiMethodsData[E]["request"]
  > = {
    method,
    url: apiEndpoint,
    data,
    ...config,
  };
  try {
    const { data } = await axios.request<
      ApiMethodsData[E]["response"],
      AxiosResponse<ApiMethodsData[E]["response"]>,
      ApiMethodsData[E]["request"]
    >(requestConfig);
    return { isError: false, data };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const reqUrlText = err.config.url ? `${err.config.url}: ` : "";
      const errText = `${reqUrlText}${err.message}`;
      if (isDevEnv()) {
        const { data } = err.response || {};
        console.log("request:\n", err?.response?.request);
        const responseData =
          data instanceof Blob ? await data.text() : data;
        console.log("response data:\n", responseData);
        console.log("response headers:\n", err?.response?.headers);
      }
      return { isError: true, data: errText };
    } else {
      const errText = UNKNOWN_ERROR_TEXT;
      if (isDevEnv()) {
        console.log(errText, err);
      }
      return { isError: true, data: errText };
    }
  }
};

export default fetchAxios;
