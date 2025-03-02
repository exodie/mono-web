import { Router } from "express";
import { api } from "./api";
import { publicRouter } from "./public";
import { authenticateUserByJwt } from "../../../modules/auth/auth.middleware";

export const router = Router();

router.use(publicRouter);
router.use(authenticateUserByJwt);
router.use(api);
