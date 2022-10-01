import { CalendarUserApiRequest } from "@shared/models/CalendarUser";
import { ApiResponse } from "../types/ApiResponse";
import { AxiosFetchError } from "./fetchAxios";

const BASE_URL = "/.netlify/functions/server/api";

const endpointUrl = (endpoint: string): string =>
  `${BASE_URL}/${endpoint}`;

export const API_ENDPOINTS = {
  GenerateCalendar: (): string => {
    return endpointUrl("calendar");
  },
};

export type ApiEndpoints = keyof typeof API_ENDPOINTS;
export type ApiUrl<E extends ApiEndpoints> = typeof API_ENDPOINTS[E];

export type ApiMethodData<
  E extends ApiEndpoints,
  ReqData extends any = any,
  ResData extends any = any
> = Record<E, { request: ReqData; response: ResData }>;

export type ApiMethodsData = ApiMethodData<
  "GenerateCalendar",
  CalendarUserApiRequest,
  Blob
>;

export type AxiosApiResponse<E extends ApiEndpoints> = ApiResponse<
  ApiMethodsData[E]["response"],
  AxiosFetchError
>;
