import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Info, X } from 'lucide-react';
import { todoItemSchema, TodoItemSchema } from '.';
import { MODAL_CONFIG, Button, Checkbox, TextInput, SkeletonLoader, LoadingSpinner } from '..';
import { editAlarm, type Todo } from '../../supabase';
import {
	useClientSession,
	useDrag,
	useEditTodoItemContentMutation,
	useRemoveTodoItemMutation,
	useUpdateTodoItemCompletedMutation,
} from '../../hooks';
import { useModalStore, useToastStore } from '../../store';
import { queryKey, toastData } from '../../constants';

interface TodoProps {
	id: string;
	todo: Todo;
	isContentEditing: boolean;
	isDragging: boolean;
	onEditingIdChange: (isEditing: boolean) => void;
	onDraggingIdChange: (isDragging: boolean) => void;
}

// TODO: when individual TodoItem starts to drag, stop the other dragged TodoItem to drag

const TodoItem = ({ id, todo, isContentEditing, isDragging, onEditingIdChange, onDraggingIdChange }: TodoProps) => {
	const { queryClient } = useClientSession();
	const {
		register,
		formState: { errors },
		setFocus,
		handleSubmit,
	} = useForm<TodoItemSchema>({
		resolver: zodResolver(todoItemSchema),
		defaultValues: { content: todo?.content },
	});

	const [isCompleted, setIsCompleted] = useState(todo?.completed);

	const { mutate: editContent, isPending: isEditContentPending } = useEditTodoItemContentMutation(() => onEditingIdChange(false));
	const { mutate: updateTodoCompleted } = useUpdateTodoItemCompletedMutation();
	const { mutate: removeTodo, isPending: isRemovePending } = useRemoveTodoItemMutation();

	const { setModal } = useModalStore();
	const {
		dragX,
		dragContainerRef,
		handlers: { handleTouchStart, handleTouchMove, handleTouchEnd },
	} = useDrag();
	const { addToast } = useToastStore();

	useEffect(() => {
		if (!isDragging && isContentEditing) {
			setFocus('content');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isContentEditing]);

	const handleTodoItemEditModal = () => {
		setModal({
			Component: MODAL_CONFIG.TODO_REMINDER.EDIT.Component,
			props: {
				type: MODAL_CONFIG.TODO_REMINDER.EDIT.type,
				data: todo,
			},
		});

		onEditingIdChange(false);
	};

	const handleUpdateTodoCompleted = (completed: boolean) => {
		updateTodoCompleted({ id: todo.id, completed, updated_at: new Date().toISOString() });
	};

	const handleRemoveTodo = () => {
		removeTodo({ id: todo.id });
	};

	const onSubmit = async ({ content }: TodoItemSchema) => {
		if (content === todo?.content) {
			onEditingIdChange(false);
			return;
		}

		const currentTime = new Date().toISOString();

		try {
			editContent({ id: todo?.id, content, updated_at: new Date().toISOString() });

			await editAlarm({
				todo_id: todo?.id,
				content,
				isChecked: false,
				reminder_time: todo?.reminder_time ?? currentTime,
				updated_at: currentTime,
			});
		} catch (e) {
			console.error(e);
			addToast(toastData.TODO_REMINDER.EDIT.ERROR);
		} finally {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: queryKey.TODOS_BY_PAGE }),
				queryClient.invalidateQueries({ queryKey: queryKey.ALARM }),
				queryClient.invalidateQueries({ queryKey: queryKey.ALARM_NOT_COMPLETED }),
			]);
		}
	};

	return (
		<Container ref={dragContainerRef}>
			<DeleteBackground onClick={handleRemoveTodo}>{isRemovePending ? <LoadingSpinner /> : <X size="24" color="white" />}</DeleteBackground>
			<TodoContent
				isContentEditing={isContentEditing}
				dragX={dragX}
				onTouchStart={e => {
					if (!isContentEditing) {
						handleTouchStart(e);
						onEditingIdChange(false);
					}
				}}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}>
				<Flex>
					<Checkbox
						id={id}
						checked={isCompleted}
						onCheckedChange={setIsCompleted}
						onServerTodoCompletedChange={handleUpdateTodoCompleted}
					/>
					<ContentBoundary>
						{isEditContentPending ? (
							<SkeletonLoader width={'100%'} height={'50px'} />
						) : (
							<>
								{isContentEditing ? (
									<ContentEditingForm onSubmit={handleSubmit(onSubmit)}>
										<TextInput errorMessage={errors?.['content']?.message}>
											<TextInput.TextField
												id="todoItem_content"
												{...register('content')}
												placeholder="Change content"
												variant="md"
												onKeyDown={e => {
													if (e.key === 'Escape') {
														onEditingIdChange(false);
													}
												}}
											/>
										</TextInput>
										<ContentEditingInfoButton type="button" onClick={handleTodoItemEditModal}>
											<Info size="22" color="var(--grey600)" />
										</ContentEditingInfoButton>
										<TodoItemContentSubmitButton type="submit">Submit</TodoItemContentSubmitButton>
									</ContentEditingForm>
								) : (
									<Label
										onClick={() => {
											onEditingIdChange(true);
											onDraggingIdChange(false);
										}}>
										{todo.content}
									</Label>
								)}
							</>
						)}
					</ContentBoundary>
				</Flex>
			</TodoContent>
		</Container>
	);
};

const Container = styled.li`
	position: relative;
	min-height: 60px;
	overflow: hidden;
	cursor: pointer;
`;

const DeleteBackground = styled.div`
	position: absolute;
	right: 0;
	top: 0;
	bottom: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 60px;
	background-color: var(--orange800);
	border-radius: var(--radius-m);
`;

const TodoContent = styled.div<{ isContentEditing: boolean; dragX: number }>`
	position: relative;
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 8px;
	height: 100%;
	min-height: 60px;
	background-color: ${({ isContentEditing }) => (isContentEditing ? 'var(--grey50)' : 'var(--white)')};
	border-radius: ${({ dragX, isContentEditing }) => (dragX < 0 || isContentEditing ? 'var(--radius-m)' : 0)};
	transform: ${({ dragX }) => `translateX(${dragX}px)`};
	transition: transform 0.1s ease-out;
	z-index: 1;
	cursor: pointer;
`;

const Flex = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 8px;
	width: 100%;
`;

const ContentBoundary = styled.div`
	width: 100%;
`;

const ContentEditingForm = styled.form`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
`;

const ContentEditingInfoButton = styled(Button)`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	margin-right: 4px;
	padding: calc(var(--padding-container-mobile) * 0.75);

	&:hover {
		background-color: var(--grey50);
	}
`;

const TodoItemContentSubmitButton = styled(Button)`
	display: none;
`;

const Label = styled.p`
	padding: calc(var(--padding-container-mobile) * 0.75);
	font-size: var(--fz-h7);
	word-break: break-all;
	white-space: pre-wrap;
	cursor: pointer;
`;

export default TodoItem;
