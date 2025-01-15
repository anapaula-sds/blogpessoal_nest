import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemaService } from '../tema/services/tema.service';
import { TemaModule } from '../tema/tema.module';
import { Postagem } from './entities/postagem.entity';
import { PostagemController } from './controllers/postagem.controller';
import { PostagemService } from './services/postagem.service';

@Module({
  imports: [TypeOrmModule.forFeature([Postagem]), TemaModule],
  controllers: [PostagemController],
  providers: [PostagemService, TemaService],
  exports: [TypeOrmModule],
})
export class PostagemModule {}
