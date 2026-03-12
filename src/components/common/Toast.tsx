import styled from '@emotion/styled';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Flex, Button } from '.';
import { status, useToastStore } from '../../store';
import { useToastUnsubscribe } from '../../hooks';

const Toast = () => {
	const { toast, removeToast } = useToastStore();

	useToastUnsubscribe();

	return (
		<MotionBlock
			isToastNull={toast === null}
			initial={{ y: '100%', opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			whileInView={{ y: '50%', opacity: 1 }}
			exit={{ y: '100%', opacity: 0 }}
			transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}>
			<Container>
				<Flex gap={'16px'}>
					<Status status={toast?.status ?? status['INFO']} />
					<Message>{toast?.message}</Message>
				</Flex>
				<RemoveToastButton type="button" onClick={removeToast}>
					<X size="21" color="var(--white)" />
				</RemoveToastButton>
			</Container>
		</MotionBlock>
	);
};

const MotionBlock = styled(motion.div)<{ isToastNull: boolean }>`
	position: fixed;
	display: ${({ isToastNull }) => (isToastNull ? 'none' : 'block')};
	right: var(--padding-container-mobile);
	bottom: calc(var(--nav-height) + 3 * var(--padding-container-mobile));
	z-index: var(--toast-index);

	@media screen and (min-width: 480px) {
		right: calc(100dvw / 2 - (var(--max-app-width) / 2) + 16px);
	}
`;

const Container = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 8px;
	padding: calc(var(--padding-container-mobile) * 0.6) var(--padding-container-mobile);
	max-width: calc(100dvw - 2 * var(--padding-container-mobile));
	min-width: calc(100dvw - 2 * var(--padding-container-mobile));
	background-color: var(--grey100);
	border: 1px solid var(--greyOpacity100);
	border-radius: var(--radius-s);

	@media screen and (min-width: 640px) {
		max-width: var(--max-app-width);
		min-width: calc(var(--max-app-width) - 2 * var(--padding-container-mobile));
	}
`;

const Status = styled.span<{ status: 'success' | 'warn' | 'info' | 'error' }>`
	display: inline-block;
	width: 12px;
	height: 12px;
	border-radius: var(--radius-extra);
	background-color: ${({ status }) =>
		status === 'success'
			? 'var(--green200)'
			: status === 'warn'
				? 'var(--orange600)'
				: status === 'info'
					? 'var(--blue200)'
					: status === 'error'
						? 'var(--red200)'
						: 'var(--grey400)'};
`;

const Message = styled.p`
	font-size: var(--fz-sm);
	font-weight: var(--fw-semibold);
	color: var(--grey800);
`;

const RemoveToastButton = styled(Button)`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	padding: calc(var(--padding-container-mobile) * 0.15);
	background-color: var(--grey900);
	border-radius: var(--radius-extra);
`;

export default Toast;
