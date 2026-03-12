import { Suspense } from 'react';
import styled from '@emotion/styled';
import { Plus } from 'lucide-react';
import { Button, FilmRecipeContent, FilmRecipeContentLoader, MODAL_CONFIG, MyDevice, SkeletonLoader } from '../components';
import { useModalStore } from '../store';

const FilmRecipePage = () => {
	const { setModal } = useModalStore();

	const handleAddFilmRecipeModal = () => {
		setModal({
			Component: MODAL_CONFIG.FILM_RECIPE.ADD.Component,
			props: { type: MODAL_CONFIG.FILM_RECIPE.ADD.type, data: null },
		});
	};

	return (
		<section>
			<Title>
				📷 My{' '}
				<Suspense fallback={<SkeletonLoader width={'80px'} height={'46px'} />}>
					<MyDevice />
				</Suspense>{' '}
				Recipes
			</Title>
			<AddButton type="button" onClick={handleAddFilmRecipeModal}>
				<Plus size="24" color="var(--white)" />
			</AddButton>
			<Suspense fallback={<FilmRecipeContentLoader />}>
				<FilmRecipeContent />
			</Suspense>
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

const AddButton = styled(Button)`
	position: fixed;
	bottom: calc(var(--nav-height) * 2);
	right: 16px;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	padding: var(--padding-container-mobile) var(--padding-container-mobile);
	background-color: var(--black);
	color: var(--white);
	font-size: var(--fz-h7);
	font-weight: var(--fw-bold);
	border-radius: var(--radius-m);
	z-index: var(--nav-index);

	&:hover,
	&:active {
		background-color: var(--grey900);
	}

	@media screen and (min-width: 480px) {
		right: calc((100dvw - var(--max-app-width)) / 2 + 16px);
	}
`;

export default FilmRecipePage;
