import type { UserRoles } from './userRoles';

export interface PBUser {
	id: string;
	username: string;
	email: string;
	name: string;
	avatar: string;
	collectionId: string;
	role: UserRoles;
}
