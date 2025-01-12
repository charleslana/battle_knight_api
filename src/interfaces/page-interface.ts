export default interface IPageInterface<T> {
	results: T[];
	totalCount: number;
	totalPages: number;
	currentPage: number;
	hasNextPage: boolean;
}
