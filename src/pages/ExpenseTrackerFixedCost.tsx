import { Suspense } from 'react';
import styled from '@emotion/styled';
import { Description, FixedCostList, FixedCostListLoader, FixedCostTotalPrice, FixedCostTotalPriceLoader } from '../components';
import { months, currentMonth, currentYear } from '../utils';

const ExpenseTrackerFixedCost = () => {
	return (
		<section>
			<Title>
				<TotalPrice>
					<span aria-label="total price to pay">Total Price to pay</span>
					<Suspense fallback={<FixedCostTotalPriceLoader />}>
						<FixedCostTotalPrice />
					</Suspense>
				</TotalPrice>
				<CurrentYearAndMonth>
					{currentYear} * {months[currentMonth]}
				</CurrentYearAndMonth>
			</Title>

			<Description>Expected upcoming costs based on last month</Description>
			<Suspense fallback={<FixedCostListLoader />}>
				<FixedCostList />
			</Suspense>
		</section>
	);
};

const Title = styled.h2`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16px;
	font-size: var(--fz-h5);
	font-weight: var(--fw-black);
	color: var(--grey900);
`;

const CurrentYearAndMonth = styled.span`
	padding: calc(var(--padding-container-mobile) * 0.25) calc(var(--padding-container-mobile) * 0.5);
	color: var(--white);
	background-color: var(--black);
	font-size: var(--fz-h6);
	border-radius: var(--radius-s);
`;

const TotalPrice = styled.div`
	display: flex;
	flex-direction: column;
	padding: calc(var(--padding-container-mobile) * 0.25) calc(var(--padding-container-mobile) * 0.75);
	background-color: var(--grey50);
	border-radius: var(--radius-s);

	span {
		font-size: var(--fz-p);
		font-weight: var(--fw-medium);
		color: var(--grey600);
	}

	p {
		font-size: var(--fz-h5);
		font-weight: var(--fw-bold);
	}
`;

export default ExpenseTrackerFixedCost;
