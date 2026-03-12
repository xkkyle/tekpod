import styled from '@emotion/styled';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button, ShrinkMotionBlock } from '../components';
import { useUserStore } from '../store';
import { navigationLinks, routes } from '../constants';

const MyPage = () => {
	const navigate = useNavigate();
	const { userInfo } = useUserStore();

	return (
		<Container>
			<UserInfo>
				<User>✹ {userInfo?.user?.user_metadata?.nickname || userInfo?.user?.email?.split('@').at(0)} </User>
				<EditButton type="button" onClick={() => navigate(routes.PROFILE, { state: { user: userInfo?.user } })}>
					Edit
				</EditButton>
			</UserInfo>
			<Navigations>
				{navigationLinks.map(({ to, title }) => (
					<Link to={to} key={to}>
						<StyledShrinkMotionBlock>
							<ArrowRight size="24" strokeWidth="3" color="var(--grey300)" />
							<span>{title}</span>
						</StyledShrinkMotionBlock>
					</Link>
				))}
			</Navigations>
		</Container>
	);
};

const Container = styled.section`
	display: flex;
	flex-direction: column;
	gap: 32px;
	margin-bottom: 32px;
`;

const UserInfo = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: calc(var(--padding-container-mobile)) calc(var(--padding-container-mobile) * 0.75);
	width: 100%;
	background: linear-gradient(135deg, var(--blue200), var(--grey200));
	border-radius: var(--radius-s);
`;

const User = styled.h2`
	font-size: var(--fz-h5);
	font-weight: var(--fw-bold);
	color: var(--white);
`;

const EditButton = styled(Button)`
	padding: calc(var(--padding-container-mobile) * 0.5) calc(var(--padding-container-mobile) * 0.75);
	font-size: var(--fz-sm);
	font-weight: var(--fw-medium);
	color: var(--black);
	background-color: var(--grey50);
	border: 1px solid var(--grey100);
	border-radius: var(--radius-s);

	&:hover {
		background-color: var(--grey100);
	}
`;

const Navigations = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

const StyledShrinkMotionBlock = styled(ShrinkMotionBlock)`
	display: flex;
	align-items: center;
	gap: 16px;
	padding: var(--padding-container-mobile);
	background-color: var(--greyOpacity50);
	border-radius: var(--radius-m);
	font-size: var(--fz-h7);
	font-weight: var(--fw-semibold);
	transition: background-color 0.15s ease-in-out;

	&:focus {
		background-color: var(--greyOpacity100);
	}
`;

export default MyPage;
