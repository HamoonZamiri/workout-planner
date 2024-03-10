import amqp from "amqplib";
import constants from "../utils/constants";
import MQEventConsumer from "./MQEventConsumer";

// serves as list of topics/exchanges that represent one event type
// MQEventConsumer classes are instantiated based on this list
export const exchangeList = ["user_created"];

export async function initializeMQConsumers(): Promise<MQEventConsumer[]> {
  const connection = await connectToMQ();
  if (connection === undefined) {
    throw new Error("Failed to connect to RabbitMQ");
  }

  const eventConsumers = await Promise.all(
    exchangeList.map(async (exchange) => {
      const channel = await connection.createChannel();
      return new MQEventConsumer(connection, channel, exchange);
    }),
  );
  return eventConsumers;
}

export async function connectToMQ() {
  try {
    const connection = await amqp.connect(constants.RABBITMQ_URL);

    return connection;
  } catch (err) {
    console.error(err);
  }
}
