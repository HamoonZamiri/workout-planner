const RABBITMQ_URL = process.env.RABBITMQ_URL || "ampq://localhost:5672";

const constants = {
  RABBITMQ_URL,
} as const;
export default constants;
