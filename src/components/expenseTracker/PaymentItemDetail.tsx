import styled from '@emotion/styled';
import { ChevronRight } from 'lucide-react';
import { MODAL_CONFIG, ShrinkMotionBlock } from '..';
import { useModalStore } from '../../store';
import { ExpenseTracker, ServiceDataType } from '../../supabase';

interface PaymentItemDetailProps {
	title: string;
	description: string;
	data: ServiceDataType<ExpenseTracker, { transaction_date: Date }>;
}

const PaymentItemDetail = ({ title, description, data }: PaymentItemDetailProps) => {
	const { setModal } = useModalStore();

	const handleEditPaymentModal = () => {
		setModal({
			Component: MODAL_CONFIG.EXPENSE_TRACKER.EDIT.Component,
			props: {
				type: MODAL_CONFIG.EXPENSE_TRACKER.EDIT.type,
				data,
			},
		});
	};

	return (
		<Container onClick={handleEditPaymentModal}>
			<dt>{title}</dt>
			<dd>
				<span>{description}</span>
				<ChevronRight size="21" color="var(--black)" />
			</dd>
		</Container>
	);
};

const Container = styled(ShrinkMotionBlock)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 16px;
	padding: var(--padding-container-mobile);
	background-color: var(--greyOpacity50);
	border: 1px solid var(--grey100);
	border-radius: var(--radius-m);
	cursor: pointer;

	dt {
		font-weight: var(--fw-medium);
		color: var(--grey800);
	}

	dd {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: var(--fz-h7);
		font-weight: var(--fw-semibold);

		span {
			text-align: right;
		}
	}
`;

export default PaymentItemDetail;
