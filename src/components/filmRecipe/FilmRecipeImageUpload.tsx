import { ChangeEvent, forwardRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { X } from 'lucide-react';
import { Button } from '../common';
import { customPropReceiver } from '../../constants';

interface FilmRecipeImageUploadProps {
	isEditing?: boolean;
	imageUrl: string;
	isAttached: boolean;
	onImageUpload: (e: ChangeEvent<HTMLInputElement>) => void;
	onImageRemove: () => void;
	setImageUrlOnEditing?: (value: string) => void;
}

const FilmRecipeImageUpload = forwardRef<HTMLInputElement, FilmRecipeImageUploadProps>(
	({ isEditing = false, imageUrl, isAttached, onImageUpload, onImageRemove, setImageUrlOnEditing }, ref) => {
		useEffect(() => {
			if (isEditing && setImageUrlOnEditing) {
				setImageUrlOnEditing(imageUrl);
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		return (
			<ImageUploadInput $isAttached={isAttached}>
				<input type="file" id="image_upload_input" name="image_upload_input" accept="image/*" ref={ref} onChange={onImageUpload} />
				<label htmlFor="image_upload_input">+ UPLOAD IMAGE</label>
				<PreviewImage $isAttached={isAttached}>
					<img src={imageUrl} alt="preview_image" />
				</PreviewImage>
				<CloseButton type="button" $isAttached={isAttached} onClick={onImageRemove}>
					<X size="21" color="var(--black)" />
				</CloseButton>
			</ImageUploadInput>
		);
	},
);

const ImageUploadInput = styled('div', customPropReceiver)<{ $isAttached: boolean }>`
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 16px;
	width: 100%;
	font-size: var(--fz-h7);
	font-weight: var(--fw-semibold);
	background: ${({ $isAttached }) =>
		$isAttached ? 'var(--white)' : 'linear-gradient(135deg, var(--greyOpacity50), var(--greyOpacity200))'};
	border: 1px solid var(--greyOpacity200);
	border-radius: var(--radius-s);

	&:active {
		background-color: var(--greyOpacity50);
	}

	input {
		display: none;
	}

	label {
		display: ${({ $isAttached }) => ($isAttached ? 'none' : 'inline-flex')};
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		min-height: 300px;
		text-align: center;
		vertical-align: center;
		cursor: pointer;
	}
`;

const PreviewImage = styled('div', customPropReceiver)<{ $isAttached: boolean }>`
	display: ${({ $isAttached }) => ($isAttached ? 'flex' : 'none')};
	justify-content: center;
	align-items: center;
	object-fit: cover;

	img {
		display: block;
		width: 100%;
		max-height: 300px;
	}
`;

const CloseButton = styled(Button, customPropReceiver)<{ $isAttached: boolean }>`
	position: absolute;
	top: -12px;
	right: 0;
	display: ${({ $isAttached }) => ($isAttached ? 'inline-flex' : 'none')};
	justify-content: center;
	align-items: center;
	width: 24px;
	height: 24px;
	background-color: var(--white);
	border: 1px solid var(--grey500);
`;

export default FilmRecipeImageUpload;
