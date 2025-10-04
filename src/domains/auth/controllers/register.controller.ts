import { Request, Response, NextFunction } from "express";
import { setAuthCookie } from "../../../core/utils/cookie.util";
import { signJwtToken } from "../../../core/utils/jwt.util";
import { registerService } from "../services/register.service";

export const registerController = async ( req: Request, res: Response, next: NextFunction ) => {
  try {
    // Validate request
    const { email, password, fullName, role } = req.body;

    // Call register service
    const { user, token } = await registerService({ email, password, fullName, role });

    // Sign JWT token
    const jwtToken = signJwtToken(token);

    // Set auth cookie
    setAuthCookie(res, jwtToken);

    return res.json({
      success: true,
      message: "User registered successfully",
      data: {
        user,
        token: jwtToken,
      },
    });
  } catch (err) {
    next(err);
  }
};
