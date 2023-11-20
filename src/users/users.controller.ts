import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { promisify } from 'util';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from './guards/auth.guard';
import { UserSessionsService } from './user-sessions.service';
import { sessionIdHeader } from '../constants/session-id-header';

const scrypt = promisify(_scrypt);

const generateSalt = () => randomBytes(8).toString('hex');

const hashPassword = async (password: string, salt: string) => {
  const hash = ((await scrypt(password, salt, 32)) as Buffer).toString('hex');
  const result = salt + '.' + hash;
  return result;
};

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private userSessionsService: UserSessionsService,
  ) {}

  @Post()
  async signUp(@Body() createUserDto: CreateUserDto) {
    const { name } = createUserDto;

    const existingUser = await this.usersService.findUserByName(name);

    if (existingUser) {
      throw new BadRequestException('user already exists');
    }

    const salt = generateSalt();
    const hashedPassword = await hashPassword(createUserDto.password, salt);

    const user = await this.usersService.createUser({
      name,
      password: hashedPassword,
    });

    const session = await this.userSessionsService.createSession(user);
    return { sessionId: session.id };
  }

  // TODO: del
  @Get('sessions/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user.id;
  }

  @Post('sessions')
  async signIn(
    // TODO: another dto
    @Body() createUserDto: CreateUserDto,
  ) {
    const { name } = createUserDto;

    const user = await this.usersService.findUserByName(name);

    if (!user) {
      throw new NotFoundException('user is not found');
    }

    const [salt] = user.password.split('.');
    const hashedPassword = await hashPassword(createUserDto.password, salt);

    if (user.password !== hashedPassword) {
      throw new BadRequestException('wrong password');
    }

    const session = await this.userSessionsService.createSession(user);
    return { sessionId: session.id };
  }

  @Delete('sessions')
  async signOut(@Headers(sessionIdHeader) sessionId: string) {
    // TODO: if empty
    await this.userSessionsService.deleteSession(sessionId);
  }
}
