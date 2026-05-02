import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  const user = {
    name: 'Test User',
    email: 'test@example.com',
    password: '123456',
    role: 'MANAGER',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // full app
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should signup user', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(user)
      .expect(201);

    expect(res.body.user.email).toBe(user.email);
  });

  it('should login user and return token', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: user.email,
        password: user.password,
      })
      .expect(201);

    expect(res.body.access_token).toBeDefined();
  });
});
