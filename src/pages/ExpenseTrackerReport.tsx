import { Suspense, useState } from 'react';
import styled from '@emotion/styled';
import { Description, ExpenseChart, ExpenseChartLoader, Select } from '../components';
import { type Month, currentMonth, currentYear, getMonthIndexFromMonths, months } from '../utils';
import { priceUnit, PriceUnitType } from '../constants';

const ExpenseTrackerReportPage = () => {
	const [selectMonth, setSelectMonth] = useState<Month>(months[currentMonth]);
	const [priceUnitType, setPriceUnitType] = useState<PriceUnitType>(priceUnit.unitType[0]); // WON

	return (
		<section>
			<Title>
				<span>Report of</span>
				<Year>{currentYear}</Year>
				<Select
					data={months.filter((_, idx) => idx <= currentMonth).reverse()}
					placeholder={'Month'}
					currentValue={selectMonth}
					onSelect={option => setSelectMonth(months[getMonthIndexFromMonths(option)])}
				/>
				<Select
					data={priceUnit.unitType}
					placeholder={'Price Unit'}
					currentValue={priceUnitType}
					onSelect={option => setPriceUnitType(option)}
				/>
			</Title>
			<Description>
				This chart will show price based on <UnitType>{priceUnitType}</UnitType>
			</Description>
			<Suspense fallback={<ExpenseChartLoader />}>
				<ExpenseChart selectMonth={selectMonth} priceUnitType={priceUnitType} />
			</Suspense>
		</section>
	);
};

const Title = styled.h2`
	display: flex;
	gap: 8px;
	align-items: center;
	margin-bottom: 16px;
	font-size: var(--fz-h6);
	font-weight: var(--fw-black);
	color: var(--grey900);

	span[aria-label='month'] {
		color: var(--blue200);
	}
`;

const Year = styled.span`
	display: inline-flex;
	align-items: center;
	padding: calc(var(--padding-container-mobile) * 0.5) calc(var(--padding-container-mobile) * 0.75);
	height: 37px;
	font-size: var(--fz-p);
	font-weight: var(--fw-semibold);
	border: 1px solid var(--grey100);
	border-radius: var(--radius-s);
	background-color: var(--grey50);
`;

const UnitType = styled.span`
	display: inline-block;
	padding: calc(var(--padding-container-mobile) * 0.25);
	border-radius: var(--radius-s);
	font-weight: var(--fw-semibold);
	color: var(--blue100);
	background-color: var(--blue200);
`;

export default ExpenseTrackerReportPage;
