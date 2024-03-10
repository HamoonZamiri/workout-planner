import { handleUserCreated } from "../routine/services/routine.service";

interface EventConsumer {
  consume(): Promise<void>;
}

// helper function which returns the event handler based on the exchange
export function getEventHandlerByExchange(exchange: string) {
  if (exchange === "user_created") {
    return handleUserCreated;
  }
  throw new Error("Exchange not found");
}
export default EventConsumer;
