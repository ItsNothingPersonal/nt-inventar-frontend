import type { UserRoles } from '$lib/types/userRoles';

export interface FormUserCreate {
	username: string;
	email: string;
	password: string;
	passwordConfirm: string;
	role: UserRoles;
}
