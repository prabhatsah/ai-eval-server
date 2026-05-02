import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Protected Routes (e2e)', () => {
  let app: INestApplication;
  let token: string;

  const user = {
    name: 'Protected User',
    email: 'protected@example.com',
    password: '123456',
    role: 'MANAGER',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // signup
    await request(app.getHttpServer()).post('/auth/signup').send(user);

    // login
    const res = await request(app.getHttpServer()).post('/auth/login').send({
      email: user.email,
      password: user.password,
    });

    token = res.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should deny access without token', async () => {
    await request(app.getHttpServer())
      .get('/test-protected/manager')
      .expect(401);
  });

  it('should allow access with valid token', async () => {
    const res = await request(app.getHttpServer())
      .get('/test-protected/manager')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.message).toBeDefined();
  });
});
