import * as argon from 'argon2';
import { ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        // TODO: Get JWT_SECRET from ConfigService
        // private config: ConfigService
    ) { }

    async register(registerDto) {
        try {

            const { email, username, password } = registerDto;

            const hashedPassword = await argon.hash(password);

            const newUser = await this.prismaService.user.create({
                data: {
                    email,
                    username,
                    hashed_password: hashedPassword
                }
            });

            return newUser;

        } catch (error) {

            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {

                    if (error.meta.target[0] === 'email') {
                        throw new ConflictException('Email already exists');
                    }

                    if (error.meta.target[0] === 'username') {
                        throw new ConflictException('Username already exists');
                    }
                }
            }

            throw new Error(error);

        }
    }

    async login(loginDto) {
        const { username, password } = loginDto;

        const user = await this.prismaService.user.findUnique({
            where: {
                username
            }
        });

        if (!user) {
            throw new ForbiddenException('Credentials incorrect');
        }

        const passwordValid = await argon.verify(
            user.hashed_password,
            password
        );

        if (passwordValid === false) {
            throw new UnauthorizedException('Invalid password');
        }

        return user;
    }
}
