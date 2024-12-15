import { Module } from '@nestjs/common';
import { SongResolver } from './song.resolver';
import { SongService } from './song.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './entities/song.entity';
import { SongView } from './entities/song-view.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Song, SongView])],
  providers: [SongResolver, SongService],
})
export class SongModule {}
