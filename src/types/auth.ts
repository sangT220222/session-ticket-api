import { Request } from "express";
import type { ParamsDictionary } from "express-serve-static-core";

export type AuthenticatedUser = {
  id: string;
  email: string;
  role: string;
};

export type AuthenticatedRequest<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> = Request<P, ResBody, ReqBody, ReqQuery> & {
  user: AuthenticatedUser;
};
