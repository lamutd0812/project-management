import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { UserRepository } from '../users/repositories/user.repository';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { envConfig } from '@configuration/env.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: envConfig.JWT_SECRET_KEY,
    });
  }

  async validate(payload: JwtPayloadDto): Promise<User> {
    const { userId, username } = payload;
    const user = await this.userRepository.findOne({
      where: { id: userId, username },
      select: ['id', 'username', 'role'],
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
