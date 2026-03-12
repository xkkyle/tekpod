import { Suspense, useState } from 'react';
import styled from '@emotion/styled';
import placeholderImage from '../../../assets/placeholder-gray.webp';
import { Star } from 'lucide-react';
import { MODAL_CONFIG, type ModalDataType } from '..';
import {
	ModalLayout,
	LazyImage,
	FilmRecipeImageUpload,
	TextInput,
	CustomSelect,
	Button,
	FilmRecipeStaticFields,
	LazyImageLoader,
} from '../..';
import { editRecipe, type RestricedRecipeWithImage } from '../../../supabase';
import { useModalStore, useToastStore } from '../../../store';
import { useClientSession, useFilmRecipeImage, useLoading } from '../../../hooks';
import { filmRecipeFieldData, FILM_RECIPE_FORM, toastData, queryKey } from '../../../constants';
import { validateTitle } from '../../../utils';

interface FilmRecipeModalProps {
	id: string;
	type: ModalDataType;
	data: RestricedRecipeWithImage;
	onClose: () => void;
}

const FilmRecipeModal = ({ id, type, data, onClose }: FilmRecipeModalProps) => {
	const { queryClient } = useClientSession();
	const { setModal } = useModalStore();

	const [isEditing, setEditing] = useState<boolean>(false);
	const [isPrimary, setIsPrimary] = useState<boolean>(data?.primary);

	const {
		image: { imageUrl, currentRecipeImage, isAttached },
		setImageUrlOnEditing,
		handleImageUpload,
		handleImageRemove,
	} = useFilmRecipeImage({ DEFAULT_IMAGE_SIZE: FILM_RECIPE_FORM.IMAGE.MAX_SIZE, isEditing });

	const { startTransition, Loading, isLoading } = useLoading();
	const { addToast } = useToastStore();

	const [currentFilmFeature, setCurrentFilmFeature] = useState<RestricedRecipeWithImage>(data);

	const hasChanges = () => {
		// check if image is changed
		const isFilmRecipePrimaryChanged = isPrimary !== data?.primary;
		const isImageChanged = imageUrl !== data?.imgSrc || currentRecipeImage !== null;

		// check if the other fields are changed
		const isFieldsChanged = Object.keys(filmRecipeFieldData).some(key => {
			const fieldKey = key.toLowerCase().replace(/([A-Z])/g, '_$1') as keyof typeof data;
			return currentFilmFeature[fieldKey]?.toString() !== data[fieldKey]?.toString();
		});

		return isFilmRecipePrimaryChanged || isImageChanged || isFieldsChanged;
	};

	const handleUpdateRecipe = async () => {
		const titleValidationResult = validateTitle(currentFilmFeature.title);

		if (titleValidationResult) {
			return addToast(toastData.FILM_RECIPE.EDIT.ERROR.TITLE_REQUIRED(titleValidationResult));
		}

		try {
			// case 1 (sameImage - image modification doesn't exist): only upload data?.imgSrc on db(table = recipe), without the logic uploading on storage
			// case 2 (updatedImage - image modification exists): upload image on storage like `addRecipe(supabase request)` and then, add uploadImage.path on db(recipe)
			await startTransition(
				editRecipe({
					type: imageUrl === data?.imgSrc && !currentRecipeImage ? 'sameImage' : 'updatedImage',
					data: {
						...currentFilmFeature,
						updated_at: new Date().toISOString(),
						imgSrc: imageUrl === data?.imgSrc && !currentRecipeImage ? data?.imgSrc : '',
						primary: isPrimary,
					},
					imageFile: currentRecipeImage,
				}),
			);

			addToast(toastData.FILM_RECIPE.EDIT.SUCCESS);
			onClose();
		} catch (e) {
			console.error(e);
			addToast(toastData.FILM_RECIPE.EDIT.ERROR.SUBMIT);
		} finally {
			queryClient.invalidateQueries({ queryKey: queryKey.FILM_RECIPE });
		}
	};

	const handleDeleteConfirmModal = () => {
		setModal({
			Component: MODAL_CONFIG.FILM_RECIPE.REMOVE.Component,
			props: {
				type: MODAL_CONFIG.FILM_RECIPE.REMOVE.type,
				data,
				onTopLevelModalClose: onClose,
			},
		});
	};

	return (
		<ModalLayout id={id} type={type} title={data?.title} onClose={onClose}>
			<Group>
				{isEditing ? (
					<FilmRecipeImageUpload
						isEditing={isEditing}
						imageUrl={isAttached ? imageUrl : data?.imgSrc}
						isAttached={isAttached}
						onImageUpload={handleImageUpload}
						onImageRemove={handleImageRemove}
						setImageUrlOnEditing={setImageUrlOnEditing}
					/>
				) : (
					<Suspense fallback={<LazyImageLoader />}>
						<LazyImage
							src={
								data?.imgSrc?.includes(`${import.meta.env.VITE_SUPABASE_PROJECT_URL}/${import.meta.env.VITE_SUPABASE_FILMRECIPE_URL}`)
									? data?.imgSrc
									: placeholderImage
							}
							alt="recipe sample image"
							width={'100%'}
							height={'100%'}
							lazy={true}
						/>
					</Suspense>
				)}

				{isEditing ? (
					<>
						{FILM_RECIPE_FORM.FIELDS.map(({ type, data, label, placeholder }, idx) => {
							return type === 'input' ? (
								<TextInput key={`${type}_${idx}`} aria-label={label}>
									<TextInput.ControlledTextField
										id={label}
										name={label}
										placeholder={placeholder}
										value={currentFilmFeature[label].toString()}
										onChange={e => {
											setCurrentFilmFeature({ ...currentFilmFeature, [label]: e.target.value });
										}}
									/>
								</TextInput>
							) : type === 'select' ? (
								<CustomSelect
									key={`${type}_${idx}`}
									data={data}
									label={label}
									placeholder={placeholder}
									currentValue={currentFilmFeature[label]}
									isTriggered={true}
									onSelect={option => {
										setCurrentFilmFeature({ ...currentFilmFeature, [label]: option });
									}}
								/>
							) : null;
						})}
					</>
				) : (
					<FilmRecipeStaticFields data={data} />
				)}
			</Group>
			<ButtonGroup>
				{isEditing ? (
					<>
						<Left>
							<RankActivateButton type="button" onClick={() => setIsPrimary(!isPrimary)}>
								<Star size="24" color="var(--blue200)" fill={isPrimary ? 'var(--blue200)' : 'var(--blue100)'} />
							</RankActivateButton>
							<CancelButton type="button" onClick={() => setEditing(false)}>
								Cancel
							</CancelButton>
						</Left>
						<UpdateButton type="button" disabled={!hasChanges()} onClick={handleUpdateRecipe}>
							{isLoading ? Loading : 'Update'}
						</UpdateButton>
					</>
				) : (
					<>
						<DeleteRecipeButton type="button" onClick={handleDeleteConfirmModal}>
							Delete
						</DeleteRecipeButton>
						<EditRecipeButton type="button" onClick={() => setEditing(!isEditing)}>
							Edit
						</EditRecipeButton>
					</>
				)}
			</ButtonGroup>
		</ModalLayout>
	);
};

