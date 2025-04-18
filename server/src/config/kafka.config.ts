// import { Kafka, logLevel } from "kafkajs";

// export const kafka = new Kafka({
//   brokers: [process.env.KAFKA_BROKER!],
//   ssl: true,
//   sasl: {
//     mechanism: "scram-sha-256",
//     username: process.env.KAFKA_USERNAME!,
//     password: process.env.KAFKA_PASSWORD!,
//   },
//   logLevel: logLevel.ERROR,
// });

// export const producer = kafka.producer();
// export const consumer = kafka.consumer({ groupId: "chats" });

// export const connectKafkaProducer = async () => {
//   await producer.connect();
//   console.log("Kafka Producer connected...");
// };



// import { Kafka, logLevel } from "kafkajs";

// export const kafka = new Kafka({
//   brokers: [process.env.KAFKA_BROKER!], // Use Aiven Kafka broker URL
//   ssl: false,
//   sasl: {
//     mechanism: "scram-sha-256", // Aiven Kafka uses SCRAM-SHA-256
//     username: process.env.KAFKA_USERNAME!, // Aiven Kafka SASL username
//     password: process.env.KAFKA_PASSWORD!, // Aiven Kafka SASL password
//   },
//   logLevel: logLevel.ERROR,
// });

// export const producer = kafka.producer();
// export const consumer = kafka.consumer({ groupId: "chats" });

// export const connectKafkaProducer = async () => {
//   await producer.connect();
//   console.log("Kafka Producer connected...");
// };


import { Kafka, logLevel } from "kafkajs";

export const kafka = new Kafka({
  brokers: [process.env.KAFKA_BROKER!],
  ssl: {
    rejectUnauthorized: false,  // Enable SSL (this could be true or false depending on your Kafka setup)
  },
  sasl: {
    mechanism: "scram-sha-256",
    username: process.env.KAFKA_USERNAME!,
    password: process.env.KAFKA_PASSWORD!,
  },
  logLevel: logLevel.DEBUG, // Change to DEBUG to get more detailed logs
  retry: {
    initialRetryTime: 300,
    retries: 10,  // Increase retries
  },
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: "chats" });

export const connectKafkaProducer = async () => {
  try {
    await producer.connect();
    console.log("Kafka Producer connected...");
  } catch (error) {
    console.error("Error connecting Kafka Producer:", error);
  }
};
