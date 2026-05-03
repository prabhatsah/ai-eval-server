it('should complete full attempt flow', async () => {
  // start attempt
  const startRes = await request(app.getHttpServer())
    .post('/attempt/start')
    .set('Authorization', `Bearer ${token}`)
    .send({ evaluationId });

  const attemptId = startRes.body.id;

  // submit answer
  await request(app.getHttpServer())
    .post('/attempt/answer')
    .set('Authorization', `Bearer ${token}`)
    .send({
      attemptId,
      question: 'Explain JS',
      answer: 'Language',
      type: 'AI',
    });

  // finalize
  const res = await request(app.getHttpServer())
    .post('/attempt/submit')
    .set('Authorization', `Bearer ${token}`)
    .send({ attemptId });

  expect(res.body.status).toBeDefined();
});
