import { TokenPayload } from "../core/types/jwt.types";

// menambahkan properti user?: TokenPayload ke Request
// untuk controller atau middleware lain yang membutuhkan data user

declare module "express-serve-static-core" {
  interface Request {
    user?: TokenPayload;
  }
}