export interface CreateUserItemDto {
	userId: number;
	itemId: number;
}

export interface UpdateUserItemDto {
	userId: number;
	upgrade?: number;
	quantity?: number;
}
