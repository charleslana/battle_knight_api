import { ContentfulStatusCode } from 'hono/utils/http-status';
import { getContext } from '@/db/middleware';

export const successResponse = (message: string, status: ContentfulStatusCode = 200) => {
	const c = getContext();
	return c.json(
		{
			error: false,
			message,
		},
		status
	);
};
