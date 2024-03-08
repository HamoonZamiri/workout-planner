import amqp from "amqplib";
import constants from "../utils/constants";
export async function connectToMQ() {
  try {
    const connection = await amqp.connect(constants.RABBITMQ_URL);

    return connection;
  } catch (err) {
    console.error(err);
  }
}
