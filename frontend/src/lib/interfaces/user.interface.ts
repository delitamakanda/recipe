export interface Token {
    access: string;
    refresh: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
    is_superuser: boolean;
    date_joined: Date;
    last_login: Date;
    tokens: Token;
}

export interface UserResponse {
    user: User;
}
