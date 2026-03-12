import { useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { ChevronLeft } from 'lucide-react';
import { GoBackButton, AddQuickDrawerMemoButton, Logo, NotificationLink } from '..';
import { routes } from '../../constants';

const Header = () => {
	const { pathname } = useLocation();

	const isGoBackButtonActive =
		pathname.includes(routes.EXPENSE_TRACKER) ||
		pathname.includes(routes.TODO_REMINDER) ||
		pathname.includes(routes.NOTIFICATION) ||
		[...pathname].filter(item => item === '/').length >= 2;

	return (
		<>
			{!pathname.includes(routes.UPDATE_PASSWORD) && (
				<Container id="layout-header">
					<ReactiveLogo>
						{isGoBackButtonActive ? (
							<GoBackButton>
								<ChevronLeft size="24" color="var(--grey800)" />
							</GoBackButton>
						) : (
							<Logo />
						)}
					</ReactiveLogo>
					<Actions>
						<NotificationLink />
						<AddQuickDrawerMemoButton />
					</Actions>
				</Container>
			)}
		</>
	);
};

const Container = styled.header`
	position: fixed;
	top: 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 0 auto;
	padding: 0 var(--padding-container-mobile);
	max-width: var(--max-app-width);
	min-width: var(--min-app-width);
	width: 100%;
	height: var(--nav-height);
	background-color: var(--white);
	border-bottom: 1px solid var(--greyOpacity100);
	z-index: var(--nav-index);
`;

const ReactiveLogo = styled.h1`
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Actions = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 12px;
`;

export default Header;
