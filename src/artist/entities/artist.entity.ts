import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SongArtist } from '../../song/entities/song-artist.entity';
import { SongWriter } from '../../song/entities/song-writer.entity';
import { SongFeaturing } from '../../song/entities/song-featuring.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('artists')
export class Artist {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @OneToMany(() => SongArtist, (songArtist: SongArtist) => songArtist.artist, {
    cascade: true,
  })
  songArtists: SongArtist[];

  @OneToMany(() => SongWriter, (songWriter: SongWriter) => songWriter.artist, {
    cascade: true,
  })
  songWriters: SongWriter[];

  @OneToMany(
    () => SongFeaturing,
    (songFeaturing: SongFeaturing) => songFeaturing.artist,
    { cascade: true },
  )
  songFeaturings: SongFeaturing[];
}
