import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getAllPaymentsPriceByYearAndMonth } from '../../supabase';
import { MatchedPriceUnitWithSymbol, matchedPriceUnitWithSymbol, staleTime, queryKey } from '../../constants';
import { monetizeWithSeparator } from '../../utils';

interface TotalExpensePriceProps {
	currentYear: number;
	currentMonthIndex: number;
}

const TotalExpensePrice = ({ currentYear, currentMonthIndex }: TotalExpensePriceProps) => {
	const { data } = useSuspenseQuery({
		queryKey: [...queryKey.EXPENSE_TRACKER, currentYear, currentMonthIndex], // 0 ~ 11
		queryFn: () => getAllPaymentsPriceByYearAndMonth({ year: currentYear, month: currentMonthIndex }), // 0 ~ 11
		staleTime: staleTime.EXPENSE_TRACKER.TOTAL_EXPENSE_PRICE,
	});

	return (
		<>
			{data.price === 0 ? (
				<Price>
					<span>₩</span>
					<span>{monetizeWithSeparator(data.price)}</span>
				</Price>
			) : (
				<PriceList>
					{Object.entries(data).map(([priceUnit, price], idx) => (
						<Price key={`${price}_${priceUnit}_${idx}`}>
							<span>{matchedPriceUnitWithSymbol[priceUnit as keyof MatchedPriceUnitWithSymbol]}</span>
							<span>{monetizeWithSeparator(price)}</span>
						</Price>
					))}
				</PriceList>
			)}
		</>
	);
};

const PriceList = styled.ul`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;

const Price = styled.li`
	display: flex;
	font-size: var(--fz-h4);
	font-weight: var(--fw-black);
`;

export default TotalExpensePrice;
