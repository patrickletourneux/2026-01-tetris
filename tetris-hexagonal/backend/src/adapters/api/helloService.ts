import { HelloPort } from '../../domain/ports/HelloPort';
import { getHelloMessage } from '../../domain/logic/helloLogic';

/**
 * Adapter implementing HelloPort.
 * Delegates to domain logic functions.
 */
export const helloService: HelloPort = {
  getHelloMessage,
};
