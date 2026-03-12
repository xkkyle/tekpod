import { Suspense } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Button, ShrinkMotionBlock, MODAL_CONFIG, FavoriteDevice, SkeletonLoader, Group } from '../components';
import { supabase } from '../supabase';
import { useClientSession, useLoading } from '../hooks';
import { useToastStore, useModalStore, useUserStore } from '../store';
import { formatByKoreanTime } from '../utils';
import { toastData, routes } from '../constants';

const UpdateProfile = () => {
	const { queryClient, session } = useClientSession();
	const navigate = useNavigate();

	const { resetUser } = useUserStore();
	const { startTransition, Loading, isLoading } = useLoading();
	const { addToast } = useToastStore();
	const { setModal } = useModalStore();

	const handleLogout = async () => {
		try {
			const { error } = await startTransition(supabase.auth.signOut({ scope: 'local' }));

			if (error) {
				throw new Error(error?.message);
			}

			resetUser();
			navigate(routes.HOME, { replace: true });
			addToast(toastData.PROFILE.LOGOUT.SUCCESS);
		} catch (e) {
			console.error(e);
			addToast(toastData.PROFILE.LOGOUT.ERROR);
		} finally {
			queryClient.setQueryData(['auth'], null);
			queryClient.clear();
		}
	};

	const handleUpdateProfileModal = () => {
		const userData = {
			user_id: session.user.id,
			email: session.user?.user_metadata.email,
			nickname: session.user?.user_metadata?.nickname,
		};

		setModal({
			Component: MODAL_CONFIG.USER.PROFILE.Component,
			props: {
				type: MODAL_CONFIG.USER.PROFILE.type,
				data: userData,
			},
		});
	};

	return (
		<Container>
			<UserInfo>
				<Nickname onClick={handleUpdateProfileModal}>
					<Label>Nickname</Label>
					<dd>
						<span>{session.user?.user_metadata?.nickname}</span>
						<ChevronRight size="18" />
					</dd>
				</Nickname>
				<Group>
					<Label>Email</Label>
					<dd>{session.user?.email}</dd>
				</Group>
				<Suspense fallback={<SkeletonLoader width={'100%'} height={'54px'} />}>
					<FavoriteDevice userId={session.user.id} />
				</Suspense>
				<Group>
					<Label>Join in</Label>
					<dd>{formatByKoreanTime(session.user?.created_at)}</dd>
				</Group>
			</UserInfo>
			<Bottom>
				<ResetPasswordButton type="button" onClick={() => navigate(routes.UPDATE_PASSWORD, { state: { email: session.user?.email } })}>
					Update Password
				</ResetPasswordButton>
				<LogoutButton type="button" onClick={handleLogout}>
					{isLoading ? Loading : 'LogOut'}
				</LogoutButton>
			</Bottom>
		</Container>
	);
};

const Container = styled.section`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: 32px;
	height: calc(100dvh - 3 * var(--nav-height));
`;

const UserInfo = styled.dl`
	display: flex;
	flex-direction: column;
	gap: 8px;
	font-size: var(--fz-p);
`;

const Nickname = styled(ShrinkMotionBlock)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: var(--padding-container-mobile);
	font-weight: var(--fw-bold);
	background-color: var(--grey100);
	border: 1px solid var(--grey200);
	border-radius: var(--radius-s);
	cursor: pointer;

	dd {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		gap: 4px;
	}
`;

const Label = styled.dt`
	font-weight: var(--fw-semibold);
`;

const Bottom = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
`;

const ResetPasswordButton = styled(Button)`
	padding: var(--padding-container-mobile);
	width: 100%;
	font-weight: var(--fw-medium);
	border-radius: var(--radius-s);
	color: var(--black);
	background-color: var(--grey100);

	&:hover {
		background-color: var(--grey50);
	}
`;

const LogoutButton = styled(Button)`
	padding: var(--padding-container-mobile);
	width: 100%;
	font-size: var(--fz-p);
	font-weight: var(--fw-medium);
	color: var(--black);
	text-decoration: underline;

	&:hover {
		background-color: var(--grey50);
	}
`;

export default UpdateProfile;
