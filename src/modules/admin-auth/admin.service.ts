



import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel, Schema } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument, AdminSchema } from '../../schema/admin.schema';
import { SignupAdminDto } from './dto/signup-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
// import { UploadProfileDto } from './dto/upload-profile.dto';
import { GrpcClientService } from '../../grpc/authgrpc/auth.grpc-client';
import { RedisService } from 'src/providers /redis/redis.service';
import {  hashPassword, verifyPassword } from 'src/utils/password-utils'; 
// import * as AWS from 'aws-sdk'; 
import { sendOtp } from '../../providers /email /email.service';
import { generateOtp } from 'src/utils/otp-generator';
import { ChangePasswordDto } from './dto/changepassword.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AccessTokenResponse } from '../../interfaces/auth.interface';
import { LogoutDto } from './dto/logout.dto';
// import * as path from 'path'; 
// import { LoginResponseDto } from './dto/login-response.dto';
@Injectable()
export class AdminService {     
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
    private readonly grpcClientService: GrpcClientService, 
    private readonly redisService: RedisService, 
  ) {}


  
async signup(signupAdminDto: SignupAdminDto) {
    const { email, password, deviceId } = signupAdminDto;

    const existingAdminCount = await this.adminModel.countDocuments();
    if (existingAdminCount > 1) {
      throw new ConflictException('Admin already exists. Only one admin is allowed.');
    }
    
    const existingAdmin = await this.adminModel.findOne({ email });
    if (existingAdmin) {
      throw new ConflictException('Admin with this email already exists');
    }
  
    const hashedPassword = await hashPassword(password);
    const newAdmin = new this.adminModel({
      email,
      password: hashedPassword,
      role: 'admin'
    });
    
    const savedAdmin= await newAdmin.save();

 
   
    //  const uniqueUserId = savedAdmin._id.toString();


  

    return  {
      admin: {
         entityId: savedAdmin._id,
         email: savedAdmin.email,
        deviceId: deviceId,
        role: 'admin',
        // userId: uniqueUserId 
      
    

    }
  }
  }


  // async login(loginAdminDto: LoginAdminDto) {
  //   const { email, password} = loginAdminDto;
    
  //   const admin = await this.adminModel.findOne({ email }) ;
  //   if (!admin) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }
    
  //   const passwordMatch = await verifyPassword(password, admin.password);
  //   if (!passwordMatch) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }
    
  //    console.log("qwerty")
  //   // const userId = admin._id.toString();
  //   const role = 'admin';
  //   const deviceId ='android'
  // //  const adminId = admin._id.toString();
  //   const adminId = admin._id.toString();
  //   const tokens = await this.grpcClientService.getToken(adminId, deviceId, role , email
    
  //   );
  //    console.log(tokens)
    
  //   return {
  //     admin: {
  //       adminId: admin._id.toString(),
  //       email: admin.email,
  //       deviceId: deviceId,
  //       role,
      
  //     },
  //     tokens: 
  //     {
  //       accessToken: tokens.accessToken,
  //       refreshToken: tokens.refreshToken
  //     }
  //     };
    
  // }
  async login(loginAdminDto: LoginAdminDto) {
    const { email, password } = loginAdminDto;
    
    const admin = await this.adminModel.findOne({ email }) ;
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // console.log("email exist");
    
    const passwordMatch = await verifyPassword(password, admin.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
  //  console.log("password match");
    const entityId = admin._id.toString();
    const role = 'admin';
    const deviceId ='android'
    // console.log("entityId being generated",entityId);
   
    const tokens = await this.grpcClientService.getToken(entityId, deviceId, role , email
      // // email: admin.email,
      // deviceId: deviceId,
      // role: 'admin',
      // userId: uniqueUserId 
    );
    
    return {
      admin: {
        // adminId: admin._id.toString(),
        email: admin.email,
        deviceId: deviceId,
        role,
        entityId : admin._id.toString()
      
      },
      tokens: 
      {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      }
      };
    
    }


  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
  
    const admin = await this.adminModel.findOne({ email });
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }
  console.log("email exist");
    const otp = generateOtp();
    await this.redisService.setOtp(email, otp);
 console.log("otp is being generated ");
    try {
     
      await sendOtp(email, otp);
       console.log("email being called and generated");
      return {message:"OTP sent to your email"};
    } 
    catch (error) {
      throw new InternalServerErrorException('Failed to send OTP');
    }
  
  }
 
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, otp, newPassword } = resetPasswordDto;

  console.log('ResetPassword DTO:', { email, otp, newPassword }); 
  
    const storedOtp = await this.redisService.getOtp(email);
    if (!storedOtp) {
      throw new UnauthorizedException('OTP expired or invalid');
      
    }
    console.log("otp is being checked");
    if (storedOtp !== otp) {
      throw new UnauthorizedException('Invalid OTP');
   
    }
       console.log("invalid otp");
  
    const hashedPassword = await hashPassword(newPassword);
    console.log("password is being hashed");
    const updatedAdmin = await this.adminModel.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true },
    );
    console.log(
      "password is being updated",
      updatedAdmin
    );
    
    if (!updatedAdmin) {
      
      throw new UnauthorizedException('Admin not found');
    }
    
    await this.redisService.deleteOtp(email);
    return { message: 'Password successfully reset' };
  }

 
  async changePassword(admin: AdminDocument, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;
  
    
    const passwordMatch = await verifyPassword(currentPassword, admin.password);
    if (!passwordMatch) throw new UnauthorizedException('Current password is incorrect');
  
    
    const hashedPassword = await hashPassword(newPassword);
    admin.password = hashedPassword;
    await admin.save();
  
    
    return { message: 'Password changed successfully' };
  }

  

//   async logout(LogoutDto: LogoutDto) {
//   const { accessToken } = LogoutDto;
//   console.log("being called");
//   const result = await this.grpcClientService.logout({accessToken});

//   return { 
//     success: result.success,
//     message: result.success ? 'Logged out successfully' : 'Logout failed'
//   };
// }

async logout(accessToken: string) {
    console.log("Logout service being called");
    
    const result = await this.grpcClientService.logout({ accessToken });
    
    return {
      success: result.success,
      message: result.success 
        ? 'Logged out successfully' 
        : 'Logout failed'
    };
  }

  async refreshToken(RefreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = RefreshTokenDto;
    const result = await this.grpcClientService.accessToken({
      refreshToken,
    });
    
    return {
      accessToken: result.accessToken
    };
  }

  async validateToken(accessToken: string) {
    const result = await this.grpcClientService.validateToken({
      accessToken
    });
    
    return {
      isValid: result.isValid,
      admin : result.entityId,
    };
  }
}


  // async uploadProfilePic(uploadProfileDto: UploadProfileDto, file: Express.Multer.File) {
  //   const { adminid } = uploadProfileDto;

 
  //   const admin = await this.adminModel.findById(adminid);
  //   if (!admin) {
  //     throw new Error('Admin not found');
  //   }

  //   const s3 = new AWS.S3();
  //   // const fileExtension = path.extname(file.originalname);
  //   const uploadParams = {
  //     Bucket: 'your-s3-bucket-name', 
  //     Key: `${adminid}/${file.originalname}`,
  //     Body: file.buffer,
  //     ContentType: file.mimetype,
  //   };

  //   const s3Response = await s3.upload(uploadParams).promise();

  //   admin.profilePicture = s3Response.Location;
  //   await admin.save();

  //   return { message: 'Profile picture uploaded successfully', profilePicture: s3Response.Location };
  // }