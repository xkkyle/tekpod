import { Suspense, useState } from 'react';
import styled from '@emotion/styled';
import { FitnessRecords, LoadingSpinner, Select } from '../components';
import { currentMonth, currentYear, getMonthIndexFromMonths, months, years } from '../utils';

const FitnessTrackerPage = () => {
	const [yearAndMonth, setYearAndMonth] = useState({
		year: `${currentYear}`,
		month: months[currentMonth],
	});

	return (
		<section>
			<SubHeader>
				<Title aria-label="Fitness Tracker">🏋</Title>
				<Controller>
					<Select
						data={years}
						placeholder={'Select Year'}
						descriptionLabel={'Year'}
						currentValue={yearAndMonth.year}
						onSelect={option =>
							setYearAndMonth({
								...yearAndMonth,
								year: option,
								month: getMonthIndexFromMonths(yearAndMonth.month) >= currentMonth ? months[currentMonth] : yearAndMonth.month,
							})
						}
					/>
					<Select
						data={+yearAndMonth.year === currentYear ? months.filter((_, idx) => idx <= currentMonth).reverse() : [...months].reverse()}
						placeholder={'Select Month'}
						descriptionLabel={'Month'}
						currentValue={yearAndMonth.month}
						onSelect={option => setYearAndMonth({ ...yearAndMonth, month: months[getMonthIndexFromMonths(option)] })}
					/>
				</Controller>
			</SubHeader>

			<Suspense fallback={<LoadingSpinner />}>
				<FitnessRecords yearAndMonth={yearAndMonth} />
			</Suspense>
		</section>
	);
};

const SubHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const Title = styled.h2`
	font-size: var(--fz-h4);
	font-weight: var(--fw-black);
`;

const Controller = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`;

export default FitnessTrackerPage;
