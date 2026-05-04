import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { cleanDb } from './utils/db';
import { PrismaService } from 'src/prisma/prisma.service';

describe('Evaluation (e2e)', () => {
  let app: INestApplication;
  let token: string;

  const manager = {
    name: 'Manager',
    email: `manager_${Date.now()}@test.com`,
    password: '123456',
    role: 'MANAGER',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await cleanDb(app.get(PrismaService));
  });

  beforeEach(async () => {
    // signup
    await request(app.getHttpServer()).post('/auth/signup').send(manager);

    // login
    const res = await request(app.getHttpServer()).post('/auth/login').send({
      email: manager.email,
      password: manager.password,
    });

    token = res.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create evaluation (manager only)', async () => {
    const res = await request(app.getHttpServer())
      .post('/evaluations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Eval 1',
        skill: 'React',
        config: {},
      })
      .expect(201);

    expect(res.body.title).toBe('Eval 1');
  });

  it('should fetch evaluations', async () => {
    await request(app.getHttpServer())
      .post('/evaluations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Eval 2',
        skill: 'Node',
        config: {},
      });

    const res = await request(app.getHttpServer())
      .get('/evaluations')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.length).toBeGreaterThan(0);
  });
});
