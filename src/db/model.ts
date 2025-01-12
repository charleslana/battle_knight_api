import { InferSelectModel } from 'drizzle-orm';
import { roleEnum, users } from '@/db/schema';

export type User = InferSelectModel<typeof users>;

export type Role = (typeof roleEnum.enumValues)[number];
