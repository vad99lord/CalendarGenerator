import { Request, Response } from "express";

type RequestFirstParam<S = Request> = S extends Request<infer T>
  ? T
  : never;
export type RequestTypedBody<ReqBody> = Request<
  RequestFirstParam,
  any,
  ReqBody
>;
export type ResponseTypedBody<ResBody> = Response<ResBody>;
