export interface CreateUserDto {
	email: string;
	password: string;
}

export interface UpdateUserDto {
	email: string;
	password: string;
	name: string | null;
}
