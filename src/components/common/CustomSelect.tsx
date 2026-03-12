import { useId, useState } from 'react';
import styled from '@emotion/styled';
import { FieldError } from 'react-hook-form';
import { Asterisk, ChevronRight } from 'lucide-react';
import { Button } from '.';
import type { ExpenseTracker, RestrictedRecipeForValidation } from '../../supabase';
import { useClickOutside } from '../../hooks';
import { customPropReceiver, PaymentDataValueType, FilmRecipeFieldDataType } from '../../constants';

export type CustomSelectDataType = PaymentDataValueType | FilmRecipeFieldDataType[number] | string | number | null;

interface CustomSelectProps<T extends CustomSelectDataType> {
	data: readonly T[];
	label: keyof RestrictedRecipeForValidation | keyof ExpenseTracker;
	placeholder: string;
	currentValue: T;
	isTriggered: boolean;
	suffixWord?: string | null;
	error?: FieldError;
	onSelect: (option: T) => void;
}

const CustomSelect = <T extends CustomSelectDataType>({
	data: options,
	label,
	placeholder,
	currentValue,
	isTriggered,
	suffixWord = '',
	error,
	onSelect,
}: CustomSelectProps<T>) => {
	const generatedId = useId();
	const [isOpen, setOpen] = useState(false);

	const targetRef = useClickOutside<HTMLDivElement>({ eventHandler: () => setOpen(false) });

	return (
		<SelectRoot ref={targetRef}>
			<SelectTrigger
				type="button"
				role="combobox"
				onClick={() => setOpen(!isOpen)}
				tabIndex={0}
				aria-controls={`custom-select-${generatedId}`}
				aria-expanded={isOpen}>
				<SelectValue isTriggered={isTriggered}>
					{isTriggered ? `${options.find(option => option === currentValue)} ${suffixWord}` : placeholder}
				</SelectValue>
				<Chevron size="21" color="var(--black)" $isOpen={isOpen} />
			</SelectTrigger>
			{error && (
				<ErrorMessage>
					<Asterisk size="16" /> {error?.message}
				</ErrorMessage>
			)}

			<SelectContent isOpen={isOpen} aria-labelledby={`custom-select-${generatedId}-content`}>
				<Label>{label.toUpperCase()}</Label>
				<SelectItemGrid column={options.length > 10 ? 2 : 1}>
					{options.map((option, idx) => (
						<SelectItem
							key={`${option}_${idx}`}
							isCurrent={option === currentValue}
							tabIndex={0}
							onClick={() => {
								onSelect(option);
								setOpen(false);
							}}
							data-selected={option === currentValue}>
							<SelectItemCheckIndicator isCurrent={option === currentValue} />
							<span>{option}</span>
						</SelectItem>
					))}
				</SelectItemGrid>
			</SelectContent>
		</SelectRoot>
	);
};

const SelectRoot = styled.div`
	display: flex;
	flex-direction: column;
`;

const SelectTrigger = styled(Button)`
	display: inline-flex;
	justify-content: space-between;
	align-items: center;
	gap: 4px;
	padding: var(--padding-container-mobile);
	width: 100%;
	background-color: var(--white);
	border-bottom: 1px solid var(--greyOpacity100);
	border-radius: 0;
	cursor: pointer;

	&:focus {
		border-bottom-color: var(--black);
	}
`;

const SelectValue = styled.span<{ isTriggered: boolean }>`
	font-size: var(--fz-h5);
	color: ${({ isTriggered }) => (isTriggered ? 'var(--black)' : 'var(--grey400)')};
`;

const Chevron = styled(ChevronRight, customPropReceiver)<{ $isOpen: boolean }>`
	transform: ${({ $isOpen }) => ($isOpen ? 'rotate(90deg)' : 'rotate(0deg)')};
	transition: transform 0.15s ease-in-out;
`;

const ErrorMessage = styled.p`
	display: flex;
	align-items: center;
	padding-left: 4px;
	font-size: var(--fz-sm);
	color: var(--red200);
`;

const SelectContent = styled.div<{ isOpen: boolean }>`
	display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
	flex-direction: column;
	padding: var(--padding-container-mobile);
	height: ${({ isOpen }) => (isOpen ? 'auto' : '0')};
	transition: height 0.3s ease-in-out display 0.5s ease-in-out;
	border: 1px solid var(--black);
`;

const Label = styled.p`
	display: block;
	margin-bottom: 8px;
	font-weight: var(--fw-bold);
	color: var(--grey900);
`;

const SelectItemGrid = styled.div<{ column: 2 | 1 }>`
	display: grid;
	grid-template-columns: ${({ column }) => (column === 2 ? '1fr 1fr' : '1fr')};
	gap: 2px;
`;

const SelectItem = styled.div<{ isCurrent: boolean }>`
	display: flex;
	align-items: center;
	gap: 12px;
	padding: calc(var(--padding-container-mobile) * 0.5) calc(var(--padding-container-mobile) * 0.75);
	font-size: var(--fz-h6);
	font-weight: ${({ isCurrent }) => (isCurrent ? 'var(--fw-semibold)' : 'var(--fw-regular)')};
	color: ${({ isCurrent }) => (isCurrent ? 'var(--grey900)' : 'var(--grey700)')};
	background-color: ${({ isCurrent }) => (isCurrent ? 'var(--greyOpacity50)' : 'var(--white)')};
	border-radius: var(--radius-s);
	cursor: pointer;

	&:hover {
		background-color: var(--greyOpacity100);
	}

	&:focus {
		outline: 2px solid var(--grey500);
	}
`;

const SelectItemCheckIndicator = styled.span<{ isCurrent: boolean }>`
	display: inline-block;
	width: 12px;
	height: 12px;
	background-color: ${({ isCurrent }) => (isCurrent ? 'var(--black)' : 'var(--white)')};
	border: 1px solid var(--grey200);
	border-radius: var(--radius-extra);
`;

export default CustomSelect;
