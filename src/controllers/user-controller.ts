import { Context } from 'hono';
import { User } from '@/db/model';
import { UserDto } from '@/db/dto/user-dto';
import { userService } from '@/services/user-service';

export const userController = {
	async create(c: Context) {
		const dto = await c.req.json<UserDto>();
		console.log(`REST: create user: ${JSON.stringify(dto)}`);
		const user = await userService.create(c, dto.email, dto.password);
		return c.json(user, 201);
	},

	async fetchAll(c: Context) {
		console.log('REST: get all users');
		const users = await userService.fetchAll(c);
		return c.json(users, 200);
	},

	async fetch(c: Context) {
		const id = parseInt(c.req.param('id'));
		console.log(`REST: get user: ${id}`);
		const user = await userService.fetch(c, id);
		return c.json(user, 200);
	},

	async modify(c: Context) {
		const id = parseInt(c.req.param('id'));
		const model = await c.req.json<User>();
		console.log(`REST: update user ${JSON.stringify(model)} with id: ${id}`);
		const updatedUser = await userService.modify(c, id, model);
		return c.json(updatedUser[0], 200);
	},

	async remove(c: Context) {
		const id = parseInt(c.req.param('id'));
		console.log(`REST: delete user: ${id}`);
		await userService.remove(c, id);
		return c.json({ message: 'User deleted successfully' }, 200);
	},

	async findByEmail(c: Context) {
		const id = parseInt(c.req.param('id'));
		console.log(`REST: delete user: ${id}`);
		await userService.remove(c, id);
		return c.json({ message: 'User deleted successfully' }, 200);
	},
};
