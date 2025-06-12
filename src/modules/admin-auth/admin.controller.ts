
import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  HttpCode, 
  HttpStatus, 
  Headers,
  InternalServerErrorException, 
  UnauthorizedException 
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { LoginAdminDto } from './dto/login-admin.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignupAdminDto } from './dto/signup-admin.dto';
import { 
  ApiAcceptedResponse, 
  ApiBearerAuth, 
  ApiBody, 
  ApiOperation, 
  ApiResponse, 
  ApiUnauthorizedResponse 
} from '@nestjs/swagger';
import { LoginResponses } from '../../interfaces/auth.interface';
import { ChangePasswordDto } from './dto/changepassword.dto';
import { AdminDocument } from '../../schema/admin.schema';
import { CurrentUser } from 'src/decorator/current-admin.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ValidateTokenDto } from './dto/validate-token.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { LoggerModule } from '../../utils/logger/logger.module';
import * as winston from 'winston';
import { InjectLogger } from 'src/utils/logger/logger.provider';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    @InjectLogger('AdminController') private readonly logger: winston.Logger
  ) {}

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
    this.logger.info('Received admin signup request');
    
    try {
      const result = await this.adminService.signup(signupAdminDto);
      this.logger.info('Admin signup completed successfully');
      
      return {
        success: true,
        message: 'Admin registered successfully',
        data: result
      };
    } catch (error) {
      this.logger.error('Admin signup failed', {
        error: error.message,
        stack: error.stack,
        payload: { email: signupAdminDto.email }
      });
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
    type: LoginResponses
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials' 
  })
  async login(@Body() loginAdminDto: LoginAdminDto): Promise<LoginResponses> {
    this.logger.info('Received admin login request', { email: loginAdminDto.email });
    
    try {
      const result = await this.adminService.login(loginAdminDto);
      this.logger.info('Admin login successful', { email: loginAdminDto.email });
      return result;
    } catch (error) {
      this.logger.error('Admin login failed', {
        error: error.message,
        email: loginAdminDto.email
      });
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Post('change-password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin change password' })
  @ApiBody({ 
    type: ChangePasswordDto,
    description: 'Current password and new password' 
  })
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
  async changePassword(
    @CurrentUser() admin: AdminDocument,
    @Body() changePasswordDto: ChangePasswordDto
  ) {
    this.logger.info('Change password request', { adminId: admin._id });
    
    try {
      const result = await this.adminService.changePassword(admin, changePasswordDto);
      this.logger.info('Password changed successfully', { adminId: admin._id });
      
      return {
        success: true,
        message: result.message,
        data: result
      };
    } catch (error) {
      this.logger.error('Failed to change password', {
        adminId: admin._id,
        error: error.message
      });
      throw error;
    }
  }

  @Post('forgot-password')
  @ApiOperation({ 
    summary: 'Admin forgot password',
    description: 'Send reset password OTP to admin email'
  })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'If this email exists, OTP has been sent'
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    this.logger.info('Forgot password request', { email: forgotPasswordDto.email });
    
    try {
      const result = await this.adminService.forgotPassword(forgotPasswordDto);
      this.logger.info('Forgot password processed successfully', { email: forgotPasswordDto.email });
      return result;
    } catch (error) {
      this.logger.error('Forgot password failed', {
        email: forgotPasswordDto.email,
        error: error.message
      });
      throw error;
    }
  }

  @Post('reset-password')
  @ApiOperation({ 
    summary: 'Reset password with OTP',
    description: 'Verify OTP and set new password'
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
    this.logger.info('Reset password request');
    
    try {
      const result = await this.adminService.resetPassword(resetPasswordDto);
      this.logger.info('Password reset successful');
      return result;
    } catch (error) {
      this.logger.error('Password reset failed', {
      
        error: error.message
      });
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  @ApiOperation({ 
    summary: 'Log out admin user', 
    description: 'Invalidates the current session for the specified device' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Successful logout',
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
  async logout(@Headers('authorization') authHeader: string) {
    this.logger.info('Received logout request');
    
    try {
      if (!authHeader) {
        this.logger.warn('Logout attempt without authorization header');
        throw new UnauthorizedException('Authorization header is required');
      }

      const token = authHeader?.split(' ')[1];
      if (!token) {
        this.logger.warn('Invalid Bearer token format');
        throw new UnauthorizedException('Invalid Bearer token format');
      }

      this.logger.debug('Processing logout', { token: '***' });
      const result = await this.adminService.logout(token);
      this.logger.info('Logout successful');
      
      return result;
    } catch (error) {
      this.logger.error('Logout failed', { error: error.message });
      throw error;
    }
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
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    this.logger.info('Refresh token request received');
    
    try {
      const result = await this.adminService.refreshToken(refreshTokenDto);
      this.logger.info('Token refreshed successfully');
      
      return {
        success: true,
        message: 'Token refreshed successfully',
        data: result
      };
    } catch (error) {
      this.logger.error('Failed to refresh token', {
        error: error.message,
        stack: error.stack
      });
      throw new InternalServerErrorException('Failed to refresh token');
    }
  }


}