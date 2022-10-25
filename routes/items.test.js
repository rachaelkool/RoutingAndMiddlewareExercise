process.env.NODE_ENV = 'test';
const request = require('supertest');

const app = require('../app');
let items = require('../fakeDb');


let test_item = { name: 'cherries', price: 3.50 };

beforeEach(function () {
    items.push(test_item);
});


afterEach(function () {
    items.length = 0;
});


describe('GET /items', () => {
    test('Get all items', async () => {
        const res = await request(app).get('/items');
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual( [test_item] )
    })
})


describe('POST /items', () => {
    test('Add a new item', async () => {
        const res = await request(app).post('/items').send({ name: 'bacon', price: 5.00 });
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ added: { name: 'bacon', price: 5.00 } });
    })
    test('Responds with 400 if missing info', async () => {
        const res = await request(app).post('/items').send({});
        expect(res.statusCode).toBe(400);
    })
})


describe('GET /items/:name', () => {
    test('Get item by name', async () => {
        const res = await request(app).get(`/items/${test_item.name}`);
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(test_item)
    })
    test('Responds with 404 for invalid item', async () => {
        const res = await request(app).get('/items/bananas');
        expect(res.statusCode).toBe(404)
    })
})


describe('/PATCH /items/:name', () => {
    test('Updating an item', async () => {
        let test_item = { name: 'cherries', price: 3.50 };
        items.push(test_item);
        const res = await request(app).patch(`/items/${test_item.name}`).send({ name: 'broccoli', price: 5.25 });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual( {updated: { name: 'broccoli', price: 5.25 } } );
    })
    test('Responds with 404 for invalid item', async () => {
        const res = await request(app).patch('/items/carrots').send({ name: 'broccoli', price: 5.25 } );
        expect(res.statusCode).toBe(404);
    })
})


describe('/DELETE /items/:name', () => {
    test('Delete an item', async () => {
        let test_item = { name: 'cherries', price: 3.50 };
        items.push(test_item);
        const res = await request(app).delete(`/items/${test_item.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: 'Deleted' })
    })
    test('Responds with 404 for invalid item', async () => {
        const res = await request(app).delete('/items/eggs');
        expect(res.statusCode).toBe(404);
    })
})


  