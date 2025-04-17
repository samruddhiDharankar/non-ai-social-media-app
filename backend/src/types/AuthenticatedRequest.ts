import { Request } from "express";
import { IUser } from "../models/User";

// Extend the Request type to include the custom user field added by the auth middleware
export interface AuthenticatedRequest extends Request {
  user?: IUser; // Optional field that we'll attach after decoding the token
}
