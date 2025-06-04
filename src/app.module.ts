// import { Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { MongooseModule } from '@nestjs/mongoose';
// import { userController } from './users/user.controller';
// import { UserModule } from './users/user.module';


// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//       envFilePath: ['.env'],
//     }),
//     MongooseModule.forRootAsync({
//       imports: [ConfigModule],
//       useFactory: (ConfigService: ConfigService) => ({
//         uri: ConfigService.get('DB_URI'),
//       }),
//       inject: [ConfigService],
//     }),
//     UserModule
//   ],
//   controllers: [],
//   providers: [],
// })
// export class AppModule {}


import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';


@Module({
  imports: [UserModule],
})
export class AppModule {}