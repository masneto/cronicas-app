const request = require('supertest');
const app = require('../src/app');

describe('GET /', () => {
  it('should return index.html', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.headers['content-type']).toMatch(/html/);
    expect(res.text).toContain('<!DOCTYPE html>');
  });
});