import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { Song } from './entities/song.entity';
import { SongService } from './song.service';
import { PaginatedSong, SongArgs } from './song.args';
import { PaginationArgs } from '@/shared/pagination/pagination.args';

@Resolver(() => Song)
export class SongResolver {
  constructor(private songService: SongService) {}

  @Query(() => PaginatedSong)
  songs(@Args() pagination: PaginationArgs, @Args() filter: SongArgs) {
    return this.songService.paginate(pagination, filter);
  }

  @Query(() => Song)
  song(@Args('id', { type: () => Int }) id: number) {
    return this.songService.findOne(id);
  }
}
