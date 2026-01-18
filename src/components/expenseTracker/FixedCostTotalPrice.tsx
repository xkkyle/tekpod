import { useSuspenseQuery } from '@tanstack/react-query';
import { ExpenseTracker, getFixedCostPaymentsByMonth } from '../../supabase';
import { currentMonth, currentYear, monetizeWithSeparator } from '../../utils';
import { queryKey } from '../../constants';

const FixedCostTotalPrice = () => {
	const { data } = useSuspenseQuery<ExpenseTracker[]>({
		queryKey: [...queryKey.EXPENSE_TRACKER, 'fixedCost'],
		queryFn: () => getFixedCostPaymentsByMonth({ year: currentYear, month: currentMonth - 1 }),
	});

	return <p aria-label="total price">{monetizeWithSeparator(data.reduce((acc, curr) => acc + curr.price, 0))}</p>;
};

export default FixedCostTotalPrice;
