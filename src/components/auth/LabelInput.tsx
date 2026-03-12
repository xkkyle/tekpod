import { Children, cloneElement, ForwardedRef, forwardRef, HTMLAttributes, ReactElement, useId, useState } from 'react';
import styled from '@emotion/styled';
import { Eye, EyeClosed } from 'lucide-react';

interface LabelInputProps extends HTMLAttributes<HTMLInputElement> {
	label: string;
	children: ReactElement;
	errorMessage?: string;
}

const LabelInput = ({ label, children, errorMessage, ...props }: LabelInputProps) => {
	const child = Children.only(children);
	const generatedId = useId();
	const id = child.props.id ?? generatedId;

	return (
		<Container {...props}>
			<label htmlFor={label} />
			{cloneElement(child, { id, ...child.props })}
			{errorMessage && <Message>{errorMessage}</Message>}
		</Container>
	);
};

interface TextFieldProps extends Omit<HTMLAttributes<HTMLInputElement>, 'size'> {
	type: 'text' | 'email' | 'password';
	name: string;
	placeholder: string;
	value?: string;
	disabled?: boolean;
}

LabelInput.TextField = forwardRef(
	({ type: initialType, id, name, placeholder, disabled, ...props }: TextFieldProps, ref: ForwardedRef<HTMLInputElement>) => {
		const [showPassword, setShowPassword] = useState(false);
		const type = initialType === 'password' ? (showPassword ? 'text' : 'password') : initialType;

		return (
			<InputWrapper>
				<input type={type} id={id} name={name} ref={ref} placeholder={placeholder} disabled={disabled} autoComplete={'off'} {...props} />
				{initialType === 'password' && (
					<ToggleButton
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						tabIndex={-1}
						aria-label={showPassword ? 'Hide Password' : 'Show Password'}>
						{showPassword ? <EyeClosed size="19" color="var(--black)" /> : <Eye size="19" color="var(--black)" />}
					</ToggleButton>
				)}
			</InputWrapper>
		);
	},
);

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;

	label {
		display: none;
	}

	input {
		padding: var(--padding-container-mobile);
		min-width: 270px;
		width: 100%;
		border: 1px solid var(--greyOpacity100);
		border-radius: var(--radius-s);
		color: var(--black);
		font-size: var(--fz-p);
		font-weight: var(--fw-semibold);
		transition: border 0.15s ease-in-out;
	}

	input::placeholder {
		color: var(--grey600);
	}

	input:focus {
		border-color: var(--grey500);
	}
`;

const Message = styled.p`
	padding-left: 4px;
	font-size: var(--fz-sm);
	color: var(--grey400);
`;

const InputWrapper = styled.div`
	position: relative;
	display: flex;
	align-items: center;
`;

const ToggleButton = styled.button`
	position: absolute;
	right: 12px;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: none;
	border: 0;
	cursor: pointer;
`;

export default LabelInput;
