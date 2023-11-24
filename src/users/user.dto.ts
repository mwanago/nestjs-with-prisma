export class UserDto {
  email: string;
  name: string;
  password: string;
  address?: {
    street: string;
    city: string;
    country: string;
  };
}
