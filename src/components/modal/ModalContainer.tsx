import styled from '@emotion/styled';
import { Portal } from '..';
import { useModalStore } from '../../store';
import React from 'react';

const ModalContainer = () => {
	const { modals, removeModal, resetModals } = useModalStore();

	React.useEffect(() => {
		if (modals?.length === 0) {
			resetModals();
		}
	}, [modals.length, resetModals]);

	return (
		<Portal>
			<Container id="modal-container">
				{modals.map(({ Component, props }, index) => {
					const closeModal = () => removeModal(Component);

					if (props) {
						return <Component key={index} id={index} onClose={closeModal} {...props} />;
					}
				})}
			</Container>
		</Portal>
	);
};

const Container = styled.div`
	position: relative;
	max-width: var(--max-app-width);
	min-width: var(--min-app-width);
	margin: 0 auto;
	z-index: calc(var(--modal-index) - 1);
`;

export default ModalContainer;
