import { useState } from 'react';
import styled from '@emotion/styled';

import { currentMonth, currentYear, months } from '../utils';

const FitnessTrackerPage = () => {
	const [yearAndMonth] = useState({
		year: `${currentYear}`,
		month: months[currentMonth],
	});

	console.log(yearAndMonth);

	return (
		<section>
			<Title>Commute Tracker</Title>
		</section>
	);
};

const Title = styled.h2`
	font-size: var(--fz-h5);
	font-weight: var(--fw-black);
`;

export default FitnessTrackerPage;
