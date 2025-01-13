import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { PostagemService } from '../services/postagem.service';

@Controller('/postagens')
export class PostagemController {
  constructor(private readonly postagemService: PostagemService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findall() {
    return this.postagemService.findAll();
  }
}
