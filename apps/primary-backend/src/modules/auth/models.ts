import { t } from "elysia";

export namespace AuthModel {
  export const signinSchema = t.Object({
    email: t.String(),
    password: t.String(),
  });

  export type signinSchema = typeof signinSchema.static;

  export const signinResponseSchema = t.Object({
    message: t.Literal("Signed in"),
    token: t.String(),
  });

  export type signinResponse = typeof signinResponseSchema.static;

  export const signinFailureSchema = t.Object({
    message: t.Literal("Incorrect Credentials"),
  });

  export type signinFailedResponse = typeof signinFailureSchema.static;

  /////////////////////////////////////
  export const signupSchema = t.Object({
    email: t.String(),
    password: t.String(),
  });

  export type signupSchema = typeof signupSchema.static;

  export const signupResponseSchema = t.Object({
    id: t.String(),
  });

  export type signupResponse = typeof signupResponseSchema.static;

  export const signupFailedResponseSchema = t.Object({
    message: t.Literal("Error while signing up"),
  });

  export type signupFailedResponse = typeof signupFailedResponseSchema.static;
}
