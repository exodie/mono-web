import { Request, Response, NextFunction } from "express";
import type { ErrorMaps } from "../../shared/types";

type ErrorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export const createErrorMiddleware = (errorMap: ErrorMaps): ErrorMiddleware => {
  return (error, _req, res, next) => {
    try {
      console.error("Error occurred:", error);

      // Если ответ уже отправлен - передаем ошибку дальше
      if (res.headersSent) {
        console.warn("Response already sent, forwarding error");
        return next(error);
      }

      // Поиск подходящего обработчика
      const matchedHandler = errorMap.find(([condition]) => {
        try {
          return condition(error);
        } catch (e) {
          console.error("Error in condition handler:", e);
          return false;
        }
      });

      // Обработка найденного обработчика
      if (matchedHandler) {
        const [, response] = matchedHandler;
        console.log(`Handling error with status ${response.status}`);
        return res.status(response.status).json({
          status: response.status,
          message: response.message,
          timestamp: new Date().toISOString(),
        });
      }

      // Дефолтная обработка
      console.error("Unhandled error type:", error);
      res.status(500).json({
        status: 500,
        message: "Internal server error",
        timestamp: new Date().toISOString(),
      });
    } catch (middlewareError) {
      console.error("Error in error middleware:", middlewareError);
      next(middlewareError);
    } finally {
      next();
    }
  };
};