/**
 * Port for the hello service.
 * Defines the contract for retrieving the hello message.
 */
export interface HelloPort {
  getHelloMessage(): { message: string };
}
