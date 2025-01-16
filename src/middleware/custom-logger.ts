import { log } from '@/shared/log-pino';

export const customLogger = (message: string, ...rest: string[]) => {
	log.info(message, ...rest);
};
