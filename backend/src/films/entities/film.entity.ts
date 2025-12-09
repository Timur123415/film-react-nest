import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ScheduleEntity } from './schedule.entity';

@Entity('films')
export class FilmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  rating: number;

  @Column()
  director: string;

  @Column('text', { array: true, default: [] })
  tags: string[];

  @Column()
  image: string;

  @Column()
  cover: string;

  @Column()
  title: string;

  @Column()
  about: string;

  @Column()
  description: string;

  @OneToMany(() => ScheduleEntity, (schedule) => schedule.filmId)
  schedule: ScheduleEntity[];
}
