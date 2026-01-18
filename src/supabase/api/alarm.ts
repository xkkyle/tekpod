import { Dispatch, SetStateAction } from 'react';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import supabase from '../service';
import type { Alarm } from '../schema';
import { currentMonth, currentYear } from '../../utils';

type SupabaseChangePayload = {
	schema: string;
	table: string;
	old: unknown;
	new: unknown;
	eventType: '*' | 'INSERT' | 'UPDATE' | 'DELETE';
	errors: Error;
	commit_timestamp: string;
};

const TABLE = import.meta.env.VITE_SUPABASE_DB_TABLE_ALARM;

const getSubscribed = (update?: Dispatch<SetStateAction<RealtimePostgresChangesPayload<{ [key: string]: unknown }> | undefined>>) => {
	return supabase
		.channel('db-changes')
		.on(
			'postgres_changes',
			{
				event: '*',
				schema: 'public',
				table: TABLE,
			},
			payload => {
				if (update) {
					update(payload);
				}
			},
		)
		.subscribe(status => {
			if (status === 'SUBSCRIBED') return;

			if (status === 'CLOSED') {
				console.log('[Realtime - ALARM] Connection Closed');
			}

			console.log('[Realtime - ALARM] Connection Established');
		});
};

const getUncompletedAlarms = async () => {
	const startDate = `${currentYear}-01-01`;
	const endDate = `${currentYear}-12-${new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999).getDate()}`;
	const { data, error } = await supabase
		.from(TABLE)
		.select('*')
		.gte('reminder_time', startDate)
		.lte('reminder_time', endDate)
		.eq('isChecked', false)
		.order('reminder_time', { ascending: false });

	if (error) {
		throw new Error(error.message);
	}

	return { data, count: data.length };
};

const getAlarms = async () => {
	const startDate = `${currentYear}-01-01`;
	const endDate = `${currentYear}-12-${new Date(currentYear, currentMonth + 2, 0, 23, 59, 59, 999).getDate()}`;

	const { data, error } = await supabase
		.from(TABLE)
		.select('*')
		.gte('reminder_time', startDate)
		.lte('reminder_time', endDate)
		.order('reminder_time', { ascending: false });

	if (error) {
		throw new Error(error.message);
	}

	return data;
};

const addAlarm = async (data: Omit<Alarm, 'id'>) => {
	const { error: addAlarmError } = await supabase.from(TABLE).insert(data).select();

	if (addAlarmError) {
		throw new Error(addAlarmError.message);
	}
};

const editAlarm = async ({ todo_id, content, isChecked, reminder_time, updated_at }: Partial<Alarm>) => {
	const { error: editAlarmError } = await supabase
		.from(TABLE)
		.update({ content, isChecked, reminder_time, updated_at })
		.eq('todo_id', todo_id);

	if (editAlarmError) {
		throw new Error(editAlarmError.message);
	}
};

export type { SupabaseChangePayload };
export { getSubscribed, getUncompletedAlarms, getAlarms, addAlarm, editAlarm };
