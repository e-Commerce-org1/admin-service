import { Observable } from 'rxjs';
import  { Tokens } from '../../grpc/interfaces/token.inteface';



export interface LoginRequest {
	email: string;
	deviceId: string;
	role: string;
	userId: string;
  }
  
   export interface LoginResponse {
	accessToken: string;
	refreshToken: string;
  }
  
   export interface AccessTokenRequest {

	refreshToken: string;
  }
  
  export interface AccessTokenResponse {
	accessToken: string;
  }
  
   export interface LogoutRequest {
	accessToken: string;
  }
  
  export interface LogoutResponse {
	success: boolean;
  }
  
  export interface ValidateTokenRequest {
	accessToken: string;
  }
  
  export interface ValidateTokenResponse {
	isValid: boolean;
	admin: string;
  }
 export  interface AuthService {
	getToken(request: LoginRequest): Observable<LoginResponse>;
	accessToken(request: AccessTokenRequest): Observable<AccessTokenResponse>;
	logout(request: LogoutRequest): Observable<LogoutResponse>;
	validateToken(request: ValidateTokenRequest): Observable<ValidateTokenResponse>;
  }