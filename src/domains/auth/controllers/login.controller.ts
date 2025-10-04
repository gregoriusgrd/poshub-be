import { Request, Response, NextFunction } from "express";
import { loginService } from "../services/login.service";
import { setAuthCookie } from "../../../core/utils/cookie.util";
import { signJwtToken } from "../../../core/utils/jwt.util";

export const loginController = async ( req: Request, res: Response, next: NextFunction ) => {
  try {
    // Validate request
    const { email, password } = req.body;

    // Call login service
    const { user, token } = await loginService({ email, password });

    // Sign JWT token
    const jwtToken = signJwtToken(token);

    // Set auth cookie
    setAuthCookie(res, jwtToken);

    return res.json({
      success: true,
      message: "Login successful",
      data: {
        user,
        token: jwtToken,
      },
    });
  } catch (err) {
    next(err);
  }
};
