import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Song } from './song.entity';

@ObjectType()
@Entity('song_views')
export class SongView {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  songId: number;

  @Field()
  @Column()
  month: number;

  @Field()
  @Column()
  year: number;

  @Field()
  @Column({ default: 0 })
  count: number;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @Field(() => Song)
  @ManyToOne(() => Song, (song: Song) => song.views)
  @JoinColumn()
  song: Song;
}
