import { Request, Response, NextFunction } from "express";
import { loginService } from "../services/login.service";
import { setAuthCookie } from "../../../core/utils/cookie.util";
import { loginSchema } from "../validations/auth.validations";
import { logger } from "../../../config/logger";

export const loginController = async ( req: Request, res: Response, next: NextFunction ) => {
  try {
    // validate request body
    const { username, password } = loginSchema.parse(req.body);
    logger.info(`Attempting login for user: ${username}`);

    const { user, token } = await loginService({ username, password });
    logger.info(`User ${username} logged in successfully`);

    // Set token as httpOnly cookie
    setAuthCookie(res, token);
    logger.info(`Auth cookie set for user: ${username}`);

    logger.info(`Login successful for user: ${username}`);

    return res.json({
      success: true,
      message: "Login successful",
      data: { user, token },
    });
  } catch (err) {
    logger.error(`Login failed: ${(err as Error).message}`);
    next(err);
  }
};
