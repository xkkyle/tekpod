const queryKey = {
	AUTH: ['auth'],
	USER: ['userInfo'],
	DIARY_PAGE_INFO: ['diary_pagination', 'pageInfo'],
	DIARY: ['diary'],
	DIARY_BY_PAGE: ['diaryByPage'],
	FILM_RECIPE: ['film_recipes'],
	TODOS_PAGE_INFO: ['todos_pagination', 'todosInfo'],
	TODOS: ['todos'],
	TODOS_BY_PAGE: ['todosByPage'],
	ALARM: ['alarm'],
	ALARM_NOT_COMPLETED: ['alarm', 'not_completed'],
	EXPENSE_TRACKER: ['expense_tracker'],
	COMMUTE_RECORDS: ['commute_records'],
	FITNESS_RECORDS: ['fitness_records'],
} as const;

export default queryKey;
