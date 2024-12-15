import {
  Args,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Song } from './entities/song.entity';
import { SongService } from './song.service';
import { PaginatedSong, ListSongArgs, SongArgs } from './song.args';
import { PaginationArgs } from '@/shared/pagination/pagination.args';
import { SongView } from './entities/song-view.entity';

@Resolver(() => Song)
export class SongResolver {
  constructor(private songService: SongService) {}

  @Query(() => PaginatedSong)
  songs(
    @Args() { pagination }: PaginationArgs,
    @Args() { filter }: ListSongArgs,
  ) {
    return this.songService.paginate(pagination, filter);
  }

  @Query(() => Song)
  song(
    @Args('id', { type: () => Int }) id: number,
    @Args() { filter }: SongArgs,
  ) {
    return this.songService.findOne(id, filter);
  }

  @ResolveField('artist')
  artist(@Parent() song: Song): string {
    return [
      song.songArtists.map((v) => v.artist.name).join(' and '),
      song.songFeaturings.map((v) => v.artist.name).join(' and '),
    ].join(' featuring ');
  }

  @ResolveField('writers', () => [String])
  writers(@Parent() song: Song): string[] {
    return song.songWriters.map((v) => v.artist.name);
  }

  @ResolveField('totalViews', () => Number)
  async totalViews(@Parent() song: Song): Promise<number> {
    if (!song.views?.length) {
      await this.songService.loadViews([song]);
    }

    return song.views.reduce((acc, view) => acc + view.count, 0);
  }

  @ResolveField('views', () => [SongView])
  async views(@Parent() song: Song): Promise<SongView[]> {
    if (!song.views?.length) {
      await this.songService.loadViews([song]);
    }

    return song.views;
  }
}
