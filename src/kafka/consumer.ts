import { Kafka } from "kafkajs";
import { AppDataSource } from "../datasources/datasource";
import { Product } from "../models/product";
import { log } from "console";

const kafka = new Kafka({
  clientId: "my-consumer",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "product-group" });

const saveProduct = async (productData: any) => {
  console.log("****productData", productData);

  try {
    const product = new Product();
    product.id = productData.id;
    product.name = productData.name;
    product.price = productData.price;
    product.category = productData.category;
    product.dimensions = productData.dimensions;
    product.supplier = productData.supplier;
    const savedProduct = await AppDataSource.manager.save(Product, product);
    console.log("Product saved successfully:", savedProduct);
  } catch (error) {
    console.error("Error saving product:", error);
  }
};

const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "axios_integration", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("#####", message.value);

      if (message.value) {
        const messageValue = message.value.toString();
        console.log("##### Raw Message:", messageValue);

        const productDetail = JSON.parse(messageValue);
        console.log("***** Parsed Products:", productDetail);

        await saveProduct(productDetail);
      } else {
        console.warn("Received message with null value");
      }
    },
  });
};

runConsumer().catch(console.error);

export { runConsumer };
