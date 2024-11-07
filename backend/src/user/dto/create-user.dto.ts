export class CreateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    role: string;
}

export class LoginUserDto {
    username: string;
    password: string;
}