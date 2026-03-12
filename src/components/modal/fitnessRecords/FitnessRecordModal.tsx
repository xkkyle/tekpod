/* eslint-disable no-mixed-spaces-and-tabs */
import styled from '@emotion/styled';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isEqual } from 'es-toolkit';
import { ModalDataType, ModalLayout } from '..';
import { StatusSelect, Button, TextInput, Flex } from '../..';
import { type FitnessRecordSchema, fitnessRecordSchema } from './schema';
import { type ServiceDataType, type FitnessRecord, addFitnessRecord, updateFitnessRecord, removeFitnessRecord } from '../../../supabase';
import { useClientSession, useLoading } from '../../../hooks';
import { useToastStore } from '../../../store';
import { queryKey, toastData, FITNESS_STATUS, fitnessStatusList } from '../../../constants';

type FitnessRecordAction = 'ADD' | 'EDIT';

interface RecordModalProps {
	id: string;
	type: ModalDataType;
	action: FitnessRecordAction;
	data: ServiceDataType<FitnessRecord>;
	onClose: () => void;
}

const userAction = {
	ADD: 'ADD',
	EDIT: 'EDIT',
	REMOVE: 'REMOVE',
} as const;

const getDefaultValues = (action: FitnessRecordAction, data: ServiceDataType<FitnessRecord>) => {
	if (action === userAction.ADD) {
		return {
			status: FITNESS_STATUS.PRESENT,

			notes: '',
		};
	}

	if (action === userAction.EDIT) {
		return {
			status: data?.status,
			notes: data?.notes,
		};
	}
};

const FitnessRecordModal = ({ id, type, action, data: serviceData, onClose }: RecordModalProps) => {
	const { queryClient, session } = useClientSession();
	const defaultValues = getDefaultValues(action, serviceData);

	const {
		register,
		watch,
		formState: { errors },
		setValue,
		handleSubmit,
	} = useForm<FitnessRecordSchema>({
		resolver: zodResolver(fitnessRecordSchema),
		defaultValues,
	});

	const { startTransition, Loading, isLoading } = useLoading();
	const { addToast } = useToastStore();

	const handleDeleteFitnessRecord = async () => {
		try {
			if (serviceData?.id) {
				await startTransition(removeFitnessRecord({ id: serviceData?.id }));

				addToast(toastData.FITNESS.REMOVE.SUCCESS);
			}
		} catch (e) {
			console.error(e);
			addToast(toastData.FITNESS.REMOVE.ERROR);
		} finally {
			if (serviceData?.date) {
				const _date = new Date(serviceData?.date);
				onClose();

				queryClient.invalidateQueries({
					queryKey: [...queryKey.FITNESS_RECORDS, `${_date.getFullYear()}-${(_date.getMonth() + 1 + '').padStart(2, '0')}`],
				});
			}
		}
	};

	const onSubmit = async (data: FitnessRecordSchema) => {
		if (!serviceData?.date) return;

		const { date } = serviceData;

		const actionProperty = action === userAction.ADD ? 'CREATE' : userAction.EDIT;

		try {
			const callback =
				action === userAction.ADD
					? addFitnessRecord({
							...data,
							user_id: session?.user?.id,
							date,
							created_at: date,
							updated_at: date,
						})
					: updateFitnessRecord({
							...data,
							id: serviceData?.id,
							user_id: session?.user?.id,
							updated_at: date,
						});

			if (action === 'EDIT' && isEqual(defaultValues, data)) {
				addToast(toastData.FITNESS.CUSTOM('warn', 'Notes are not changed'));
				return;
			}

			await startTransition(callback);

			addToast(toastData.FITNESS[actionProperty].SUCCESS);
		} catch (e) {
			console.error(e);
			addToast(toastData.FITNESS[actionProperty].ERROR);
		} finally {
			const _date = new Date(date);
			onClose();

			queryClient.invalidateQueries({
				queryKey: [...queryKey.FITNESS_RECORDS, `${_date.getFullYear()}-${(_date.getMonth() + 1 + '').padStart(2, '0')}`],
			});
		}
	};

	return (
		<ModalLayout id={id} type={type} title={'Add Record'} onClose={onClose}>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<StatusSelect
					data={fitnessStatusList}
					currentValue={watch('status')}
					error={errors['status']}
					onSelect={data => {
						setValue('status', data, { shouldValidate: true, shouldTouch: true });
					}}
				/>

				<TextInput errorMessage={errors['notes']?.message}>
					<TextInput.TextField id="notes" {...register('notes')} placeholder="Notes" variant="sm" />
				</TextInput>
				<ButtonGroup justifyContent={'space-between'} gap={'16px'} width={'100%'}>
					{action === 'EDIT' && (
						<DeleteButton type="button" onClick={handleDeleteFitnessRecord}>
							Delete
						</DeleteButton>
					)}
					<SubmitButton type="submit">{isLoading ? Loading : action === 'EDIT' ? 'Edit my record' : 'Save my record'}</SubmitButton>
				</ButtonGroup>
			</Form>
		</ModalLayout>
	);
};

const Form = styled.form`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	gap: 16px;
	margin-top: 16px;
	padding: calc(var(--padding-container-mobile) * 0.25);
	width: 100%;
	cursor: pointer;
`;

const ButtonGroup = styled(Flex)`
	margin-top: 16px;
`;

const DeleteButton = styled(Button)`
	padding: var(--padding-container-mobile);
	width: 100%;
	color: var(--black);
	background-color: var(--white);
	border: 1px solid var(--grey100);
	border-radius: var(--radius-s);
	font-size: var(--fz-p);
	font-weight: var(--fw-semibold);

	&:active,
	&:focus {
		background-color: var(--grey100);
	}
`;

const SubmitButton = styled(Button)`
	padding: var(--padding-container-mobile);
	width: 100%;
	color: var(--white);
	background-color: var(--black);
	font-size: var(--fz-p);
	font-weight: var(--fw-semibold);

	&:active,
	&:focus {
		background-color: var(--greyOpacity900);
	}

	&:disabled {
		background-color: var(--greyOpacity400);
	}
`;

export default FitnessRecordModal;
