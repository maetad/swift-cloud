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

@Entity('song_views')
export class SongView {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  month: number;

  @Column()
  year: number;

  @Column({ default: 0 })
  count: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @ManyToOne(() => Song, (song: Song) => song.views)
  @JoinColumn()
  song: Song;
}
