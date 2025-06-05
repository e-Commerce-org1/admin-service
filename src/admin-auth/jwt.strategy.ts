// // admin-auth/jwt.strategy.ts
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import config from '../config/jwt.config';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor() {
//     const { jwtSecret } = config();
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: jwtSecret,
//     });
//   }

//   async validate(payload: any) {
    
//     if (!payload || !payload.email) {
//       throw new UnauthorizedException('Invalid token payload');
//     }
//     return payload; 
//   }
// }

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import config from '../config/jwt.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config().jwtSecret,
      ignoreExpiration: false, 
    });
  }

  async validate(payload: any) {
  
    if (!payload?.email || !payload?.deviceId) {
      throw new UnauthorizedException('Invalid token: missing required fields');
    }
    
   
    return {
      email: payload.email,
      deviceId: payload.deviceId,
     
    };
  }
}
