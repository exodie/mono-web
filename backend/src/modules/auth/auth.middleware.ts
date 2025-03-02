import passport from "passport";

export const authenticateUserByJwt = passport.authenticate("jwt", { session: false });
