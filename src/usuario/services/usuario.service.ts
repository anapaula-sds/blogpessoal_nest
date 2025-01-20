import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Repository } from 'typeorm';
import { Bcrypt } from '../../auth/bcrypt/bcrypt';
 
@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
        private bcrypt: Bcrypt
    ) {}
 
    async findAll(): Promise<Usuario[]> {
        return await this.usuarioRepository.find({
            relations: {
                postagem: true,
            }
        });
    }
 
    async findById(id: number): Promise<Usuario>{
        let usuario = await this.usuarioRepository.findOne({
            where: {
                id
            },
            relations: {
                postagem: true
            }
        });
 
        if(!usuario)
            throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);
 
        return usuario;
    }
 
    // Método auxiliar de validação de usuário
    async findByUsuario(usuario: string): Promise<Usuario | undefined>{
        return await this.usuarioRepository.findOne({
            where:{
                usuario: usuario
            }
        })
    }
 
    async create(usuario: Usuario): Promise<Usuario>{
 
        const buscaUsuario = await this.findByUsuario(usuario.usuario)
 
        if(buscaUsuario)
            throw new HttpException("O Usuário já existe!", HttpStatus.BAD_REQUEST)
 
        usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha);
 
        return await this.usuarioRepository.save(usuario);
    }
 
    async update(usuario: Usuario): Promise<Usuario>{
 
        await this.findById(usuario.id);
 
        const buscaUsuario = await this.findByUsuario(usuario.usuario)
 
        if(buscaUsuario && buscaUsuario.id !== usuario.id)
            throw new HttpException("O Usuário (e-mail) já cadastrado!", HttpStatus.BAD_REQUEST)
 
        usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha);
 
        return await this.usuarioRepository.save(usuario);
    }
   
}