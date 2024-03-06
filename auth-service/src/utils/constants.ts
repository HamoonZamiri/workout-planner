const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost:5672";

const constants = {
  RABBITMQ_URL,
} as const;
export default constants;
