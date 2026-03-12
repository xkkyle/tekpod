import './styles/font.css';
import 'react-day-picker/style.css';
import { Global } from '@emotion/react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import GlobalStyle from './styles/GlobalStyle';
import AuthenticationGuard from './guard/AuthenticationGuard';
import { Layout, DiaryLayout, MyPageLayout, LoadLazy, RouteError, ExpenseTrackerLayout } from './components';
import { routes } from './constants';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 0,
		},
	},
});

const router = createBrowserRouter(
	[
		{
			path: routes.HOME,
			errorElement: <RouteError />,
			element: <Layout />,
			children: [
				{
					index: true,
					element: <AuthenticationGuard redirectTo={routes.LOGIN} element={LoadLazy('Home')} />,
				},
				{
					path: routes.FILM_RECIPE,
					element: <AuthenticationGuard redirectTo={routes.LOGIN} element={LoadLazy('FilmRecipe')} />,
				},
				{
					path: routes.DIARY,
					element: <AuthenticationGuard redirectTo={routes.LOGIN} element={<DiaryLayout />} />,
					children: [
						{
							index: true,
							element: LoadLazy('Diary'),
						},
						{ path: `:diaryId`, element: LoadLazy('DiaryContent') },
					],
				},
				{
					path: routes.WRITE,
					element: <AuthenticationGuard redirectTo={routes.LOGIN} element={LoadLazy('Write')} />,
				},
				{
					path: routes.TODO_REMINDER,
					element: <AuthenticationGuard redirectTo={routes.LOGIN} element={LoadLazy('TodoReminder')} />,
				},
				{
					path: routes.NOTIFICATION,
					element: <AuthenticationGuard redirectTo={routes.LOGIN} element={LoadLazy('Notification')} />,
				},
				{
					path: routes.EXPENSE_TRACKER,
					element: <AuthenticationGuard redirectTo={routes.LOGIN} element={<ExpenseTrackerLayout />} />,
					children: [
						{
							index: true,
							element: LoadLazy('ExpenseTracker'),
						},
						{ path: `daily`, element: LoadLazy('ExpenseTrackerByMonth') },
						{ path: `daily/:id`, element: LoadLazy('ExpenseTrackerByMonthItem') },
						{ path: `upcoming`, element: LoadLazy('ExpenseTrackerFixedCost') },
						{ path: `report`, element: LoadLazy('ExpenseTrackerReport') },
					],
				},
				{
					path: routes.COMMUTE_TRACKER,
					element: <AuthenticationGuard redirectTo={routes.LOGIN} element={LoadLazy('CommuteRecords')} />,
				},
				{
					path: routes.FITNESS_TRACKER,
					element: <AuthenticationGuard redirectTo={routes.LOGIN} element={LoadLazy('FitnessTracker')} />,
				},
				{
					path: routes.POMODORO_TIMER,
					element: <AuthenticationGuard redirectTo={routes.LOGIN} element={LoadLazy('PomodoroTimer')} />,
				},
				{
					path: `${routes.USER}`,
					element: <AuthenticationGuard redirectTo={routes.LOGIN} element={<MyPageLayout />} />,
					children: [
						{
							index: true,
							element: LoadLazy('MyPage'),
						},
						{
							path: `profile`,
							element: LoadLazy('UpdateProfile'),
						},
						{
							path: `update-password`,
							element: LoadLazy('UpdatePassword'),
						},
					],
				},
			],
		},
		{ path: routes.LOGIN, element: LoadLazy('Login') },
		{ path: routes.REGISTER, element: LoadLazy('Register') },
		{
			path: '/*',
			element: LoadLazy('NotFound'),
		},
	],
	{
		future: {
			v7_relativeSplatPath: true,
		},
	},
);

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<Global styles={GlobalStyle} />
			<RouterProvider router={router} future={{ v7_startTransition: true }} />
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
};

export default App;
