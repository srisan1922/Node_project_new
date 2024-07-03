import { Entity, ObjectIdColumn, Column, ObjectId } from "typeorm";

@Entity("products")
export class Product {
  @ObjectIdColumn()
  id!: string;

  @Column()
  name?: string;

  @Column()
  price?: number;

  @Column()
  category?: {
    id: number;
    name: string;
  };

  @Column()
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };

  @Column()
  supplier?: {
    id: number;
    name: string;
    contact: {
      email: string;
      phone: string;
    };
  };
}
