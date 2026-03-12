import { ElementType } from 'react';
import {
	AddPaymentModal,
	AddFilmRecipeModal,
	FilmRecipeModal,
	RemoveFilmRecipeConfirmModal,
	EditDiaryContentModal,
	ResetPasswordForEmailModal,
	UpdateProfileModal,
	TodoItemEditModal,
	RecordModal,
	EditPaymentModal,
} from '.';
import { FitnessRecordModal } from './fitnessRecords';

const modalType = {
	EXPENSE_TRACKER: 'expense_tracker',
	FILM_RECIPE: 'film_recipe',
	DIARY: 'diary',
	USER: 'user',
	TODO_REMINDER: 'todo_reminder',
	COMMUTE_RECORDS: 'commute_records',
	FITNESS_RECORDS: 'fitness_records',
} as const;

type ModalDataType = (typeof modalType)[keyof typeof modalType];
type BaseModalAction = 'GENERAL' | 'ADD' | 'READ' | 'EDIT' | 'REMOVE' | 'RESET_PASSWORD' | 'PROFILE'; // TODO: string & NonNullable<unknown>

type ModalActionMap = {
	[modalType.EXPENSE_TRACKER]: 'ADD' | 'EDIT';
	[modalType.FILM_RECIPE]: 'READ' | 'ADD' | 'REMOVE';
	[modalType.DIARY]: 'EDIT';
	[modalType.USER]: 'RESET_PASSWORD' | 'PROFILE';
	[modalType.TODO_REMINDER]: 'EDIT';
	[modalType.COMMUTE_RECORDS]: 'ADD' | 'EDIT';
	[modalType.FITNESS_RECORDS]: 'ADD' | 'EDIT';
};

type ModalConfigItem = {
	type: ModalDataType;
	Component: ElementType;
	action?: Lowercase<BaseModalAction>;
};

type ModalConfig = {
	[DATA_TYPE in keyof typeof modalType]: {
		[ACTION in ModalActionMap[(typeof modalType)[DATA_TYPE]]]: ModalConfigItem;
	};
};

const MODAL_CONFIG: ModalConfig = {
	EXPENSE_TRACKER: {
		ADD: {
			type: modalType.EXPENSE_TRACKER,
			Component: AddPaymentModal,
		},
		EDIT: {
			type: modalType.EXPENSE_TRACKER,
			Component: EditPaymentModal,
		},
	},
	FILM_RECIPE: {
		READ: {
			type: modalType.FILM_RECIPE,
			Component: FilmRecipeModal,
		},
		ADD: {
			type: modalType.FILM_RECIPE,
			Component: AddFilmRecipeModal,
		},
		REMOVE: {
			type: modalType.FILM_RECIPE,
			Component: RemoveFilmRecipeConfirmModal,
		},
	},
	DIARY: {
		EDIT: {
			type: modalType.DIARY,
			Component: EditDiaryContentModal,
		},
	},
	USER: {
		RESET_PASSWORD: {
			type: modalType.USER,
			Component: ResetPasswordForEmailModal,
		},
		PROFILE: {
			type: modalType.USER,
			Component: UpdateProfileModal,
		},
	},
	TODO_REMINDER: {
		EDIT: {
			type: modalType.TODO_REMINDER,
			Component: TodoItemEditModal,
		},
	},
	COMMUTE_RECORDS: {
		ADD: {
			type: modalType.COMMUTE_RECORDS,
			Component: RecordModal,
			action: 'add',
		},
		EDIT: {
			type: modalType.COMMUTE_RECORDS,
			Component: RecordModal,
			action: 'edit',
		},
	},
	FITNESS_RECORDS: {
		ADD: {
			type: modalType.FITNESS_RECORDS,
			Component: FitnessRecordModal,
			action: 'add',
		},
		EDIT: {
			type: modalType.FITNESS_RECORDS,
			Component: FitnessRecordModal,
			action: 'edit',
		},
	},
};

export type { ModalDataType, BaseModalAction, ModalActionMap };
export { MODAL_CONFIG, modalType };
