import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';

export const swaggerRoute = new OpenAPIHono();

swaggerRoute.openapi(
	createRoute({
		tags: ['hello world'],
		method: 'get',
		path: '/hello',
		responses: {
			200: {
				description: 'Respond a message',
				content: {
					'application/json': {
						schema: z.object({
							message: z.string(),
						}),
					},
				},
			},
		},
	}),
	(c) => {
		return c.json({
			message: 'hello',
		});
	}
);
swaggerRoute.openapi(
	createRoute({
		tags: ['hello world'],
		method: 'post',
		path: '/form-data/',
		request: {
			body: {
				content: {
					'application/json': {
						schema: z
							.object({
								foo: z.string(),
								bar: z.string(),
								image: z.instanceof(File).or(z.string()).openapi({
									type: 'string',
									format: 'binary',
								}),
							})
							.openapi({
								required: ['foo'],
							}),
					},
				},
			},
		},
		responses: {
			200: {
				description: 'form data ok response',
				content: {
					'application/json': {
						schema: z.object({
							message: z.string(),
						}),
					},
				},
			},
		},
	}),
	(c) => {
		return c.json({
			message: 'hello',
		});
	}
);

swaggerRoute.doc('/doc', {
	openapi: '3.0.0',
	info: {
		version: '1.0.0',
		title: 'My API',
		description: 'Test',
	},
});

swaggerRoute.get('/ui', swaggerUI({ url: '/doc' }));
