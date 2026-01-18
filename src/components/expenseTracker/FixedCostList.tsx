import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { useSuspenseQuery } from '@tanstack/react-query';
import { bankSvgs, queryKey, routes, staleTime } from '../../constants';
import { ExpenseTracker, getFixedCostPaymentsByMonth } from '../../supabase';
import { currentDate, currentMonth, currentYear, getDateFromString, getNextMonthFormatDate, monetizeWithSeparator } from '../../utils';
import { EmptyMessage } from '../common';

const FixedCostList = () => {
	const { data: payments } = useSuspenseQuery<ExpenseTracker[]>({
		queryKey: [...queryKey.EXPENSE_TRACKER, 'fixedCost'],
		queryFn: () => getFixedCostPaymentsByMonth({ year: currentYear, month: currentMonth - 1 }),
		staleTime: staleTime.EXPENSE_TRACKER.FIXED_COST,
	});

	const navigate = useNavigate();

	return (
		<>
			{payments.length === 0 ? (
				<EmptyMessage emoji="💰">No Expenses</EmptyMessage>
			) : (
				<PaymentList>
					{payments.map(payment => (
						<Payment
							key={payment.id}
							onClick={() =>
								navigate(`${routes.EXPENSE_TRACKER_BY_MONTH}/${payment.id}`, { state: { payment, currentDate: payment.usage_date } })
							}>
							<Date>
								<Passed isPassed={getDateFromString(payment.usage_date).getDate() < currentDate} />
								<div aria-label="usage_date">{getNextMonthFormatDate(payment.usage_date)}</div>
							</Date>
							<Detail>
								<PlaceAndPrice>
									<div aria-label="place">{payment.place}</div>
									<div aria-label="price">
										{monetizeWithSeparator(payment.price)} {payment.price_unit}
									</div>
								</PlaceAndPrice>
								{bankSvgs[payment.bank] ? (
									<BankImage>
										<img src={bankSvgs[payment.bank]} alt={payment.bank} />
									</BankImage>
								) : (
									<BankText>{payment.bank}</BankText>
								)}
							</Detail>
						</Payment>
					))}
				</PaymentList>
			)}
		</>
	);
};

const PaymentList = styled.ul`
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-top: 8px;
`;

const Payment = styled.li`
	position: relative;
	padding: var(--padding-container-mobile) calc(var(--padding-container-mobile));
	background-color: var(--grey50);
	border-radius: var(--radius-l);
	transition: background 0.15s ease-in-out;
	cursor: pointer;

	&:hover {
		background-color: var(--blue100);
	}
`;

const Date = styled.div`
	display: inline-flex;
	align-items: center;
	gap: 12px;
	padding: 0 calc(var(--padding-container-mobile) * 0.5);
	font-size: var(--fz-p);
	font-weight: var(--fw-medium);
	background-color: var(--blue100);
	border-radius: var(--radius-l);
`;

const Passed = styled.span<{ isPassed: boolean }>`
	display: inline-block;
	width: 10px;
	height: 10px;
	border-radius: var(--radius-extra);
	background-color: ${({ isPassed }) => (isPassed ? 'var(--grey200)' : 'var(--blue200)')};
`;

const Detail = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 8px;
`;

const PlaceAndPrice = styled.div`
	div[aria-label='place'] {
		font-weight: var(--fw-medium);
		color: var(--grey600);
	}

	div[aria-label='price'] {
		font-size: var(--fz-h7);
		font-weight: var(--fw-semibold);
		color: var(--black);
	}
`;

const BankImage = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 48px;
	height: 48px;

	img {
		display: block;
		width: 100%;
		height: 100%;
	}
`;

const BankText = styled.span`
	padding: calc(var(--padding-container-mobile) * 0.5) var(--padding-container-mobile);
	color: var(--grey700);
	background-color: var(--grey100);
	font-weight: var(--fw-medium);
	border-radius: var(--radius-s);
`;

export default FixedCostList;
