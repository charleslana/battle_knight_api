import { HTTPException } from 'hono/http-exception';
import { StatusCode } from 'hono/utils/http-status';

export class BusinessException extends HTTPException {
	constructor(message: string, statusCode: StatusCode) {
		super(statusCode, { message: message });
		this.name = 'BusinessException';
	}
}
