import { AppModule } from "@/app.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from 'supertest';

describe('QuestionController e2e', () => {
    let app: INestApplication;
    let token: string

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();

        await app.init();
    });

    test('[POST] /question', async () => {
        const login = await request(app.getHttpServer()).post('/auth/create-account').send({
            email: "johndoe@email.com",
            password: "1234567"
        })

        const response = await request(app.getHttpServer())
            .post('/question')
            .set('Authorization', `Bearer ${login.body.accessToken}`)
            .send({
                title: "How to create a new question?",
                content: "I'm trying to create a new question, but I'm having some trouble. Can someone help me?"
            })

        expect(response.statusCode).toBe(201)
        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('slug')
    });

    test('[GET] /question', async () => {
        const login = await request(app.getHttpServer()).post('/auth/login').send({
            email: "johndoe@email.com",
            password: "1234567"
        })

        const response = await request(app.getHttpServer())
            .get('/question')
            .set('Authorization', `Bearer ${login.body.accessToken}`)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('questions')
        expect(response.body).toHaveProperty('total')
    })

    test('[GET] /question/:id', async () => {
        const login = await request(app.getHttpServer()).post('/auth/login').send({
            email: "johndoe@email.com",
            password: "1234567"
        })

        const question = await request(app.getHttpServer())
            .post('/question')
            .set('Authorization', `Bearer ${login.body.accessToken}`)
            .send({
                title: "How to find a question?",
                content: "I'm trying to find a question, but I'm having some trouble. Can someone help me?"
            })

        const response = await request(app.getHttpServer())
            .get(`/question/${question.body.id}`)
            .set('Authorization', `Bearer ${login.body.accessToken}`)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('slug')
    })

    test('[PATCH] /question', async () => {
        const login = await request(app.getHttpServer()).post('/auth/login').send({
            email: "johndoe@email.com",
            password: "1234567"
        })

        const question = await request(app.getHttpServer())
            .post('/question')
            .set('Authorization', `Bearer ${login.body.accessToken}`)
            .send({
                title: "How to edit an existing question?",
                content: "I'm trying to update my question, but I'm having some trouble. Can someone help me?"
            })

        const response = await request(app.getHttpServer())
            .patch(`/question/${question.body.id}`)
            .set('Authorization', `Bearer ${login.body.accessToken}`)
            .send({
                title: "How to edit an existing question? (UPDATE)",
                content: "I'm trying to update my question, but I'm having some trouble. Can someone help me? UPDATE: I found a way!"
            })

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('slug')
    });

    test('[DELETE] /question/:id', async () => {
        const login = await request(app.getHttpServer()).post('/auth/login').send({
            email: "johndoe@email.com",
            password: "1234567"
        })

        const question = await request(app.getHttpServer())
            .post('/question')
            .set('Authorization', `Bearer ${login.body.accessToken}`)
            .send({
                title: "How to delete a question?",
                content: "I'm trying to delete a question, but I'm having some trouble. Can someone help me?"
            })

        const response = await request(app.getHttpServer())
            .delete(`/question/${question.body.id}`)
            .set('Authorization', `Bearer ${login.body.accessToken}`)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('slug')
    })
});