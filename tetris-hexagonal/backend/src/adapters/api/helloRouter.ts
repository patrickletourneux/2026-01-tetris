import { Router } from 'express';
import { HelloPort } from '../../domain/ports/HelloPort';

/**
 * Express router adapter for the hello endpoint.
 * Receives a HelloPort implementation via dependency injection.
 */
export function createHelloRouter(helloService: HelloPort): Router {
  const router = Router();

  router.get('/hello', (_req, res) => {
    const result = helloService.getHelloMessage();
    res.json({ data: result });
  });

  return router;
}
