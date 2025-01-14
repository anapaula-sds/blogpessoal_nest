import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tb_postagens' }) //CREATE TABLE tb_postagens();
export class Postagem {
  @PrimaryGeneratedColumn() //AUTO_INCREMENT PRIMARY KEY
  id: number;

  //não permite espaços vazios antes e depois ou totalmente vazio
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty() // Validação dos dados dos objetos
  @Column({ length: 100, nullable: false }) //VARCHAR(100) NOT NULL
  titulo: string;

  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty() // Validação dos dados dos objetos
  @Column({ length: 100, nullable: false }) //VARCHAR(100) NOT NULL
  texto: string;

  @UpdateDateColumn()
  data: Date;
}
