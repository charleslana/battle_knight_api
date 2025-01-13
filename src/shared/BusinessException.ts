import { ContentfulStatusCode } from 'hono/utils/http-status';
import { HTTPException } from 'hono/http-exception';

export class BusinessException extends HTTPException {
	constructor(message: string, statusCode: ContentfulStatusCode) {
		super(statusCode, { message: message });
		this.name = 'BusinessException';
	}
}
