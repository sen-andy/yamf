import { pgTable, pgEnum, serial, text, boolean, jsonb, integer, timestamp  } from 'drizzle-orm/pg-core'

export const ticketStatus = pgEnum('ticket_status',['open', 'pending', 'unrepairable', 'closed'])
export const systemUser = pgEnum('system_user', ['admin', 'agent'])
export const deviceType = pgEnum('device_type', ['mobile', 'computer'])

export const admins = pgTable('admins', {
    id: serial('id').primaryKey(),
    role: systemUser('role').default('agent'),
    settings: jsonb('settings')
})

export const tickets = pgTable('tickets', {
    id: serial('id').primaryKey(),
    user_name: integer('user_name').references(() => users.username),
    device_serial: integer('device_serial').references(() => devices.serial).notNull(),
    incident: text('incident').default('log'),
    description: text('description').notNull(),
    imageUrl: text('image_url'),
    status: ticketStatus('status').default('open'),
    comments: text('comments').array().default([]),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow()
})

export const users = pgTable('users', {
    username: serial('username').primaryKey(),
    jamfId: text('jamf_id'),
    firstName: text('first_name').notNull(),
    middleName: text('middle_name'),
    lastName: text('last_name').notNull(),
    grade: integer('grade'),
    createdAt: timestamp('createdAt').defaultNow()
})

export const devices = pgTable('devices', {
    serial: serial('serial').primaryKey(),
    jamfId: text('jamf_id'),
    model: text('model'),
    type: deviceType('type').default('mobile').notNull(),
    createdAt: timestamp('createdAt').defaultNow()
})