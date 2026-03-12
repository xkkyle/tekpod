import { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
import { supabase } from '../../supabase';
import { getSubscribed, getUncompletedAlarms } from '../../supabase/api/alarm';
import { queryKey, routes, staleTime } from '../../constants';

// TODO: add count of reminder_time < currentTime or new Todo
const NotificationLink = () => {
	const { data } = useSuspenseQuery({
		queryKey: queryKey.ALARM_NOT_COMPLETED,
		queryFn: getUncompletedAlarms,
		staleTime: staleTime.ALARM.NOT_COMPLETED,
	});

	// const [_, setReminder] = useState<RealtimePostgresChangesPayload<{ [key: string]: unknown }>>(); // toast에 담을 메세지 저장
	const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

	// layout nav 단계에서 체킹 하고 있는 형태
	useEffect(() => {
		channelRef.current = getSubscribed();

		return () => {
			channelRef.current?.unsubscribe();
		};
	}, []);

	return (
		<Container to={routes.NOTIFICATION}>
			<Bell size="21" color="var(--black)" />
			<Count>{data.count}</Count>
		</Container>
	);
};

const Container = styled(Link)`
	position: relative;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	width: 30px;
	height: 30px;
	cursor: pointer;
	transition: background-color 0.15s ease-in-out;

	&:active {
		border-radius: var(--radius-xs);
		background-color: var(--grey100);
	}
`;

const Count = styled.span`
	position: absolute;
	top: 0;
	right: 0;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	width: 16px;
	height: 16px;
	color: var(--white);
	background: var(--gradient-blue100);
	border-radius: var(--radius-extra);
	font-size: var(--fz-xs);
	font-weight: var(--fw-medium);
`;

export default NotificationLink;
