import { createErrorMiddleware } from "../../shared/utils";
import { ErrorMaps } from "../../shared/types";

const errorMap: ErrorMaps = [
  [
    (error) => error.message === "Email already exists",
    { status: 400, message: "Email already exists" },
  ],
  [
    (error) => error.message === "Email and password are required.",
    { status: 400, message: "Email and password are required." },
  ],
  [
    (error) => error.message === "Invalid email format",
    { status: 400, message: "Invalid email format" },
  ],
  [
    (error) => error.message === "User not found",
    { status: 404, message: "User not found" },
  ],
  [
    (error) => error.message === "Invalid credentials",
    { status: 401, message: "Invalid credentials" },
  ],
];

export const validateErrors = createErrorMiddleware(errorMap);
