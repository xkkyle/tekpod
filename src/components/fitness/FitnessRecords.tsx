import { Fragment } from 'react';
import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import { MODAL_CONFIG, ModalActionMap, modalType } from '../modal';
import { FITNESS_STATUS, queryKey, StatusOption } from '../../constants';
import { type FitnessRecord, getMonthlyFitnessRecords } from '../../supabase';
import { type Month, calendar, formatByKoreanTime, getMonthIndexFromMonths } from '../../utils';
import { useModalStore } from '../../store';
import { useClientSession } from '../../hooks';

interface FitnessRecordsProps {
	yearAndMonth: {
		year: string;
		month: Month;
	};
}

type FitnessRecordModalType = ModalActionMap[typeof modalType.FITNESS_RECORDS];

const FitnessRecords = ({ yearAndMonth: { year, month } }: FitnessRecordsProps) => {
	const { session } = useClientSession();
	const monthIndex = getMonthIndexFromMonths(month) + 1;

	const { data } = useSuspenseQuery({
		queryKey: [...queryKey.FITNESS_RECORDS, `${year}-${(monthIndex + '').padStart(2, '0')}`],
		queryFn: () =>
			getMonthlyFitnessRecords({
				year: +year,
				month: monthIndex,
				user_id: session.user.id,
			}),
	});

	const { setModal } = useModalStore();

	const handleRecordModal = ({
		type,
		day,
		fitnessRecordData,
	}: {
		type: FitnessRecordModalType;
		day: number;
		fitnessRecordData: FitnessRecord | undefined;
	}) => {
		const date = new Date(`${year}-${`${monthIndex}`.padStart(2, '0')}-${`${day}`.padStart(2, '0')}`).toISOString();

		setModal({
			Component: MODAL_CONFIG.FITNESS_RECORDS[type.toUpperCase() as FitnessRecordModalType].Component,
			props: {
				type: MODAL_CONFIG.FITNESS_RECORDS[type.toUpperCase() as FitnessRecordModalType].type,
				action: type,
				data: { ...fitnessRecordData, date: formatByKoreanTime(date) },
			},
		});
	};

	return (
		<Fragment>
			<Overview>
				<div>
					<span>Total Count</span>
					<p>{data.filter(day => day.status === 'present').length}</p>
				</div>
			</Overview>
			<Calendar>
				{calendar[monthIndex].map(day => {
					const workedDay = data.find(item => new Date(item.date).getDate() === day);

					return (
						<Day
							key={day}
							status={workedDay?.status ?? FITNESS_STATUS.ABSENT}
							tabIndex={0}
							onClick={() => {
								handleRecordModal({ type: !workedDay ? 'ADD' : 'EDIT', day, fitnessRecordData: workedDay });
							}}>
							<Label>{day}</Label>
							<Emoji>{workedDay?.status === 'present' ? '🏋' : workedDay?.status === 'absent' ? '💤' : '🏝️'}</Emoji>
						</Day>
					);
				})}
			</Calendar>
		</Fragment>
	);
};

const Overview = styled.div`
	display: flex;
	gap: 8px;
	margin-top: 16px;
	width: 100%;

	div {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--padding-container-mobile);
		width: 100%;
		background: var(--gradient-blue100);
		border: 1px solid var(--grey100);
		border-radius: var(--radius-s);

		span {
			color: var(--white);
			font-weight: var(--fw-semibold);
		}

		p {
			color: var(--white);
			font-size: var(--fz-h7);
			font-weight: var(--fw-semibold);
		}
	}
`;

const Calendar = styled.ul`
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	grid-auto-rows: 1fr;
	gap: 8px;
	margin: 16px auto;
`;

const Day = styled.li<{ status: StatusOption }>`
	display: inline-flex;
	flex-direction: column;
	align-items: center;
	padding: calc(var(--padding-container-mobile) * 0.25);
	min-width: 48px;
	aspect-ratio: 1 / 1;
	font-weight: var(--fw-semibold);
	color: ${({ status }) => (status === 'absent' ? 'var(--grey8000)' : status === 'present' ? 'var(--white)' : 'var(--grey50)')};
	background: ${({ status }) =>
		status === 'absent' ? 'var(--grey50)' : status === 'present' ? 'var(--gradient-blue50)' : 'var(--grey50)'};
	border: 1px solid ${({ status }) => (status === 'absent' ? 'var(--grey50)' : status === 'present' ? 'var(--blue300)' : 'var(--grey100)')};
	border-radius: var(--radius-l);
	cursor: pointer;
`;

const Label = styled.span`
	display: inline-block;
	width: 100%;
	text-align: start;
`;

const Emoji = styled.span`
	font-size: var(--fz-h4);

	@media screen and (min-width: 640px) {
		font-size: var(--fz-h3);
	}
`;

export default FitnessRecords;
