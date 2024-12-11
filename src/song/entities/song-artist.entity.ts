import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Song } from './song.entity';
import { Artist } from '../../artist/entities/artist.entity';

@Entity('song_artists')
export class SongArtist {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Song, (song) => song.songArtists, { onDelete: 'CASCADE' })
  song: Song;

  @ManyToOne(() => Artist, { eager: true, onDelete: 'CASCADE' })
  artist: Artist;

  @Column()
  order: number;
}
