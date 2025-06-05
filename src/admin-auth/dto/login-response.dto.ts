export class LoginResponseDto {
	 admin :{
   adminId : string;
   email : string ;
   deviceId?: string;
   role :string ;
  

	 };
	tokens :{
		accessToken: string;
		refreshToken: string;
	
	};
}
export class AccessTokenResponseDto {
	accessToken: string;
  }
  export class LogoutResponseDto {
	success: boolean;

  }
  
  
  export class ValidateTokenResponseDto {
	isValid: boolean;
	admin: string ;
  }