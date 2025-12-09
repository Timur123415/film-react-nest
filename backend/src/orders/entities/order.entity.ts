import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => OrderItemEntity, (item) => item.order)
  tickets: OrderItemEntity[];

  @Column()
  email: string;

  @Column()
  phone: string;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity()
export class OrderItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  film: string;

  @Column()
  session: string;

  @Column()
  daytime: string;

  @Column()
  row: number;

  @Column()
  seat: number;

  @Column()
  price: number;

  @ManyToOne(() => OrderEntity, (order) => order.tickets)
  order: OrderEntity;
}
