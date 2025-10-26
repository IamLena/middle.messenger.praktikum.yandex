export type LoginData = {
	password: string;
	email: string;
};

export type RegisterData = {
	first_name: string;
	second_name: string;
	login: string;
	email: string;
	password: string;
	phone: string;
};

export type UserId = number;
export type UserRole = 'admin' | 'regular';

export type User = {
	id: UserId;
	first_name: string;
	second_name: string;
	display_name: string;
	phone: string;
	login: string;
	avatar: string;
	email: string;
};

export type GetChatsOptions = {
	offset?: number;
	limit?: number;
	title?: string;
};

export type Message = {
	user: User;
	time: string;
	content: string;
};

export type ChatId = number;

export type RawChat = {
	id: ChatId;
	title: string;
	avatar: string;
	unread_count: number;
	created_by: UserId;
	last_message: Message;
};

// normalized in store
export type Chat = {
	id: ChatId;
	title: string;
	avatar: string;
	unread_count: number;
	created_by: UserId;
	// last_message: Message;
	users: Record<UserId, UserRole>;
};

export type RawDeleteResult = {
	userId: UserId;
	result: {
		id: ChatId;
		title: string;
		avatar: string;
		created_by: UserId;
	};
};

export type GetChatUsersOptions = {
	id: ChatId;
	offset?: number;
	limit?: number;
	name?: string;
	email?: string;
};

export type RawChatUser = {
	id: UserId;
	first_name: string;
	second_name: string;
	display_name: string;
	login: string;
	avatar: string;
	role: UserRole;
};

export type ChatUsersData = {
	users: UserId[];
	chatId: ChatId;
};

// as UserInfo
export type ProfileInfo = {
	first_name: string;
	second_name: string;
	display_name: string;
	login: string;
	email: string;
	phone: string;
};

export type PasswordData = {
	oldPassword: string;
	newPassword: string;
};

export type AvatarData = FormData;
// {
// 	avatar: FormData;
// };

export type ResourceId = number;

export type Resource = {
	id: ResourceId;
	user_id: UserId;
	path: string;
	filename: string;
	content_type: string;
	content_size: number;
	upload_date: string;
};

export type ResourceUploadData = {
	resource: FormData;
};
