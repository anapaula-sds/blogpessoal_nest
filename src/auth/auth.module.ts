import { Module } from '@nestjs/common';
import { Bcrypt } from './bcrypt/bcrypt';


@Module({
    imports: [],
    controllers: [],
    providers: [Bcrypt],
    exports: [Bcrypt],
})
export class AuthModule {};