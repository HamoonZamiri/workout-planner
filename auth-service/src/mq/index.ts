import amqp from "amqplib";
import constants from "../utils/constants";

export class MQService {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor(connection: amqp.Connection, channel: amqp.Channel) {
    this.connection = connection;
    this.channel = channel;
  }

  async initializeExchanges(exchangeList: string[]) {
    for (const ex of exchangeList) {
      await this.channel.assertExchange(ex, "fanout", { durable: false });
    }
  }

  async sendMessage(message: string, exchange: string) {
    await this.channel.publish(exchange, "", Buffer.from(message));
  }

  async shutDown() {
    await this.channel.close();
    await this.connection.close();
  }
}

export async function connectToRabbit() {
  try {
    const connection = await amqp.connect(constants.RABBITMQ_URL);
    const channel = await connection.createChannel();
    return new MQService(connection, channel);
  } catch (e) {
    console.error(e);
  }
}