const Group = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	margin-top: 8px;
	background-color: var(--white);
`;

const ButtonGroup = styled.div`
	display: flex;
	justify-content: space-between;
	gap: 16px;
	margin-top: calc(var(--padding-container-mobile) * 8);
`;

const Left = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 16px;
`;

const RankActivateButton = styled(Button)`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	padding: var(--padding-container-mobile);
	max-height: 50.5px;
	background-color: var(--blue100);
`;

const StyledButton = styled(Button)`
	padding: var(--padding-container-mobile);
	width: 100%;
	max-height: 50.5px;
	color: var(--white);
	font-size: var(--fz-p);
	font-weight: var(--fw-semibold);
`;

const CancelButton = styled(StyledButton)`
	color: var(--black);
	background-color: var(--white);
	border: 1px solid var(--grey200);

	&:active,
	&:focus,
	&:hover {
		background-color: var(--grey100);
	}
`;

const UpdateButton = styled(StyledButton)`
	background-color: var(--blue200);

	&:active,
	&:focus,
	&:hover {
		background-color: var(--blue400);
	}

	&:disabled {
		background-color: var(--greyOpacity300);
	}
`;

const EditRecipeButton = styled(StyledButton)`
	width: 70%;
	background-color: var(--black);

	&:active,
	&:focus,
	&:hover {
		background-color: var(--grey900);
	}
`;

const DeleteRecipeButton = styled(StyledButton)`
	width: 30%;
	color: var(--grey800);
	background-color: var(--grey100);

	&:active,
	&:focus,
	&:hover {
		background-color: var(--grey200);
	}
`;

export default FilmRecipeModal;
