import EventConsumer, { getEventHandlerByExchange } from "./EventConsumer";
import amqp from "amqplib";

class MQEventConsumer implements EventConsumer {
  private readonly connection: amqp.Connection;
  private readonly channel: amqp.Channel;
  private readonly exchange: string;
  private readonly eventHandler: (
    message: amqp.ConsumeMessage,
  ) => Promise<void>;

  constructor(
    connection: amqp.Connection,
    channel: amqp.Channel,
    exchange: string,
  ) {
    this.connection = connection;
    this.channel = channel;
    this.exchange = exchange;
    this.eventHandler = getEventHandlerByExchange(exchange);
  }

  async consume(): Promise<void> {
    await this.channel.assertExchange(this.exchange, "fanout", {
      durable: false,
    });
    const assertQueue = await this.channel.assertQueue("", { exclusive: true });
    await this.channel.bindQueue(assertQueue.queue, this.exchange, "");

    this.channel.consume(assertQueue.queue, (message) => {
      if (message === null) {
        console.log(`Null message was received for exchange: ${this.exchange}`);
        return;
      }
      this.eventHandler(message);
    });
  }

  async close(): Promise<void> {
    await this.channel.close();
    await this.connection.close();
  }
}

export default MQEventConsumer;
