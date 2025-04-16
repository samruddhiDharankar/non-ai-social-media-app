import { Request } from "express";

// Extend the Request type to include the custom user field added by the auth middleware
export interface AuthenticatedRequest extends Request {
  user?: { id: string }; // Optional field that we'll attach after decoding the token
}
