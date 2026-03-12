import { Bell, Calculator, Camera, Layers, NotebookPen, Timer, Volleyball } from 'lucide-react';
import { routes } from '.';

const navigationLinks = [
	{
		to: routes.TODO_REMINDER,
		icon: <Bell size="42" strokeWidth="2" color="var(--white)" />,
		title: 'Todo',
	},
	{
		to: routes.EXPENSE_TRACKER,
		icon: <Calculator size="42" color="var(--blue100)" />,
		title: 'Expense',
	},
	{
		to: routes.COMMUTE_TRACKER,
		icon: <Layers size="40" color="var(--blue100)" />,
		title: 'Commute',
	},
	{
		to: routes.FITNESS_TRACKER,
		icon: <Volleyball size="42" color="var(--blue100)" />,
		title: 'Fitness',
	},
	{
		to: routes.DIARY,
		icon: <NotebookPen size="42" color="var(--blue100)" />,
		title: 'Diary',
	},
	{
		to: routes.FILM_RECIPE,
		icon: <Camera size="46" color="var(--blue100)" />,
		title: 'Recipe',
	},
	{
		to: routes.POMODORO_TIMER,
		icon: <Timer size="48" color="var(--blue100)" />,
		title: 'Pomodoro',
	},
] as const;

export default navigationLinks;
