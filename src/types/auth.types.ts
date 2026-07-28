export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  avatarUrl: string | null;
  memberSince: string; // ISO date string
  gender?: 'Ikhwan' | 'Akhwat';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface LoginFormValues {
  username: string;
  password: string;
}

export interface RegisterFormValues {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: 'Akhwat' | 'Ikhwan';
}
