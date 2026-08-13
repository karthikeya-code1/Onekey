import { app } from "./app";
import { cors } from '@elysiajs/cors'


app.use(cors({
    origin: [
        'https://onekey-psi.vercel.app',
        'http://localhost:3002'
    ],
    credentials: true,
})).listen(3001);
