import { ChangeEvent, Children, cloneElement, ForwardedRef, forwardRef, HTMLAttributes, ReactElement, useId, useRef } from 'react';
import styled from '@emotion/styled';
import { Asterisk } from 'lucide-react';

interface TextAreaProps {
	children: ReactElement;
	errorMessage?: string;
}

const TextArea = ({ children, errorMessage, ...props }: TextAreaProps) => {
	const child = Children.only(children);
	const generatedId = useId();
	const id = child.props.id ?? generatedId;

	const ref = useRef<HTMLTextAreaElement | null>(null);

	return (
		<Container {...props}>
			{cloneElement(child, { id, ref, ...child.props })}
			{errorMessage && (
				<Message>
					<Asterisk size="16" /> {errorMessage}
				</Message>
			)}
		</Container>
	);
};

interface TextFieldProps extends Omit<HTMLAttributes<HTMLTextAreaElement>, 'size'> {
	id: string;
	name: string;
	value: string;
	onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
	placeholder: string;
	modalType?: 'new' | 'edit';
}

TextArea.TextField = forwardRef(
	({ id, name, value, onChange, placeholder, modalType = 'new', ...props }: TextFieldProps, ref: ForwardedRef<HTMLTextAreaElement>) => {
		return (
			<TextField
				id={id}
				name={name}
				ref={ref}
				value={value}
				placeholder={placeholder}
				onClick={e => {
					const element = e.currentTarget;

					if (modalType === 'edit') {
						element.style.height = 'auto';
						element.style.height = `${element.scrollHeight + 24}px`;
					}
				}}
				onChange={e => {
					const element = e.currentTarget;

					if (onChange) {
						onChange(e);
					}

					if (modalType === 'new') {
						element.style.height = 'auto';
						element.style.height = `${element.scrollHeight}px`;
					}
				}}
				{...props}
			/>
		);
	},
);

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
`;

const Message = styled.p`
	display: flex;
	align-items: center;
	padding-left: 4px;
	font-size: var(--fz-sm);
	color: var(--red200);
`;

const TextField = styled.textarea`
	padding: var(--padding-container-mobile);
	height: calc(var(--padding-container-mobile) * 1.5 + var(--fz-h5) * 2);
	font-size: var(--fz-h5);
	font-weight: var(--fw-regular);
	color: var(--black);
	border-bottom: 1px solid var(--greyOpacity100);
	border-radius: none;
	transition: border 0.15s ease-in-out;
	appearance: none;
	resize: none;
	overflow: hidden;
	cursor: pointer;

	&::placeholder {
		color: var(--grey400);
	}

	&:focus {
		border-bottom-color: var(--black);
	}
`;

export default TextArea;
