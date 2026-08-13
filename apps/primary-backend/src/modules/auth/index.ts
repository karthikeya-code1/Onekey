import { Cookie, Elysia, status } from "elysia";
import { AuthModel } from "./models";
import { AuthService } from "./service";
import jwt from "@elysiajs/jwt";
import { prisma } from "db";

export const app = new Elysia({ prefix: "auth" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
    }),
  )
  .post(
    "/sign-up",
    async ({ body, status }) => {
      try {
        const userId = await AuthService.signup(body.email, body.password);
        return {
          id: userId,
        };
      } catch (e) {
        console.log(e);
        return status(400, {
          message: "Error while signing up",
        });
      }
    },
    {
      body: AuthModel.signupSchema,
      response: {
        200: AuthModel.signupResponseSchema,
        400: AuthModel.signupFailedResponseSchema,
      },
    },
  )
  .post(
    "/sign-in",
    async ({ jwt, body, status, cookie: { auth } }) => {
      const { correctCredentials, userId } = await AuthService.signin(
        body.email,
        body.password,
      );
      if (correctCredentials && userId) {
        const token = await jwt.sign({ userId });

        auth.set({
          value: token,
          httpOnly: true,
          sameSite: "none",
          secure: true,
          maxAge: 7 * 86400,
          path: "/",
        });
        return {
          message: "Signed in",
          token,
        };
      } else {
        return status(403, {
          message: "Incorrect Credentials",
        });
      }
    },
    {
      body: AuthModel.signinSchema,
      response: {
        200: AuthModel.signinResponseSchema,
        403: AuthModel.signinFailureSchema,
      },
    },
  )
  .get("/me", async ({ jwt, cookie: { auth }, headers, status }) => {
    let tokenStr = auth?.value as string | undefined;
    const authHeader = headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      tokenStr = authHeader.substring(7);
    }

    if (!tokenStr) {
      return status(401, { message: "Unauthorized" });
    }
    const decoded = await jwt.verify(tokenStr);
    if (!decoded || !decoded.userId) {
      return status(401, { message: "Unauthorized" });
    }
    const user = await prisma.user.findUnique({
      where: { id: Number(decoded.userId) },
      select: {
        id: true,
        email: true,
        credits: true,
      },
    });
    if (!user) {
      return status(401, { message: "User not found" });
    }
    return {
      id: user.id.toString(),
      email: user.email,
      credits: user.credits,
    };
  })
  .post("/sign-out", async ({ cookie: { auth } }) => {
    if (auth) {
      auth.set({
        value: "",
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 0,
        path: "/",
      });
    }
    return {
      message: "Signed out" as const,
    };
  });
