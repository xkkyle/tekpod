import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { EmptyMessage } from '..';
import { ExpenseTracker, getAllPaymentsByMonth } from '../../supabase';
import { useMediaQuery } from '../../hooks';
import { priceUnit, PriceUnitType, queryKey, USD_GBP_EUR_SEPARATOR, WON_AND_JPY_SEPARATOR, ZERO_PRICE } from '../../constants';
import { type Month, currentYear, formatByKoreanTime, getMonthIndexFromMonths, monetizeWithSeparator } from '../../utils';

interface ExpenseChartProps {
	selectMonth: Month;
	priceUnitType: PriceUnitType;
}

const ExpenseChart = ({ selectMonth, priceUnitType }: ExpenseChartProps) => {
	const monthIndex = getMonthIndexFromMonths(selectMonth);

	const { data: expenses } = useSuspenseQuery<ExpenseTracker[]>({
		queryKey: [...queryKey.EXPENSE_TRACKER, 'report', selectMonth],
		queryFn: () => getAllPaymentsByMonth({ year: currentYear, month: monthIndex }),
	});

	const [isSmallMobile, isMediumMobile] = [useMediaQuery('(max-width: 320px)'), useMediaQuery('(max-width: 430px)')];

	const lineChartWidth = isSmallMobile ? 280 : isMediumMobile ? 340 : 440;

	const getTotalPricePerMonth = expenses.reduce<{ [date: string]: { [key in PriceUnitType]: number } }>((acc, curr) => {
		const formatDate = new Date(formatByKoreanTime(curr.usage_date)).getDate();

		if (!acc[formatDate]) {
			acc[formatDate] = {
				WON: ZERO_PRICE,
				USD: ZERO_PRICE,
				GBP: ZERO_PRICE,
				EUR: ZERO_PRICE,
				JPY: ZERO_PRICE,
			};
		}

		acc[formatDate][curr.price_unit as PriceUnitType] += curr.price ?? ZERO_PRICE;
		return acc;
	}, {});

	const filteredData = Object.entries(getTotalPricePerMonth).map(([date, prices]) => ({ date, price: prices[priceUnitType] }));
	const sortedData = [...filteredData].sort((prev, curr) => prev.price - curr.price);
	const isAllZeroPrice = filteredData.reduce((acc, curr) => (acc += curr.price), ZERO_PRICE) === ZERO_PRICE;

	const currentPriceUnitSymbol = priceUnit.unitSymbol[priceUnit.unitType.findIndex(type => type === priceUnitType)];

	return (
		<Container>
			{expenses.length === 0 ? (
				<EmptyMessage emoji="📈">None of Expenses</EmptyMessage>
			) : (
				<>
					<LineChart width={lineChartWidth} height={400} data={filteredData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
						<Line name="price" type="monotone" dataKey={'price'} stroke={'var(--black)'} />
						<CartesianGrid stroke="var(--grey200)" strokeDasharray="3 3" />
						<Tooltip
							labelFormatter={label => `${label}일`}
							formatter={(value: number) => [`${monetizeWithSeparator(value)} ${currentPriceUnitSymbol}`, 'price']}
							wrapperStyle={{
								border: 'none',
								backgroundColor: 'var(--background)',
							}}
							labelStyle={{
								fontWeight: 'var(--fw-semibold)',
								color: 'var(--black)',
							}}
							contentStyle={{
								border: '1px solid var(--grey200)',
								borderRadius: '14px',
							}}
							itemStyle={{
								color: 'var(--grey900)',
								fontSize: 'var(--fz-sm)',
							}}
						/>
						<Legend align="right" verticalAlign="bottom" height={36} />
						<XAxis dataKey="date" />
						<YAxis
							dataKey="price"
							tickFormatter={value =>
								`${Math.floor(
									value / (priceUnitType === 'WON' || priceUnitType === 'JPY' ? WON_AND_JPY_SEPARATOR : USD_GBP_EUR_SEPARATOR),
								)}`
							}
						/>
					</LineChart>

					<TotalPrice>
						<span>Total Price</span>
						<div>{`${currentPriceUnitSymbol}${monetizeWithSeparator(
							filteredData.reduce((acc, curr) => (acc += curr.price), ZERO_PRICE),
						)}`}</div>
					</TotalPrice>

					{isAllZeroPrice ? (
						<NonePriceMessage>
							Didn't use <UnitType>{priceUnitType}</UnitType> money, yet
						</NonePriceMessage>
					) : (
						<MaxAndMinPriceList>
							{[sortedData.at(-1), sortedData[0]].map((payment, idx) => (
								<MaxAndMinPrice key={`${idx}_${payment?.date}_${payment?.price}`}>
									<Label>{idx === 0 ? 'The day I spent the most' : 'The day I spent the least'}</Label>
									<DateAndPrice>
										<span aria-label="date">{`${monthIndex + 1}/${payment?.date}`}</span>
										<span aria-label="price">{`${currentPriceUnitSymbol}${monetizeWithSeparator(`${payment?.price}`)}`}</span>
									</DateAndPrice>
								</MaxAndMinPrice>
							))}
						</MaxAndMinPriceList>
					)}
				</>
			)}
		</Container>
	);
};

const Container = styled.div`
	margin-top: 32px;
`;

const TotalPrice = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 16px;

	span {
		font-weight: var(--fw-semibold);
		color: var(--grey800);
	}

	div {
		padding: var(--padding-container-mobile);
		background-color: var(--blue100);
		font-weight: var(--fw-bold);
		color: var(--blue200);
		border-radius: var(--radius-s);
		text-align: right;
	}
`;

const MaxAndMinPriceList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding: var(--padding-container-mobile) 0;
`;

const NonePriceMessage = styled.div`
	margin-top: 16px;
	padding: var(--padding-container-mobile);
	font-weight: var(--fw-bold);
	color: var(--white);
	background-color: var(--black);
	border-radius: var(--radius-s);
`;

const UnitType = styled.span`
	display: inline-block;
	padding: calc(var(--padding-container-mobile) * 0.25);
	border-radius: var(--radius-s);
	font-weight: var(--fw-semibold);
	color: var(--black);
	background-color: var(--white);
`;

const MaxAndMinPrice = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
`;

const Label = styled.span`
	font-weight: var(--fw-semibold);
	color: var(--grey800);
`;

const DateAndPrice = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: var(--padding-container-mobile);
	background-color: var(--grey50);
	border: 1px solid var(--grey100);
	border-radius: var(--radius-s);

	span[aria-label='date'] {
		font-weight: var(--fw-medium);
		color: var(--grey600);
	}

	span[aria-label='price'] {
		font-weight: var(--fw-bold);
		color: var(--grey800);
	}
`;

export default ExpenseChart;
