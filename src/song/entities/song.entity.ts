import { Field, ID, ObjectType } from '@nestjs/graphql';
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

@ObjectType()
@Entity('songs')
export class Song {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field()
  artist: string;

  @Field(() => [String])
  writers: string[];

  @Field({ nullable: true })
  @Column({ nullable: true })
  year?: number;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @Field(() => Album)
  @ManyToOne(() => Album, (album: Album) => album.songs, { eager: true })
  @JoinColumn()
  album: Album;

  @Field(() => [SongView])
  @OneToMany(() => SongView, (songView: SongView) => songView.song, {
    eager: true,
  })
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
