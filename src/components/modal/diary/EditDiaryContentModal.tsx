import styled from '@emotion/styled';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { SquarePen } from 'lucide-react';
import { isEqual } from 'es-toolkit';
import { ModalLayout, type ModalDataType, editContentFormSchema, EditContentFormSchema } from '..';
import { Button, TagsInput, TextArea, TextInput } from '../..';
import { useClientSession, useLoading } from '../../../hooks';
import { Diary, updateDiary } from '../../../supabase';
import { queryKey, routes, toastData } from '../../../constants';
import { useToastStore } from '../../../store';

interface EditDiaryContentModalProps {
	id: string;
	data: Diary;
	type: ModalDataType;
	onClose: () => void;
}

const EditDiaryContentModal = ({ id, type, data, onClose }: EditDiaryContentModalProps) => {
	const { queryClient } = useClientSession();
	const {
		register,
		control,
		formState: { errors },
		handleSubmit,
	} = useForm<EditContentFormSchema>({
		resolver: zodResolver(editContentFormSchema),
		defaultValues: {
			title: data?.title,
			content: data?.content,
			feeling: data?.feeling,
			tags: data?.tags!.map((tag, idx) => ({ id: idx, tag })),
		},
	});

	const navigate = useNavigate();
	const { startTransition, Loading, isLoading } = useLoading();
	const { addToast } = useToastStore();

	const onSubmit = async (updatedData: EditContentFormSchema) => {
		const isUnedited =
			data?.title === updatedData?.title &&
			data?.content === updatedData?.content &&
			data?.feeling === updatedData?.feeling &&
			isEqual(
				data?.tags,
				updatedData.tags.map(({ tag }) => tag),
			);

		if (isUnedited) {
			addToast(toastData.DIARY.EDIT.WARN);
			return;
		}

		try {
			const { error } = await startTransition(
				updateDiary({
					...data,
					...updatedData,
					tags: updatedData.tags.map(({ tag }) => tag),
					updated_at: new Date().toISOString(),
				}),
			);

			if (error) {
				throw new Error(error.message);
			}

			onClose();
			addToast(toastData.DIARY.EDIT.SUCCESS);
			navigate(routes.DIARY);
		} catch (e) {
			console.error(e);
			addToast(toastData.DIARY.EDIT.ERROR);
		} finally {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: queryKey.DIARY_BY_PAGE }),
				queryClient.invalidateQueries({ queryKey: queryKey.DIARY_PAGE_INFO }),
			]);
		}
	};

	return (
		<ModalLayout id={id} type={type} title={<SquarePen size="27" color="var(--black)" />} onClose={onClose}>
			<Group onSubmit={handleSubmit(onSubmit)}>
				<TextInput errorMessage={errors?.title?.message}>
					<TextInput.TextField id="title" {...register('title')} placeholder="﹡ Title" />
				</TextInput>
				<Controller
					name="content"
					control={control}
					render={({ field: { name, value, onChange, onBlur }, fieldState: { error } }) => (
						<TextArea errorMessage={error?.message}>
							<TextArea.TextField
								id="content"
								name={name}
								value={value}
								onChange={onChange}
								onBlur={onBlur}
								placeholder="→ What I did"
								modalType={'edit'}
							/>
						</TextArea>
					)}
				/>
				<TextInput errorMessage={errors?.feeling?.message}>
					<TextInput.TextField id="feeling" {...register('feeling')} name="feeling" placeholder="💡 One Feeling" />
				</TextInput>
				<Controller
					name="tags"
					control={control}
					render={({ field: { name, value, onChange } }) => <TagsInput inputId={name} tags={value} onChange={onChange} />}
				/>
				<UpdateButton type="submit">{isLoading ? Loading : 'Upload'}</UpdateButton>
			</Group>
		</ModalLayout>
	);
};

const Group = styled.form`
	display: flex;
	flex-direction: column;
	gap: 16px;
	height: 100%;
`;

const UpdateButton = styled(Button)`
	margin-top: 32px;
	padding: var(--padding-container-mobile);
	font-size: var(--fz-p);
	font-weight: var(--fw-semibold);
	color: var(--white);
	background-color: var(--black);

	&:active,
	&:focus {
		background-color: var(--greyOpacity900);
	}
`;

export default EditDiaryContentModal;
