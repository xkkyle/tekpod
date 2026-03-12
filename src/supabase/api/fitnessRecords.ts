import { type FitnessRecord } from '../schema';
import supabase from '../service';

const TABLE = 'fitness_records';

const getMonthlyFitnessRecords = async ({
	year,
	month,
	user_id,
}: {
	year: number;
	month: number;
	user_id: string;
}): Promise<FitnessRecord[]> => {
	const startDate = `${year}-${`${month}`.padStart(2, '0')}-01`;
	const endDate = `${year}-${`${month}`.padStart(2, '0')}-${new Date(year, month, 0, 23, 59, 59, 999).getDate()}`;

	const { data, error } = await supabase.from(TABLE).select('*').eq('user_id', user_id).gte('date', startDate).lte('date', endDate);

	if (error) throw error;

	return data;
};

const addFitnessRecord = async (data: Omit<FitnessRecord, 'id'>) => {
	const { error } = await supabase.from(TABLE).insert(data).select();

	if (error) {
		throw new Error(error.message);
	}
};

const updateFitnessRecord = async (data: Partial<FitnessRecord>) => {
	const { error } = await supabase
		.from(TABLE)
		.update({ ...data })
		.eq('id', data.id);

	if (error) {
		throw new Error(error.message);
	}
};

const removeFitnessRecord = async ({ id }: { id: string }) => {
	return await supabase.from(TABLE).delete().eq('id', id);
};

export { getMonthlyFitnessRecords, addFitnessRecord, updateFitnessRecord, removeFitnessRecord };
