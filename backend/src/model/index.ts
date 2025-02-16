import { User } from "./users";
import { Event } from "./events";

User.hasMany(Event, { foreignKey: "createdBy" });
Event.belongsTo(User, { foreignKey: "createdBy" });

export * from "./events";
export * from "./users";
