export type LoginResponse = {
  access_token: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}

export type LoginRequest = {
  email: string;
  password: string;
}

export type RegistrationResponse = {
  access_token: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}

export type RefreshSessionResponse = {
  access_token: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}