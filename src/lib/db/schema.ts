import { pgTable, pgEnum, serial, text, boolean, jsonb, integer, timestamp  } from 'drizzle-orm/pg-core'

export const ticketStatus = pgEnum('ticket_status',['open', 'pending', 'unrepairable', 'done'])
export const systemUser = pgEnum('system_user', ['admin', 'agent'])

export const admins = pgTable('admins', {
    id: serial('id').primaryKey(),
    role: systemUser('role').default('agent'),
    settings: jsonb('settings')
})

export const tickets = pgTable('tickets', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id),
    deviceId: integer('device_id').references(() => devices.id).notNull(),
    incident: text('incident').default('log'),
    description: text('description').notNull(),
    imgUrl: text('img_url'),
    status: ticketStatus('status').default('open'),
    comments: text('comments').array(),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow()
})

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    jamfId: text('jamf_id'),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    location: text('location'),
    grade: integer('grade').notNull(),
    insurance: boolean('insurance').default(false),
    createdAt: timestamp('createdAt').defaultNow()
})

export const devices = pgTable('devices', {
    id: serial('id').primaryKey(),
    jamfId: text('jamf_id'),
    serialNumber: text('serial_number').unique().notNull(),
    model: text('model'),
    type: text('type').notNull(),
    createdAt: timestamp('createdAt').defaultNow()
})