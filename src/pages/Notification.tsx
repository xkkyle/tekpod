import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Alarm } from '../supabase';
import { editAlarm, getAlarms } from '../supabase/api/alarm';
import { EmptyMessage, ShrinkMotionBlock } from '../components';
import { queryKey, routes, staleTime, toastData } from '../constants';
import { formatByKoreanTime } from '../utils';
import { useClientSession, useLoading } from '../hooks';
import { useToastStore } from '../store';

// 1. 클릭하여 update isChecked

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
 * isChecked -> notified와 연관 있음
 * todo_id
 *
 * 1. ✅ App Mounted [O]
 * 2. ✅ Get alarm table data
 * 3. ✅  Check any `alarm` data are due to be checked during current month
 * 3 - 1. ✅ keep checking (interval - 10s) -> staleTime
 * 4. ✅ if data exists, show notification button's circle and click to go to Notification Page
 * 4-1. soon (reminder_time < currentTime) Tab
 * 5. ✅ Click todo on Notification Page -> `isChecked` value on Alarm as `true`
 * 6. ✅ Go to TodoReminder Page and Show selected Todo Modal
 *
 * todo 에서 title, todo_reminder 타임을 바꿨을 때 alarm도 같이 업데이트 (isChecked -> false)
 * 매일 아침 9시 -> commute tracker 관련 내용 추가 알림
 * 매일 저녁 10시 -> diary 관련 내용 추가 알림
 */

const NotificationPage = () => {
	const { queryClient } = useClientSession();
	const { data } = useSuspenseQuery<Alarm[]>({ queryKey: queryKey.ALARM, queryFn: getAlarms, staleTime: staleTime.ALARM.LIST });
	const navigate = useNavigate();

	// 시간 얼마 남았는지 표현
	const { addToast } = useToastStore();
	const { startTransition, Loading, isLoading } = useLoading();

	const getAlarmChecked = async ({ todo_id, isChecked }: Pick<Alarm, 'todo_id' | 'isChecked'>) => {
		if (isChecked) return;

		try {
			await startTransition(editAlarm({ todo_id, isChecked: true, updated_at: new Date().toISOString() }));
		} catch (e) {
			console.error(e);
			addToast(toastData.ALARM.CUSTOM('error', 'Something wrong with editing alarm status'));
		} finally {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: queryKey.ALARM }),
				queryClient.invalidateQueries({ queryKey: queryKey.ALARM_NOT_COMPLETED }),
			]);
		}
	};
	return (
		<section>
			<Title>Notifications</Title>
			{data.length === 0 ? (
				<EmptyMessage emoji={'⏰'}>None of Notifications</EmptyMessage>
			) : (
				<NotificationList>
					{data.map(({ id, todo_id, content, reminder_time, isChecked }) => (
						<NotificationItem
							key={id}
							isLoading={isLoading}
							isChecked={isChecked}
							onClick={async () => {
								try {
									await getAlarmChecked({ todo_id, isChecked });

									navigate(routes.TODO_REMINDER, { state: { todo_id, openModal: true } });
								} catch (e) {
									console.error(e);
									throw e;
								}
							}}>
							{isLoading ? (
								Loading
							) : (
								<>
									<p>{content}</p>
									<span>{formatByKoreanTime(reminder_time)}까지</span>
								</>
							)}
						</NotificationItem>
					))}
				</NotificationList>
			)}
		</section>
	);
};

const Title = styled.h2`
	display: flex;
	align-items: center;
	gap: 6px;
	font-size: var(--fz-h5);
	font-weight: var(--fw-black);
	color: var(--grey900);
`;

const NotificationList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-top: 16px;
`;

const NotificationItem = styled(ShrinkMotionBlock)<{ isLoading: boolean; isChecked: boolean }>`
	display: flex;
	justify-content: ${({ isLoading }) => (isLoading ? 'center' : 'space-between')};
	align-items: center;
	gap: 16px;
	padding: calc(var(--padding-container-mobile) * 2) var(--padding-container-mobile);
	background-color: ${({ isChecked }) => (isChecked ? 'var(--white)' : 'var(--blue100)')};
	border: ${({ isChecked }) => (isChecked ? '1px solid var(--grey200)' : 'none')};
	border-radius: var(--radius-xs);
	cursor: pointer;

	p {
		flex: 1;
		overflow-wrap: break-word;
		word-break: break-word;
	}

	span {
		font-size: var(--fz-sm);
		color: var(--grey600);
	}
`;

export default NotificationPage;
