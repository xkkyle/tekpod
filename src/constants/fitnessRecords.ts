type FitnessStatusOption = (typeof FITNESS_STATUS)[keyof typeof FITNESS_STATUS];

const FITNESS_STATUS = {
	PRESENT: 'present',
	ABSENT: 'absent',
} as const;

// because of schema, z.enum can't refer the type of arr (e.g. Object.values(COMMUTE_STATUS))
const fitnessStatusList = [FITNESS_STATUS.PRESENT, FITNESS_STATUS.ABSENT] as const;

export type { FitnessStatusOption };
export { FITNESS_STATUS, fitnessStatusList };
