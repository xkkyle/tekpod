import { AnimationEvent, Fragment, ReactNode, useState } from 'react';
import styled from '@emotion/styled';
import { X } from 'lucide-react';
import { Button } from '..';
import { type ModalDataType } from '.';
import { useOverlayFixed, useTriggerEscape } from '../../hooks';

interface ModalLayoutProps {
	id: string;
	type: ModalDataType;
	title: string | ReactNode;
	onClose: () => void;
	children: ReactNode;
}

const ModalLayout = ({ id, type, title, onClose, children }: ModalLayoutProps) => {
	const [isClosing, setIsClosing] = useState(false);
	useOverlayFixed(!isClosing);

	const handleModalClose = () => setIsClosing(true);

	useTriggerEscape({ condition: !isClosing, trigger: handleModalClose });

	const handleAnimationEnd = (e: AnimationEvent<HTMLDivElement>) => {
		if (isClosing && e.target === e.currentTarget) {
			onClose();
		}
	};

	return (
		<Fragment>
			<Container
				isVisible={!isClosing}
				order={+id}
				data-modal-type={type}
				data-modal-id={`modal-${id}`}
				onAnimationEnd={handleAnimationEnd}>
				<GrabArea />
				<Header id={`modal-${id}-header`}>
					<Title>{title}</Title>
					<CloseButton type="button" onClick={handleModalClose}>
						<X size="24" color="var(--black)" />
					</CloseButton>
				</Header>
				<Body id={`modal-${id}-body`}>{children}</Body>
			</Container>
			<Overlay
				id={`overlay-${id}`}
				isVisible={!isClosing}
				onAnimationEnd={handleAnimationEnd}
				onClick={handleModalClose}
				aria-hidden={isClosing}
			/>
		</Fragment>
	);
};

const Container = styled.div<{ isVisible: boolean; order: number }>`
	position: fixed;
	bottom: 0;
	margin: 0 auto;
	padding: var(--padding-container-mobile) var(--padding-container-mobile) calc(var(--padding-container-mobile) * 2)
		var(--padding-container-mobile);
	max-width: var(--max-app-width);
	min-width: var(--min-app-width);
	width: 100%;
	background-color: ${({ order }) => (order === 0 ? 'var(--white)' : `var(--grey50)`)};
	border-top-left-radius: var(--radius-l);
	border-top-right-radius: var(--radius-l);
	border-top: ${({ order }) => (order === 0 ? 'none' : '1px solid var(--grey100)')};
	transition: transform 0.3s ease;
	z-index: var(--modal-index);
	animation: ${({ isVisible }) =>
		isVisible ? 'slideModalUp 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards' : 'slideModalDown 0.2s ease forwards'};
	-webkit-animation: ${({ isVisible }) =>
		isVisible ? 'slideModalUp 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards' : 'slideModalDown 0.2s ease forwards'};
	-webkit-overflow-scrolling: touch; // iOS scroll support
	-ms-overflow-style: none; // IE and Edge
	scrollbar-width: none; // Firefox
	&::-webkit-scrollbar {
		display: none; // hide scrollbar (optional)
	}

	@keyframes slideModalUp {
		from {
			transform: translate3d(0, 100%, 0);
		}
		to {
			transform: translate3d(0, 0, 0);
		}
	}

	@keyframes slideModalDown {
		from {
			transform: translate3d(0, 0, 0);
		}
		to {
			transform: translate3d(0, 100%, 0);
		}
	}
`;

const GrabArea = styled.div`
	margin: 4px auto;
	width: 100px;
	height: 8px;
	background-color: var(--grey100);
	border-radius: var(--radius-extra);
	cursor: pointer;
`;

const Header = styled.div`
	display: flex;
	justify-content: space-between;
`;

const Title = styled.h2`
	font-size: var(--fz-h5);
	font-weight: var(--fw-bold);
`;

const CloseButton = styled(Button)`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	padding: calc(var(--padding-container-mobile) / 4);
`;

const Body = styled.div`
	max-height: calc(100dvh - var(--nav-height) * 3);
	overflow-y: scroll;

	scrollbar-width: none; // Firefox
	&::-webkit-scrollbar {
		display: none; // hide scrollbar
	}
`;

const Overlay = styled.div<{ isVisible: boolean }>`
	position: fixed;
	max-width: var(--max-app-width);
	min-width: var(--min-app-width);
	margin: 0 auto;
	height: 100dvh;
	background-color: rgba(0, 0, 0, 35%);
	inset: 0px;
	z-index: var(--overlay-index);
	cursor: pointer;
	animation: ${({ isVisible }) => (isVisible ? 'fadeIn 0.3s ease forwards' : 'fadeOut 0.2s ease forwards')};

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

export default ModalLayout;
