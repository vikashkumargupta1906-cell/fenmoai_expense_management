const request = require('supertest');
const app = require('../index');
const crypto = require('crypto');

describe('Expense API', () => {
  const testId = crypto.randomUUID();

  it('should create a new expense successfully', async () => {
    const res = await request(app)
      .post('/expenses')
      .send({
        id: testId,
        amount: 150.75,
        category: 'Food',
        description: 'Test Expense',
        date: new Date().toISOString()
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id', testId);
    expect(res.body.amount).toBe('150.75');
  });

  it('should return 400 for negative amount', async () => {
    const res = await request(app)
      .post('/expenses')
      .send({
        id: crypto.randomUUID(),
        amount: -10,
        category: 'Transport',
        date: new Date().toISOString()
      });
    
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors[0].msg).toContain('positive number');
  });

  it('should be idempotent (return 200 for existing ID)', async () => {
    // Send same request as the first test
    const res = await request(app)
      .post('/expenses')
      .send({
        id: testId,
        amount: 150.75,
        category: 'Food',
        description: 'Test Expense',
        date: new Date().toISOString()
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', testId);
  });

  it('should return 400 for future date', async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    
    const res = await request(app)
      .post('/expenses')
      .send({
        id: crypto.randomUUID(),
        amount: 10,
        category: 'Food',
        date: futureDate.toISOString()
      });
    
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toContain('future');
  });

  it('should return 400 for date more than 100 years in the past', async () => {
    const ancientDate = new Date();
    ancientDate.setFullYear(ancientDate.getFullYear() - 101);
    
    const res = await request(app)
      .post('/expenses')
      .send({
        id: crypto.randomUUID(),
        amount: 10,
        category: 'Food',
        date: ancientDate.toISOString()
      });
    
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toContain('100 years');
  });

  it('should fetch expenses list with pagination', async () => {
    const res = await request(app).get('/expenses');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('expenses');
    expect(Array.isArray(res.body.expenses)).toBe(true);
    expect(res.body).toHaveProperty('pagination');
    expect(res.body.pagination.currentPage).toBe(1);
  });
});
