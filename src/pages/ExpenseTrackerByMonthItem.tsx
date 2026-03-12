import styled from '@emotion/styled';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, CreditCard, DollarSign } from 'lucide-react';
import { PaymentItemDetail, Switch, FloatingActionButton, AdditionalOptions } from '../components';
import { useClientSession, useLoading, useTogglePaymentIsFixedMutation } from '../hooks';
import { ExpenseTracker, removePayment } from '../supabase';
import { monetizeWithSeparator, formatByKoreanTime, formatByISOKoreanTime } from '../utils';
import { useToastStore } from '../store';
import { routes, queryKey, toastData } from '../constants';

const ExpenseTrackerByMonthItemPage = () => {
	const { queryClient } = useClientSession();
	const {
		state: { payment, currentDate },
	} = useLocation() as { state: { payment: ExpenseTracker; currentDate: Date } };

	const navigate = useNavigate();
	const { startTransition, Loading, isLoading } = useLoading();
	const { addToast } = useToastStore();

	const { mutate: toggleIsFixed } = useTogglePaymentIsFixedMutation({
		currentDate,
		handlers: {
			goBack: () =>
				navigate(`${routes.EXPENSE_TRACKER_BY_MONTH}?date=${formatByISOKoreanTime(currentDate)}`, {
					state: { currentDate },
					replace: true,
				}),
		},
	});

	const handlePaymentDelete = async () => {
		try {
			await startTransition(removePayment({ id: payment.id }));

			addToast(toastData.EXPENSE_TRACKER.REMOVE.SUCCESS);
			navigate(`${routes.EXPENSE_TRACKER_BY_MONTH}?date=${formatByISOKoreanTime(currentDate)}`, { state: { currentDate }, replace: true });
		} catch (e) {
			console.error(e);
			addToast(toastData.EXPENSE_TRACKER.REMOVE.ERROR);
		} finally {
			queryClient.invalidateQueries({ queryKey: [...queryKey.EXPENSE_TRACKER, formatByISOKoreanTime(currentDate)] });
		}
	};

	return (
		<Container>
			<PaymentMethod>
				<WonIconWrapper>{payment.payment_method === 'Card' ? <CreditCard size="14" /> : <DollarSign size="14" />}</WonIconWrapper>
				<span>{payment.payment_method}</span>
			</PaymentMethod>
			<Price>
				<span>{monetizeWithSeparator(payment.price)}</span>
				<span>{payment.price_unit}</span>
			</Price>

			<Detail>
				<PaymentItemDetail title={'Place'} description={payment.place} data={{ ...payment, transaction_date: currentDate }} />
				<DetailGroup>
					<dt>Bank</dt>
					<dd>{payment.bank} bank</dd>
				</DetailGroup>
				{payment.payment_method === 'Card' && (
					<DetailGroup>
						<dt>Card Type</dt>
						<dd>{payment.card_type}</dd>
					</DetailGroup>
				)}
				{payment.installment_plan_months !== null && payment.installment_plan_months > 0 && (
					<DetailGroup>
						<dt>Installment</dt>
						<dd>{payment.installment_plan_months} month</dd>
					</DetailGroup>
				)}
				<TransactionDateGroup>
					<dt>Transaction Date</dt>
					<dd
						onClick={() =>
							navigate(`${routes.EXPENSE_TRACKER_BY_MONTH}?date=${formatByISOKoreanTime(currentDate)}`, { state: { currentDate } })
						}>
						<span>{formatByKoreanTime(currentDate)}</span>
						<ChevronRight size="21" color="var(--black)" />
					</dd>
				</TransactionDateGroup>
				<DetailGroup>
					<dt>Make Upcoming Next Month</dt>
					<dd>
						<Switch
							initialValue={payment.isFixed}
							toggle={(newState: boolean) => toggleIsFixed({ id: payment.id, isFixed: newState, updated_at: new Date().toISOString() })}
						/>
					</dd>
				</DetailGroup>
				<AdditionalOptions payment={payment} />
			</Detail>

			<DeleteButton type={'button'} variant={'button'} onClick={handlePaymentDelete}>
				{isLoading ? Loading : 'Delete'}
			</DeleteButton>
		</Container>
	);
};

const Container = styled.section`
	display: flex;
	flex-direction: column;
`;

const PaymentMethod = styled.div`
	display: flex;
	align-items: center;
	gap: 6px;
	margin-top: 16px;

	span {
		font-weight: var(--fw-semibold);
	}
`;

const WonIconWrapper = styled.div`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	padding: calc(var(--padding-container-mobile) * 0.35);
	color: var(--white);
	background-color: var(--grey800);
	border-radius: var(--radius-m);
`;

const Price = styled.div`
	display: flex;
	align-items: center;
	gap: 6px;
	font-size: var(--fz-h4);
	font-weight: var(--fw-bold);
`;

const Detail = styled.dl`
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding: calc(var(--padding-container-mobile) * 3) 0 calc(var(--padding-container-mobile) * 5);
`;

const DetailGroup = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: var(--padding-container-mobile);

	dt {
		font-weight: var(--fw-medium);
		color: var(--grey800);
	}

	dd {
		font-size: var(--fz-h7);
		font-weight: var(--fw-semibold);
		text-align: right;
	}
`;

const TransactionDateGroup = styled(DetailGroup)`
	padding-right: 0;

	dd {
		display: inline-flex;
		gap: 2px;
		align-items: center;
		padding: calc(var(--padding-container-mobile) * 0.35) calc(var(--padding-container-mobile) * 0.5)
			calc(var(--padding-container-mobile) * 0.35);
		background-color: var(--grey50);
		border: 1px solid var(--grey100);
		border-radius: var(--radius-m);
		cursor: pointer;

		&:active,
		&:focus {
			background-color: var(--grey100);
		}
	}
`;

const DeleteButton = styled(FloatingActionButton)`
	position: fixed;
	bottom: calc(var(--nav-height) + 2 * var(--padding-container-mobile));
	left: 0;
	right: 0;
	margin: 0 auto;
	padding: var(--padding-container-mobile);
	max-width: calc(var(--max-app-width) - 32px);
	width: calc(100% - var(--padding-container-mobile) * 2);
	font-size: var(--fz-p);
	font-weight: var(--fw-semibold);
	color: var(--white);
	background-color: var(--black);

	&:focus,
	&:active,
	&:hover {
		background-color: var(--grey900);
	}

	@media screen and (min-width: 640px) {
		bottom: calc(var(--nav-height) + var(--padding-container-mobile));
		width: calc(var(--max-app-width) - 2 * var(--padding-container-mobile));
	}
`;

export default ExpenseTrackerByMonthItemPage;
