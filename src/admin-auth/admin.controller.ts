

import { Controller, Post, Body, Param, UseInterceptors , UseGuards,Req, HttpCode, HttpStatus, InternalServerErrorException, BadRequestException, UnauthorizedException} from '@nestjs/common';
import { AdminService } from './admin.service';
import { LoginAdminDto } from './dto/login-admin.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthGuard } from '@nestjs/passport';
import { SignupAdminDto } from './dto/signup-admin.dto';
import { ApiAcceptedResponse, ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
// import { Throttle } from '@nestjs/throttler';
// import { UploadProfileDto } from './dto/upload-profile.dto';
// import { File } from '@nestjs/common'; 
// import { File } from '@nestjs/common/decorators/http/file.decorator';
import { LoginResponseDto, LogoutResponseDto } from './dto/login-response.dto';
import { ChangePasswordDto } from './dto/changepassword.dto';
import { AdminDocument } from './schemas/admin.schema';
import { CurrentUser } from './decorator/current-admin.decorator';
import { HTTP_CODE_METADATA } from '@nestjs/common/constants';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ValidateTokenDto } from './dto/validate-token.dto';
import { LogoutDto } from './dto/logout.dto';
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}


  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Admin signup' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Admin registered successfully',
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'Admin already exists or email is taken' 
  })
  @ApiBody({ type: SignupAdminDto })
  async signup(@Body() signupAdminDto: SignupAdminDto) {
    try {
      const result = await this.adminService.signup(signupAdminDto);
      return {
        success: true,
        message: 'Admin registered successfully',
        data: result
      };
    } catch (error) {
      throw error;
    }
  }



  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin login' })
  @ApiBody({ type: LoginAdminDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin logged in successfully',
    type: LoginResponseDto
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED,
     description: 'Invalid credentials' })
  async login(@Body() loginAdminDto: LoginAdminDto) :Promise<LoginResponseDto> {
    return await this.adminService.login(loginAdminDto);
  }

  

   @Post('change-password')
// @UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiOperation({ summary: 'Admin change password' })
@ApiBody({ type: ChangePasswordDto ,
  description: 'Current password and new password' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password changed successfully',
    schema: {
      example: {
        success: true,
        message: 'Password changed successfully',
        data: null
      }
      
    }
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid credentials or not logged in',
    schema: {
      example: {
        statusCode: 401,
        message: 'Current password is incorrect',
        error: 'Unauthorized'
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request - Invalid input data',
    schema: {
      example: {
        statusCode: 400,
        message: ['currentPassword must be a string', 'newPassword must be a string'],
        error: 'Bad Request'
      }
    }
  })
async changePassword(
  @CurrentUser() admin: AdminDocument,
  @Body() changePasswordDto: ChangePasswordDto
) {
 try {
  const result =  await this.adminService.changePassword(admin, changePasswordDto);
  return {
    success: true,
    message: result.message,
    data: result
  }
} catch (error) {
  throw error;
}
}

//


  @Post('forgot-password')
  @ApiOperation({ summary: 'Admin forgot password' ,
    description: 'Send reset password OTP to admin email'
  })

  @ApiBody({type:ForgotPasswordDto})
  @ApiResponse({status:HttpStatus.OK,
    description:'If this email exists, OTP has been sent'})

  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.adminService.forgotPassword(forgotPasswordDto);
  }

// @UseGuards(AuthGuard('jwt'))
  @Post('reset-password')
  @ApiOperation({ 
    summary: 'Reset password with OTP',
    description: 'Verify OTP and set new password. '
  })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ 
    status: HttpStatus.OK,
    description: 'Password reset successful',
    schema: {
      example: { message: 'Password successfully reset' }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid OTP or expired' 
  })
  
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.adminService.resetPassword(resetPasswordDto);
  }


  @UseGuards(AuthGuard('jwt'))

  @Post('logout')
  

  @ApiOperation({ summary: 'Log out admin user', description: 'Invalidates the current session for the specified device' })
  @ApiResponse({ 
    status: 200, 
    description: 'Successful logout',
    type: LogoutResponseDto
  })
  @ApiUnauthorizedResponse({ 
    description: 'Unauthorized - Invalid token or missing required fields',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid token payload: missing required fields',
        error: 'Unauthorized'
      }
    }
  })
  


async logout(@Body() logoutDto: LogoutDto) {
  if (!logoutDto.accessToken) {
    throw new UnauthorizedException('Access token is required');
  }
  return  await this.adminService.logout(logoutDto);
}


  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh an access token using a refresh token' })
  @ApiBody({
    description: 'Refresh token data',
    schema: {
      type: 'object',
      properties: {
        refreshToken: {
          type: 'string',
          description: 'The refresh token used to obtain a new access token',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
      required: ['refreshToken'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Token refreshed successfully' },
        data: {
          type: 'object',
          properties: {
            accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          },
        },
      },
    },
  })

  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    try {
      
      const result = await this.adminService.refreshToken(
       
        refreshTokenDto 
      );
      
      return {
        success: true,
        message: 'Token refreshed successfully',
        data: result
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to refresh token');
    }
  }

  @Post('validate-token')
  @ApiOperation({ summary: 'Validate an access token' })
  @ApiBody({
    description: 'Access token data',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          description: 'The access token to validate',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
      required: ['accessToken'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Token validation completed',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Token validation completed' },
        data: {
          type: 'object',
          properties: {
            isValid: { type: 'boolean', example: true },
            admin: { type: 'string', example: 'admin123' },
          },
        },
      },
    },
  })
  async validateToken(@Body() validateTokenDto: ValidateTokenDto) {
    try {
     
      
      const result = await this.adminService.validateToken(validateTokenDto.accessToken);
      
      return {
        success: true,
        message: 'Token validation completed',
        data: result
      };
    } catch (error) {
      if (error.name === 'BadRequestException') {
        throw error;
      }
      throw new InternalServerErrorException('Failed to validate token');
    }
  }
  // @Post('upload-profile')
  // @UseInterceptors(FileInterceptor('file')) // Interceptor for file handling
  // async uploadProfilePic(
  //   @Body() uploadProfileDto: UploadProfileDto,
  //   @File() file: Express.Multer.File
  // ) {
  //   return await this.adminService.uploadProfilePic(uploadProfileDto, file);
  // }
  
}
