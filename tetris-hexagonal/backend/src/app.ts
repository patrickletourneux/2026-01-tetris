import express from 'express';
import cors from 'cors';
import { createHelloRouter } from './adapters/api/helloRouter';
import { helloService } from './adapters/api/helloService';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', createHelloRouter(helloService));

export default app;
