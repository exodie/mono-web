// Лучше бы это были yml :)
export const getSwaggerOptions = (port: number) => {
  return {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Mono-web",
        version: "0.6.0",
        description: "API для управления мероприятиями и пользователями",
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT || 8001}/api`,
          description: "Development server",
        },
      ],
      components: {
        schemas: {
          Event: {
            type: "object",
            properties: {
              id: { type: "integer" },
              title: { type: "string" },
              description: { type: "string" },
              date: { type: "string", format: "date-time" },
              createdBy: { type: "integer" },
            },
          },
          User: {
            type: "object",
            properties: {
              id: { type: "integer" },
              name: { type: "string" },
              email: { type: "string", format: "email" },
              password: { type: "string", minLength: 8 },
              createdAt: { type: "string", format: "date-time" },
            },
          },
        },
      },
    },
    apis: ["./src/modules/*/*.ts"],
  };
};
