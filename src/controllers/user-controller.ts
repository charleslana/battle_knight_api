import { AuthDto } from '@/db/dto/auth-dto';
import { Context } from 'hono';
import { User } from '@/db/model';
import { UserDto } from '@/db/dto/user-dto';
import { userService } from '@/services/user-service';

export const userController = {
	async create(c: Context) {
		const dto = await c.req.json<UserDto>();
		console.log(`REST: create user: ${dto.email}`);
		return await userService.create(c, dto.email, dto.password);
	},

	async getAll(c: Context) {
		console.log('REST: get all users');
		const users = await userService.getAll(c);
		return c.json(users, 200);
	},

	async get(c: Context) {
		const id = parseInt(c.req.param('id'));
		console.log(`REST: get user: ${id}`);
		const user = await userService.get(c, id);
		return c.json(user, 200);
	},

	async update(c: Context) {
		const id = parseInt(c.req.param('id'));
		const model = await c.req.json<User>();
		console.log(`REST: update user ${JSON.stringify(model)} with id: ${id}`);
		const updatedUser = await userService.update(c, id, model);
		return c.json(updatedUser[0], 200);
	},

	async remove(c: Context) {
		const id = parseInt(c.req.param('id'));
		console.log(`REST: delete user: ${id}`);
		return await userService.remove(c, id);
	},

	async getMe(c: Context) {
		const payload = c.get('jwtPayload') as null | AuthDto;
		let userId = 0;
		if (payload) {
			userId = payload.id;
		}
		console.log(`REST: get user me: ${userId}`);
		const user = await userService.get(c, userId);
		return c.json(user, 200);
	},
};
