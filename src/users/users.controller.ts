import { Controller, Delete, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthenticationGuard } from '../authentication/jwt-authentication.guard';
import { RequestWithUser } from '../authentication/request-with-user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Delete()
  @UseGuards(JwtAuthenticationGuard)
  async delete(@Req() request: RequestWithUser) {
    await this.usersService.delete(request.user.id);
  }
}
