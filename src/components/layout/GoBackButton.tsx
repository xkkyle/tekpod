import { ReactNode } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { RiArrowLeftLine } from 'react-icons/ri';
import { Button, ShrinkMotionBlock } from '..';
import { useModalStore } from '../../store';

interface GoBackButtonProps {
	children?: ReactNode;
}

const GoBackButton = ({ children = <RiArrowLeftLine size="24" color="var(--grey500)" /> }: GoBackButtonProps) => {
	const navigate = useNavigate();
	const { resetModals } = useModalStore();

	return (
		<StyledShrinkMotionBlock>
			<StyledButton
				type="button"
				onClick={() => {
					navigate(-1);
					resetModals();
				}}
				aria-label="Go back to previous Route">
				{children}
			</StyledButton>
		</StyledShrinkMotionBlock>
	);
};

const StyledShrinkMotionBlock = styled(ShrinkMotionBlock)`
	display: flex;
	align-items: center;
`;

const StyledButton = styled(Button)`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	min-width: 32px;
	min-height: 32px;
	background-color: var(--greyOpacity50);
	border: 1px solid var(--greyOpacity200);
	border-radius: var(--radius-s);

	&:hover {
		background-color: var(--greyOpacity100);
	}
`;

export default GoBackButton;
