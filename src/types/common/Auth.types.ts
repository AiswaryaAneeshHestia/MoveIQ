// src/types/Auth.types.ts
export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  userId: number;
  userName: string;
  userEmail: string;
  phoneNumber: string;
  address: string;
  passwordHash: string;
  isActive: boolean;
  islocked: boolean;
  createAt: string;
  lastlogin: string;
  lastloginString: string;
  createAtSyring: string;
  auditLogs: any[];
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
  user: User;
}
