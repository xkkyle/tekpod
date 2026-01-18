import { format, toZonedTime } from 'date-fns-tz';

type Year = (typeof years)[number];
type Month = (typeof months)[number];

const koreaTimeZone = 'Asia/Seoul';

const today = new Date();
const todayLocaleString = today.toLocaleString('en-US', { timeZone: koreaTimeZone });

const [currentYear, currentMonth, currentDate] = [today.getFullYear(), today.getMonth(), today.getDate()];

const years = [...Array.from({ length: 3 }, (_, idx) => `${currentYear - idx}`)] as const;
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

const calendar = months.reduce<Record<string, number[]>>((acc, _, idx) => {
	if (!acc[`${idx + 1}`]) {
		acc[`${idx + 1}`] = [...Array.from({ length: new Date(currentYear, idx + 1, 0).getDate() }, (_, index) => index + 1)];
	}

	return acc;
}, {});

const formatByKoreanTime = (targetDate: Date | string): string => {
	const _date = typeof targetDate === 'string' || targetDate instanceof Date ? new Date(targetDate) : targetDate;

	const formattedDate = format(toZonedTime(_date, koreaTimeZone), 'yyyy/MM/dd', { timeZone: koreaTimeZone });

	return formattedDate;
};

const formatByISOKoreanTime = (targetDate: Date | string): string => {
	const _date = typeof targetDate === 'string' || targetDate instanceof Date ? new Date(targetDate) : targetDate;

	const formattedDate = format(toZonedTime(_date, koreaTimeZone), 'yyyy-MM-dd', { timeZone: koreaTimeZone });

	return formattedDate;
};

const translateNumberIntoMonth = (month: number) => months[month]; // ['Jan', 'Feb', 'Mar'][number]
const getMonthIndexFromMonths = (option: Month | null) => months.findIndex(month => month === option);

const getDateFromString = (dateString: string): Date => {
	return new Date(dateString);
};

const getNextDay = (date: Date | string) => {
	const _date = typeof date === 'string' || date instanceof Date ? new Date(date) : date;

	_date.setDate(_date.getDate() + 1);

	return _date.toISOString();
};

const getNextMonthFormatDate = (usageDate: Date | string) => {
	const _date = typeof usageDate === 'string' ? new Date(usageDate) : usageDate;
	const koreaDate = toZonedTime(_date, koreaTimeZone);
	const [month, date] = [koreaDate.getMonth(), koreaDate.getDate()];

	return `${((month + 2 > 12 ? month + 2 - 12 : month + 2) + '').padStart(2, '0')}/${(date + '').padStart(2, '0')}`;
};

export type { Year, Month };
export {
	today,
	todayLocaleString,
	currentYear,
	currentMonth,
	currentDate,
	years,
	months,
	calendar,
	formatByKoreanTime,
	formatByISOKoreanTime,
	translateNumberIntoMonth,
	getMonthIndexFromMonths,
	getDateFromString,
	getNextDay,
	getNextMonthFormatDate,
};
