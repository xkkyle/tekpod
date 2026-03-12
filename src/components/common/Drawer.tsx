import { AnimationEvent, ReactNode, useState } from 'react';
import styled from '@emotion/styled';
import { Plus } from 'lucide-react';
import { Button, Portal } from '..';
import { useTriggerEscape } from '../../hooks';
import { customPropReceiver } from '../../constants';

/**
 * TODO:
 * 1 - change itself depending on position like 'top' or 'bottom'
 * 2 - use animation for mobile
 * 3 - GrabArea - develop animated movement using touch event
 */

interface DrawerProps {
	position: 'top' | 'bottom';
	isOpen: boolean;
	title: string | ReactNode;
	open?: () => void;
	close: () => void;
	children: ReactNode;
}

const Drawer = ({ position, title, isOpen, close, children }: DrawerProps) => {
	const [isClosing, setIsClosing] = useState(false);

	const handleModalClose = () => setIsClosing(true);

	useTriggerEscape({ condition: !isClosing, trigger: handleModalClose });

	const handleAnimationEnd = (e: AnimationEvent<HTMLDivElement>) => {
		if (isClosing && e.target === e.currentTarget) {
			close();
		}
	};

	return (
		<Portal>
			<Container role="dialog" position={position} isOpen={!isClosing} aria-label="dialog" onAnimationEnd={handleAnimationEnd}>
				<Header>
					<Title>{title}</Title>
					<AdditionalActions isShown={position === 'top'}>
						<Button type="button" onClick={handleModalClose}>
							<RotatableSvg size={24} color="var(--black)" $isActive={isOpen} />
						</Button>
					</AdditionalActions>
				</Header>
				<GrabArea isShown={position === 'bottom'} />
				<Body>{children}</Body>
			</Container>
			<Overlay id="dialog-overlay" isOpen={!isClosing} onClick={handleModalClose} aria-label="dialog-overlay" />
		</Portal>
	);
};

const Container = styled.div<{ position: 'top' | 'bottom'; isOpen: boolean }>`
	position: fixed;
	top: ${({ position }) => (position === 'top' ? '0' : 'auto')};
	left: 0;
	right: 0;
	bottom: ${({ position }) => (position === 'bottom' ? '0' : 'auto')};
	margin: 0 auto;
	padding: 0 var(--padding-container-mobile) var(--padding-container-mobile);
	max-width: var(--max-app-width);
	min-width: var(--min-app-width);
	border-radius: ${({ position }) => (position === 'top' ? '0 0 var(--radius-l) var(--radius-l)' : 'var(--radius-l) var(--radius-l) 0 0')};
	background-color: var(--white);
	z-index: var(--drawer-index);
	animation: ${({ isOpen }) =>
		isOpen ? 'slideDrawerDown 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards' : 'slideDrawerUp 0.2s ease forwards'};
	-webkit-animation: ${({ isOpen }) =>
		isOpen ? 'slideDrawerDown 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards' : 'slideDrawerUp 0.2s ease forwards'};

	@keyframes slideDrawerUp {
		from {
			transform: translate3d(0, 0, 0);
		}
		to {
			transform: translate3d(0, -100%, 0);
		}
	}

	@keyframes slideDrawerDown {
		from {
			transform: translate3d(0, -100%, 0);
		}
		to {
			transform: translate3d(0, 0, 0);
		}
	}
`;

const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 7px 0;
`;

const Title = styled.h4`
	font-size: var(--fz-h5);
	font-weight: var(--fw-bold);
`;

const GrabArea = styled.div<{ isShown: boolean }>`
	display: ${({ isShown }) => (isShown ? 'block' : 'none')};
	margin: 16px auto 0;
	width: 100px;
	height: 8px;
	border-radius: var(--radius-extra);
	background-color: var(--greyOpacity100);
`;

const Body = styled.div`
	height: auto;
`;

const AdditionalActions = styled.div<{ isShown: boolean }>`
	display: ${({ isShown }) => (isShown ? 'flex' : 'none')};
	justify-content: flex-end;
`;

const RotatableSvg = styled(Plus, customPropReceiver)<{ $isActive: boolean }>`
	transform: ${({ $isActive }) => ($isActive ? 'rotate(45deg)' : 'rotate(0deg)')};
	transition: transform 0.1s ease-in-out;
`;

const Overlay = styled.div<{ isOpen: boolean }>`
	position: fixed;
	margin: 0 auto;
	max-width: var(--max-app-width);
	min-width: var(--min-app-width);
	height: 100dvh;
	background-color: rgba(0, 0, 0, 20%);
	inset: 0px;
	visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
	opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
	z-index: calc(var(--drawer-index) - 1);
	transition:
		visibility 0.3s ease-in-out,
		opacity 0.3s ease-in-out;
	cursor: pointer;
	animation: ${({ isOpen }) => (isOpen ? 'fadeIn 0.3s ease forwards' : 'fadeOut 0.2s ease forwards')};

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes fadeOut {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}
`;

export default Drawer;
