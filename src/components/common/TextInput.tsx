import { ChangeEvent, Children, cloneElement, FocusEvent, ForwardedRef, forwardRef, HTMLAttributes, ReactElement, useId } from 'react';
import styled from '@emotion/styled';
import { Asterisk } from 'lucide-react';

interface TextInputProps extends Omit<HTMLAttributes<HTMLInputElement>, 'size'> {
	children: ReactElement;
	label?: string;
	errorMessage?: string;
}

const TextInput = ({ children, label, errorMessage, ...props }: TextInputProps) => {
	const child = Children.only(children);
	const generatedId = useId();
	const id = child.props.id ?? generatedId;

	return (
		<Container {...props}>
			{label && <Label htmlFor={id}>{label.toUpperCase()}</Label>}
			{cloneElement(child, {
				id,
				...child.props,
			})}
			{errorMessage && (
				<Message>
					<Asterisk size="16" /> {errorMessage}
				</Message>
			)}
		</Container>
	);
};

interface TextFieldProps extends Omit<HTMLAttributes<HTMLInputElement>, 'size'> {
	type?: 'text' | 'number';
	id: string;
	name: string;
	placeholder: string;
	value?: string;
	onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
	onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
	maxLength?: number;
	disabled?: boolean;
	variant?: 'sm' | 'md' | 'lg';
}

TextInput.TextField = forwardRef(
	({ type = 'text', id, name, placeholder, variant = 'lg', ...props }: TextFieldProps, ref: ForwardedRef<HTMLInputElement>) => {
		return <Input type={type} id={id} name={name} placeholder={placeholder} ref={ref} variant={variant} {...props} />;
	},
);

TextInput.ControlledTextField = ({
	type = 'text',
	id,
	name,
	placeholder,
	value,
	onChange,
	onBlur,
	maxLength,
	disabled,
	variant = 'lg',
	...props
}: TextFieldProps) => {
	return (
		<Input
			type={type}
			id={id}
			name={name}
			placeholder={placeholder}
			value={value}
			onChange={onChange}
			onBlur={onBlur}
			maxLength={maxLength ? maxLength : undefined}
			disabled={disabled}
			variant={variant}
			{...props}
		/>
	);
};

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	width: 100%;
`;

const Label = styled.label`
	font-weight: var(--fw-semibold);
	color: var(--grey400);
`;

const Message = styled.p`
	display: flex;
	align-items: center;
	padding-left: 4px;
	font-size: var(--fz-sm);
	color: var(--red200);
`;

const Input = styled.input<{ name: string; variant: 'sm' | 'md' | 'lg' }>`
	padding: ${({ variant }) =>
		variant === 'lg'
			? 'var(--padding-container-mobile)'
			: variant === 'md'
				? 'calc(var(--padding-container-mobile) * 0.75)'
				: 'calc(var(--padding-container-mobile) * 0.5)'};
	width: 100%;
	font-size: ${({ variant }) => (variant === 'lg' ? 'var(--fz-h5)' : variant === 'md' ? 'var(--fz-h7)' : 'var(--fz-p)')};
	font-weight: ${({ name }) => (name === 'title' ? 'var(--fw-semibold)' : 'var(--fw-regular)')};
	color: var(--black);
	border-bottom: 1px solid var(--greyOpacity100);
	border-radius: none;
	transition: border 0.15s ease-out;
	cursor: pointer;

	&::placeholder {
		color: ${({ name }) => (name === 'feeling' ? 'var(--grey300)' : 'var(--grey400)')};
	}

	&:focus {
		border-bottom-color: var(--black);
	}
`;

export default TextInput;
