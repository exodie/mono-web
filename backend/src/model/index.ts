import { User } from './users';
import { Event } from './events';

// Жду NestJS
User.hasMany(Event, { foreignKey: 'createdBy' });
Event.belongsTo(User, { foreignKey: 'createdBy' });

export * from './events';
export * from './users';
export * from './tokens';
