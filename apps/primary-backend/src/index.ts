import { app } from "./app";
import { cors } from '@elysiajs/cors'


app.use(cors({
    origin: ['http://localhost:3002', 'http://localhost:3001'],
    credentials: true,
})).listen(3001);