import { Request, Response, NextFunction } from "express";
import { loginService } from "../services/login.service";
import { setAuthCookie } from "../../../core/utils/cookie.util";
import { loginSchema } from "../validations/auth.validations";

export const loginController = async ( req: Request, res: Response, next: NextFunction ) => {
  try {
    // validate request body
    const { username, password } = loginSchema.parse(req.body);
    const { user, token } = await loginService({ username, password });

    // Set token as httpOnly cookie
    setAuthCookie(res, token);

    return res.json({
      success: true,
      message: "Login successful",
      data: { user, token },
    });
  } catch (err) {
    next(err);
  }
};
