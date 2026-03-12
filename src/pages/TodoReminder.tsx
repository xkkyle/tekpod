import { FormEvent, Suspense, useState } from 'react';
import styled from '@emotion/styled';
import { Plus } from 'lucide-react';
import { Button, SegmentedControl, ShrinkMotionBlock, TextInput, TodoList, TodoListLoader } from '../components';
import { addTodo } from '../supabase';
import { useClientSession, useLoading } from '../hooks';
import { useToastStore } from '../store';
import { queryKey, toastData } from '../constants';
import { addAlarm } from '../supabase/api/alarm';
import { getNextDay } from '../utils';

/**
 * data에 변화가 있음을 감지 (postgres_changes)
 *
 *
 */

/**
 * created_at
 * user_id
 * id
 * content
 * isChecked
 * todo_id
 *
 * 1. App Mounted
 * 2. Get alarm table data
 * 3. Check any `alarm` data are due to be checked (reminder_time < currentTime )
 * 3 - 1. keep checking (interval - 30s)
 * 4. if data exists, show notification button's circle and click to go to Notification Page
 * 4-1. soon (reminder_time < currentTime) Tab
 * 5. Click todo on Notification Page -> change `notified` value on todos & `isChecked` value on Alarm as `true`
 * 6. Go to TodoReminder Page and Show selected Todo Modal
 */

export type ControlOption = (typeof segmentedControlOptions)[number];
const segmentedControlOptions = ['All', 'Checked', 'Unchecked'] as const;

const TodoReminderPage = () => {
	const { queryClient, session } = useClientSession();

	const [value, setValue] = useState('');
	const [controlOption, setControlOption] = useState<ControlOption>(segmentedControlOptions[0]);

	const { addToast } = useToastStore();
	const { startTransition, Loading, isLoading } = useLoading();

	const handleTodoAdd = async (e: FormEvent) => {
		e.preventDefault();

		if (value.length === 0) {
			return addToast(toastData.TODO_REMINDER.CREATE.WARN);
		}

		const currentTime = new Date().toISOString();
		const nextDay = getNextDay(currentTime);

		try {
			const todo = await startTransition(
				addTodo({
					user_id: session?.user?.id,
					completed: false,
					content: value,
					created_at: currentTime,
					updated_at: currentTime,
					reminder_time: nextDay,
					tags: [],
				}),
			);

			await startTransition(
				addAlarm({
					user_id: session?.user?.id,
					todo_id: todo[0].id,
					content: value,
					isChecked: false,
					reminder_time: nextDay,
					created_at: currentTime,
					updated_at: currentTime,
				}),
			);

			addToast(toastData.TODO_REMINDER.CREATE.SUCCESS);
			setValue('');
		} catch (e) {
			console.error(e);
			addToast(toastData.TODO_REMINDER.CREATE.ERROR);
		} finally {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: queryKey.TODOS_BY_PAGE }),
				queryClient.invalidateQueries({ queryKey: queryKey.ALARM_NOT_COMPLETED }),
			]);
		}
	};

	return (
		<Container>
			<Form onSubmit={handleTodoAdd}>
				<TextInput>
					<TextInput.ControlledTextField
						id="todo-input"
						name="todo-input"
						placeholder={'New Reminder'}
						value={value}
						onChange={e => setValue(e.target.value)}
					/>
				</TextInput>
				<ShrinkMotionBlock>
					<AddTodoButton type="submit" aria-label="Add todo">
						{isLoading ? Loading : <Plus size="21" color="var(--white)" />}
					</AddTodoButton>
				</ShrinkMotionBlock>
			</Form>

			<SegmentedControl options={segmentedControlOptions} current={controlOption} setCurrent={setControlOption} />

			<Suspense fallback={<TodoListLoader />}>
				<TodoList controlOption={controlOption} />
			</Suspense>
		</Container>
	);
};

const Container = styled.section`
	width: 100%;
`;

const Form = styled.form`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16px;

	& > div:first-of-type {
		flex: 1; // make remained space for TextInput
		min-width: 250px; // make it shrinkable setting min-width: 0;
	}
`;

const AddTodoButton = styled(Button)`
	padding: 16px;
	min-width: 56px;
	min-height: 56px;
	font-weight: var(--fw-semibold);
	color: var(--white);
	background-color: var(--black);
	border-radius: var(--radius-m);
`;

export default TodoReminderPage;
