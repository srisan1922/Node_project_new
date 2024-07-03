import express from "express";
import { useExpressServer } from "routing-controllers";
import { ProductsConsumer } from "./controllers/productsCustomer";
import { runConsumer } from "./kafka/consumer";
import { AppDataSource } from "./datasources/datasource";

class App {
  app: express.Express;
  constructor() {
    this.app = express();
    this.setupRoutes();
    this.middleware();
  }

  setupRoutes() {
    useExpressServer(this.app, {
      controllers: [ProductsConsumer],
    });
  }
  middleware() {
    this.app.use(express.json());
  }

  async start() {
    await AppDataSource.initialize();
    console.log("Connected to MongoDB");

    this.app.listen(4000, () => {
      console.log("Server Started on 4000");
    });

    await runConsumer();
    console.log("Kafka consumer started");
  }
}

const app = new App();
app.start();
