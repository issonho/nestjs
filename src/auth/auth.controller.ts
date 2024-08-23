import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from 'src/user/dtos/create-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/roles.enum';

@Controller('auth')
export class AuthController {
    constructor(private userService: UserService, private authService: AuthService) {}
    
    @Post('/register')
    async register(@Body() createUserDTO: CreateUserDTO) {
        const user = this.userService.addUser(createUserDTO);
        return user;
    }

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Request() req: any) {
        const user = this.authService.login(req.user);
        return user;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Get('/user')
    getProfile(@Request() req: any) {
        return req.user;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get('/admin')
    getAdmin(@Request() req: any) {
        return req.user;
    }
}
