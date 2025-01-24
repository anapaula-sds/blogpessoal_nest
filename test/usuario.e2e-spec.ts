// Importa os módulos e classes necessários para criar e testar o aplicativo NestJS
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';

// Define um grupo de testes para os módulos Usuario e Auth
describe('Teste dos Modulos Usuario e Auth (e2e)', () => {
  let token: any; // Variável para armazenar o token de autenticação
  let usuarioId: any; // Variável para armazenar o ID do usuário criado durante os testes

  let app: INestApplication; // Variável que representa a aplicação NestJS

  // Antes de todos os testes, configura o ambiente e inicializa a aplicação
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        // Configura o banco de dados SQLite em memória para testes
        TypeOrmModule.forRoot({
          type: "sqlite",
          database: ":memory:", // Banco de dados em memória
          entities: [__dirname + "./../src/**/entities/*.entity.ts"], // Localização das entidades
          synchronize: true, // Sincroniza automaticamente o esquema do banco
          dropSchema: true, // Remove o esquema ao final do ciclo de vida
        }),
        AppModule, // Importa o módulo principal da aplicação
      ],
    }).compile();

    app = moduleFixture.createNestApplication(); // Cria a instância da aplicação
    app.useGlobalPipes(new ValidationPipe()); // Adiciona a validação global
    await app.init(); // Inicializa a aplicação
  });

  // Após todos os testes, fecha a aplicação
  afterAll(async () => {
    await app.close();
  });

  // Teste 01: Cadastrar um novo usuário
  it("01- Deve Cadastrar um Novo Usuário", async () => {
    const resposta = await request(app.getHttpServer()) // Faz uma requisição HTTP
      .post("/usuarios/cadastrar") // Endpoint para cadastrar usuários
      .send({
        nome: "Root", // Dados do novo usuário
        usuario: "root@root.com",
        senha: "rootroot",
        foto: "-",
      })
      .expect(201); // Espera o status HTTP 201 (Created)

    usuarioId = resposta.body.id; // Armazena o ID do usuário criado
  });

  // Teste 02: Não deve permitir o cadastro de usuários duplicados
  it("02- Não Deve Cadastrar Usuario Duplicado", async () => {
    return await request(app.getHttpServer())
      .post("/usuarios/cadastrar") // Tenta cadastrar o mesmo usuário novamente
      .send({
        nome: "Root",
        usuario: "root@root.com",
        senha: "rootroot",
        foto: "-",
      })
      .expect(400); // Espera o status HTTP 400 (Bad Request)
  });

  // Teste 03: Autenticar o usuário (Login)
  it("03- Deve Autenticar o Usuário (Login)", async () => {
    const resposta = await request(app.getHttpServer())
      .post("/usuarios/logar") // Endpoint de login
      .send({
        usuario: "root@root.com",
        senha: "rootroot",
      })
      .expect(200); // Espera o status HTTP 200 (OK)

    token = resposta.body.token; // Armazena o token retornado
  });

  // Teste 04: Listar todos os usuários cadastrados
  it("04- Listar todos os Usuários Cadastrados", async () => {
    return await request(app.getHttpServer())
      .get("/usuarios/all") // Endpoint para listar todos os usuários
      .set("Authorization", `${token}`) // Inclui o token no cabeçalho
      .expect(200); // Espera o status HTTP 200 (OK)
  });

  // Teste 05: Atualizar os dados de um usuário existente
  it("05- Deve Atualizar os Usuarios", async () => {
    return await request(app.getHttpServer())
      .put('/usuarios/atualizar') // Endpoint para atualizar um usuário
      .set('Authorization', `${token}`) // Inclui o token no cabeçalho
      .send({
        id: usuarioId, // ID do usuário a ser atualizado
        nome: "Root atualizado",
        usuario: "root@root.com",
        senha: "rootroot",
        foto: "fotobonita.jpg",
      })
      .expect(200) // Espera o status HTTP 200 (OK)
      .then(resposta => {
        expect("Root atualizado").toEqual(resposta.body.nome); // Valida que o nome foi atualizado
      });
  });

  // Teste 06: Deve Mostrar os Usuarios por Id
  it("06- Deve Mostrar os Usuarios por Id", async () => {
    return await request(app.getHttpServer())
      .get(`/usuarios/${usuarioId}`) // Endpoint para buscar usuário pelo ID
      .set("Authorization", `${token}`) // Inclui o token no cabeçalho
      .expect(200); // Espera o status HTTP 200 (OK)
  });
});
