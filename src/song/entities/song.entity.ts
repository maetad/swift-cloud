import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Album } from './album.entity';
import { SongView } from './song-view.entity';
import { SongArtist } from './song-artist.entity';
import { SongWriter } from './song-writer.entity';
import { SongFeaturing } from './song-featuring.entity';

@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  year?: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @ManyToOne(() => Album, (album: Album) => album.songs)
  @JoinColumn()
  album: Album;

  @OneToMany(() => SongView, (songCounter: SongView) => songCounter.song)
  views: SongView[];

  @OneToMany(() => SongArtist, (songArtist: SongArtist) => songArtist.song, {
    eager: true,
    cascade: true,
  })
  songArtists: SongArtist[];

  @OneToMany(() => SongWriter, (songWriter: SongWriter) => songWriter.song, {
    eager: true,
    cascade: true,
  })
  songWriters: SongWriter[];

  @OneToMany(
    () => SongFeaturing,
    (songFeaturing: SongFeaturing) => songFeaturing.song,
    { eager: true, cascade: true },
  )
  songFeaturings: SongFeaturing[];
}
