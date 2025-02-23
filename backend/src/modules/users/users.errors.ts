import { createErrorMiddleware } from "../../shared/utils";
import { ErrorMaps } from "../../shared/types";

const errorMap: ErrorMaps = [
  [
    (error) => error.message === "Email already exists",
    { status: 400, message: "Email already exists" },
  ],
  [
    (error) => error.message === "Invalid email format",
    { status: 400, message: "Invalid email format" },
  ],
  [
    (error) => error.message === "Name and email are required",
    { status: 400, message: "Name and email are required" },
  ],
];

export const validateErrors = createErrorMiddleware(errorMap);
