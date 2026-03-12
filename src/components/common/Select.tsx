import { useId, useState } from 'react';
import styled from '@emotion/styled';
import { ChevronRight, Asterisk } from 'lucide-react';
import { FieldError } from 'react-hook-form';
import { Button } from '..';
import { customPropReceiver } from '../../constants';
import { useClickOutside } from '../../hooks';

interface SelectProps<T extends string> {
	data: readonly T[];
	placeholder: string;
	descriptionLabel?: string;
	currentValue: T;
	error?: FieldError;
	onSelect: (option: T) => void;
}

const Select = <T extends string>({ data: options, placeholder, descriptionLabel, currentValue, error, onSelect }: SelectProps<T>) => {
	const generatedId = useId();
	const [isOpen, setOpen] = useState(false);

	const targetRef = useClickOutside<HTMLDivElement>({ eventHandler: () => setOpen(false) });

	return (
		<SelectRoot id="select-root" ref={targetRef}>
			<SelectTrigger
				type="button"
				role="combobox"
				onClick={() => setOpen(!isOpen)}
				tabIndex={0}
				aria-controls={`select-${generatedId}`}
				aria-label={`${placeholder}`}
				aria-expanded={isOpen}>
				<span>{currentValue ?? placeholder}</span>
				<Chevron size="19" color="var(--black)" $isOpen={isOpen} />
			</SelectTrigger>
			{error && (
				<ErrorMessage>
					<Asterisk size="16" /> {error?.message}
				</ErrorMessage>
			)}
			<SelectContent isOpen={isOpen} aria-labelledby={`select-${generatedId}-content`}>
				{descriptionLabel && <SelectDescriptionLabel>{descriptionLabel}</SelectDescriptionLabel>}
				<SelectItemList isLong={options.length > 6}>
					{options.map((option, idx) => (
						<SelectItem
							key={`${option}_${idx}`}
							ref={ref => {
								if (option === currentValue) {
									ref?.scrollIntoView({ block: 'center', behavior: 'smooth' });
								}
							}}
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
				</SelectItemList>
			</SelectContent>
		</SelectRoot>
	);
};

const SelectRoot = styled.div`
	@media screen and (min-width: 480px) {
		position: relative;
	}
`;

const SelectTrigger = styled(Button)`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	gap: 4px;
	padding: calc(var(--padding-container-mobile) * 0.5) calc(var(--padding-container-mobile) * 0.75);
	background-color: var(--grey50);
	font-size: var(--fz-p);
	font-weight: var(--fw-medium);
	border: 1px solid var(--grey100);
	border-radius: var(--radius-s);

	span {
		color: var(--black);
	}
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
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
	flex-direction: column;
	gap: 8px;
	padding: calc(var(--padding-container-mobile));
	width: 100%;
	height: ${({ isOpen }) => (isOpen ? 'auto' : '0')};
	background-color: var(--white);
	border: 1px solid var(--grey100);
	border-radius: var(--radius-m) var(--radius-m) 0 0;
	transition: height 0.3s ease-in-out display 0.5s ease-in-out;
	z-index: var(--modal-index);

	@media screen and (min-width: 480px) {
		position: absolute;
		top: 40px;
		right: 0;
		bottom: auto;
		left: auto;
		padding: calc(var(--padding-container-mobile) * 0.5);
		width: auto;
		border-radius: var(--radius-s);
	}
`;

const SelectDescriptionLabel = styled.span`
	display: inline-block;
	color: var(--black);
	font-weight: var(--fw-medium);
`;

const SelectItemList = styled.div<{ isLong: boolean }>`
	display: flex;
	flex-direction: column;
	gap: 4px;
	width: 100%;
	max-height: 300px;
	height: auto;
	overflow-y: ${({ isLong }) => (isLong ? 'scroll' : 'auto')};

	-webkit-overflow-scrolling: touch; // iOS scroll support
	-ms-overflow-style: none; // IE and Edge
	scrollbar-width: none; // Firefox
	&::-webkit-scrollbar {
		display: none; // hide scrollbar (optional)
	}
`;

const SelectItem = styled.div<{ isCurrent: boolean }>`
	display: flex;
	align-items: center;
	gap: 12px;
	padding: calc(var(--padding-container-mobile) * 0.5) calc(var(--padding-container-mobile) * 0.75);
	width: 100%;
	font-size: var(--fz-p);
	font-weight: ${({ isCurrent }) => (isCurrent ? 'var(--fw-semibold)' : 'var(--fw-regular)')};
	color: ${({ isCurrent }) => (isCurrent ? 'var(--grey900)' : 'var(--grey700)')};
	background-color: ${({ isCurrent }) => (isCurrent ? 'var(--greyOpacity100)' : 'var(--white)')};
	border-radius: var(--radius-s);
	cursor: pointer;

	&:hover {
		background-color: var(--grey100);
	}

	@media screen and (min-width: 480px) {
		padding: calc(var(--padding-container-mobile) * 0.25) calc(var(--padding-container-mobile) * 0.5);
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

export default Select;
