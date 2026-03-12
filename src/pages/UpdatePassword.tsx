import { useEffect } from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Asterisk } from 'lucide-react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthLogo, Button, LabelInput, updatePasswordSchema, UpdatePasswordSchema } from '../components';
import { supabase } from '../supabase';
import { useClientSession, useLoading } from '../hooks';
import { useUserStore, useToastStore } from '../store';
import { toastData, routes } from '../constants';

const pageCss = {
	container: css`
		max-width: var(--max-app-width);
		min-width: var(--min-app-width);
		margin: 0 auto;
		overflow: hidden;
	`,
	form: css`
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 16px;
		padding: var(--padding-container-mobile);
		height: calc(100dvh - var(--nav-height) * 4);
		background-color: var(--white);
	`,
};

/**
 * If the page is rendered outside of <Layout/>, clicking the `{{ .ConfirmationUrl }}` link in the email will include `{{ .Token }}` in the URL.
 * However, when using `supabase.auth.updateUser`, it returns an error: 'Auth: session is missing'.
 *
 * Therefore, rendering the page inside the <Layout/> component ensures that useAuthQuery() inside <AuthenticationGuard/> retrieves the session (token) from the URL.
 * As a result, supabase confirms the presence of a session when calling `supabase.auth.updateUser`, allowing the password to be updated successfully.
 */

const UpdatePassword = () => {
	const { queryClient } = useClientSession();

	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();
	const { state } = useLocation();

	const { isLoading, Loading, startTransition } = useLoading();
	const { addToast } = useToastStore();
	const { resetUser } = useUserStore();

	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<UpdatePasswordSchema>({ resolver: zodResolver(updatePasswordSchema) });

	useEffect(() => {
		supabase.auth.onAuthStateChange(async event => {
			if (event === 'SIGNED_IN') {
				searchParams.set('email', searchParams.get('email')!);
				setSearchParams(searchParams);
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onSubmit = async (formData: UpdatePasswordSchema) => {
		try {
			const { error: updateUserError } = await startTransition(
				supabase.auth.updateUser({
					password: formData.password,
				}),
			);

			if (updateUserError) {
				throw new Error(updateUserError.message);
			}

			const { error: signOutError } = await startTransition(supabase.auth.signOut({ scope: 'local' }));

			if (signOutError) {
				throw new Error(signOutError?.message);
			}

			resetUser();
			addToast(toastData.PROFILE.UPDATE_PASSWORD.SUCCESS);
			navigate(routes.LOGIN, { replace: true });
		} catch (e) {
			console.error(e);
			addToast(toastData.PROFILE.UPDATE_PASSWORD.ERROR);
		} finally {
			queryClient.setQueryData(['auth'], null);
			queryClient.clear();
		}
	};

	return (
		<div css={pageCss.container}>
			<form css={pageCss.form} onSubmit={handleSubmit(onSubmit)}>
				<AuthLogo />
				<Title>
					<Asterisk size="16" />
					<span>Update Password</span>
					<Asterisk size="16" />
				</Title>

				<EmailInfo>{searchParams.get('email') || state?.email}</EmailInfo>
				<LabelInput label="Password" errorMessage={errors['password']?.message}>
					<LabelInput.TextField type="password" {...register('password')} placeholder="Password" />
				</LabelInput>
				<LabelInput label="Confirm Password" errorMessage={errors['confirmPassword']?.message}>
					<LabelInput.TextField type="password" {...register('confirmPassword')} placeholder="Password Confirm" />
				</LabelInput>
				<SubmitButton type="submit" aria-label="Update Password Button">
					{isLoading ? Loading : 'Submit'}
				</SubmitButton>
			</form>
		</div>
	);
};

const Title = styled.h4`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: calc(var(--padding-container-mobile) * 0.5);
	min-width: 270px;
	min-height: 56px;
	color: var(--blue200);
	background-color: var(--blue100);
	font-size: var(--fz-h6);
	font-weight: var(--fw-bold);
	border-radius: var(--radius-s);
	text-align: center;
`;

const EmailInfo = styled.div`
	padding: var(--padding-container-mobile);
	min-width: 270px;
	border: 1px solid var(--greyOpacity100);
	border-radius: var(--radius-s);
	color: var(--grey700);
	background-color: var(--greyOpacity50);
	font-size: var(--fz-p);
	font-weight: var(--fw-bold);
`;

const SubmitButton = styled(Button)`
	padding: var(--padding-container-mobile);
	min-width: 270px;
	color: var(--white);
	background-color: var(--blue200);
	border-radius: var(--radius-s);
	font-size: var(--fz-p);
	font-weight: var(--fw-semibold);
`;

export default UpdatePassword;
