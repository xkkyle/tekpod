import styled from '@emotion/styled';
import { DollarSign, CreditCard } from 'lucide-react';
import { ExpenseTracker } from '../../supabase';
import { monetizeWithSeparator } from '../../utils';

interface PaymentItemProps {
	data: ExpenseTracker;
}

const PaymentItem = ({ data: { place, price, payment_method, bank } }: PaymentItemProps) => {
	return (
		<Container
			onBlur={e => {
				e.target.blur();
			}}>
			<WonIconWrapper>{payment_method === 'Card' ? <CreditCard size="18" /> : <DollarSign size="18" />}</WonIconWrapper>
			<PaymentInfo>
				<Main>
					<div>
						<dt>Price</dt>
						<dd>{monetizeWithSeparator(price)}</dd>
					</div>
					{payment_method === 'Cash' ? (
						<div>
							<dt>Method</dt>
							<dd>Cash</dd>
						</div>
					) : (
						<div>
							<dt>Bank</dt>
							<dd>{bank}은행</dd>
						</div>
					)}
				</Main>
				<Sub>
					<div>
						<dt>Place</dt>
						<dd>{place}</dd>
					</div>
				</Sub>
			</PaymentInfo>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	align-items: center;
	gap: 36px;
	padding: var(--padding-container-mobile) calc(var(--padding-container-mobile) * 0.5);
	width: 100%;
	border-radius: var(--radius-m);
	cursor: pointer;
	transition: background 0.15s ease-in-out;

	&:hover,
	&:focus {
		background-color: var(--grey50);
	}
`;

const WonIconWrapper = styled.div`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	padding: calc(var(--padding-container-mobile) * 0.5);
	color: var(--grey900);
	background-color: var(--greyOpacity100);
	border: 1px solid var(--grey300);
	border-radius: var(--radius-m);
`;

const PaymentInfo = styled.dl`
	display: flex;
	flex-direction: column;
	width: 100%;
`;

const Main = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16px;
	width: 100%;

	div {
		display: flex;
		align-items: center;
		gap: 6px;

		dt {
			font-size: var(--fz-sm);
			font-weight: var(--fw-medium);
			color: var(--grey500);
		}

		dd {
			font-size: var(--fz-p);
			font-weight: var(--fw-bold);
		}
	}
`;

const Sub = styled.div`
	display: flex;

	div {
		display: flex;
		align-items: center;
		gap: 6px;

		dt {
			font-size: var(--fz-sm);
			font-weight: var(--fw-medium);
			color: var(--grey500);
		}

		dd {
			font-size: var(--fz-p);
			font-weight: var(--fw-bold);
			color: var(--grey600);
		}
	}
`;

export default PaymentItem;
