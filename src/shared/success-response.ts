import { Context } from 'hono';
import { StatusCode } from 'hono/utils/http-status';

export const successResponse = (c: Context, message: string, status: StatusCode = 200) => {
	return c.json(
		{
			error: false,
			message,
		},
		status
	);
};
