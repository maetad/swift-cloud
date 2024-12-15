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
import { PaginatedSong, SongArgs } from './song.args';
import { PaginationArgs } from '@/shared/pagination/pagination.args';

@Resolver(() => Song)
export class SongResolver {
  constructor(private songService: SongService) {}

  @Query(() => PaginatedSong)
  songs(@Args() { pagination }: PaginationArgs, @Args() { filter }: SongArgs) {
    return this.songService.paginate(pagination, filter);
  }

  @Query(() => Song)
  song(@Args('id', { type: () => Int }) id: number) {
    return this.songService.findOne(id);
  }

  @ResolveField('artist')
  artist(@Parent() song: Song): string {
    return [
      song.songArtists.map((v) => v.artist.name).join(' and '),
      song.songFeaturings.map((v) => v.artist.name).join(' and '),
    ].join(' featuring ');
  }

  @ResolveField('writers')
  writers(@Parent() song: Song): string[] {
    return song.songWriters.map((v) => v.artist.name);
  }

  @ResolveField('totalViews')
  totalViews(@Parent() song: Song): number {
    return song.views.reduce((acc, view) => acc + view.count, 0);
  }
}
