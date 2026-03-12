import { Database } from './database.types';

type TableRowData = Diary | Recipe | Todo | ExpenseTracker | User | CommuteRecord | FitnessRecord;

// {} => Record<string, never>, based on eslint ban-types
type ServiceDataType<T = TableRowData, D = Record<string, never>> = (T & D) | Partial<T & D> | null;

type Diary = Database['public']['Tables']['diary']['Row'];
type Recipe = Database['public']['Tables']['recipes']['Row'];
type Todo = Database['public']['Tables']['todos']['Row'];
type ExpenseTracker = Database['public']['Tables']['expense_tracker']['Row'];
type User = Database['public']['Tables']['users']['Row'];
type CommuteRecord = Database['public']['Tables']['commute_records']['Row'];
type Alarm = Database['public']['Tables']['alarm']['Row'];
type FitnessRecord = Database['public']['Tables']['fitness_records']['Row'];

interface RestrictedRecipe extends Recipe {
	dynamic_range: 'DR-Auto' | `DR-${'number'}`;
	wb: `${string}, ${number} Red & ${number} Blue`;
	iso: `up to ISO ${number}`;
	exposure_compensation: `${string} to ${string}` | '0';
}

interface RestricedRecipeWithImage extends RestrictedRecipe {
	imgSrc: string;
}

type RestrictedRecipeForValidation = Omit<RestrictedRecipe, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

export type {
	TableRowData,
	ServiceDataType,
	Diary,
	Recipe,
	RestrictedRecipe,
	RestricedRecipeWithImage,
	RestrictedRecipeForValidation,
	Todo,
	ExpenseTracker,
	User,
	CommuteRecord,
	Alarm,
	FitnessRecord,
};
