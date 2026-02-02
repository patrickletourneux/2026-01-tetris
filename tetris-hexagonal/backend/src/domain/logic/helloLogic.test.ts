import { getHelloMessage } from './helloLogic';

describe('helloLogic', () => {
  describe('getHelloMessage', () => {
    it('should return a hello world message', () => {
      const result = getHelloMessage();
      expect(result).toEqual({ message: 'Hello World' });
    });
  });
});
