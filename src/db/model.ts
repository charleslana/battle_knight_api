import { heroes, roleEnum, users } from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';

export type User = InferSelectModel<typeof users>;

export type Role = (typeof roleEnum.enumValues)[number];

export type Hero = InferSelectModel<typeof heroes>;
