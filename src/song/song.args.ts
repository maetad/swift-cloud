import { ArgsType, Field, InputType, ObjectType } from '@nestjs/graphql';
import { paginated } from '@/shared/pagination/pagination';
import { Song } from './entities/song.entity';
import { FindOptionsOrderValue } from 'typeorm';

@InputType()
export class SongFilter {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  artist?: string;

  @Field({ nullable: true })
  writer?: string;

  @Field({ nullable: true })
  album?: string;

  @Field({ nullable: true })
  year?: number;

  @Field(() => String, { nullable: true })
  order?: keyof Pick<Song, 'id' | 'year'> = 'id';

  @Field(() => String, { nullable: true })
  direction?: FindOptionsOrderValue = 'ASC';
}

@ArgsType()
export class SongArgs {
  @Field(() => SongFilter, { nullable: true })
  filter: SongFilter;
}

@ObjectType()
export class PaginatedSong extends paginated(Song) {}
