import { z } from 'zod';
import { fitnessStatusList } from '../../../constants';

type FitnessRecordSchema = z.infer<typeof fitnessRecordSchema>;

const statusSchema = z.enum(fitnessStatusList, {
	errorMap: () => {
		return { message: 'Please select work status' };
	},
});

const fitnessRecordSchema = z.object({
	status: statusSchema,
	notes: z.string({ required_error: 'Write some notes' }),
});

export type { FitnessRecordSchema };
export { fitnessRecordSchema };
