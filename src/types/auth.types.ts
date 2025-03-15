type User = {
  email: string
  firstName: string
  id: string
  lastName: string
  phoneNumber: string
}

export type LoginResponse = {
  access_token: string
  expires_at: number
  expires_in: number
  refresh_token: string
  token_type: string
}

export type LoginDto = {
  email: string
  password: string
}

export type RegistrationResponse = {
  access_token: string
  expires_at: number
  expires_in: number
  refresh_token: string
  token_type: string
}

export type RefreshSessionResponse = {
  accessToken: string,
  user: User
}

export type RegistrationDto = {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  phone?: string
}
