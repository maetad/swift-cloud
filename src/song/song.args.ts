import { ArgsType, Field, InputType, ObjectType } from '@nestjs/graphql';
import { paginated } from '@/shared/pagination/pagination';
import { Song } from './entities/song.entity';
import { FindOptionsOrderValue } from 'typeorm';
import { args } from '@/shared/args';

@InputType()
export class MonthYear {
  @Field()
  month: number;

  @Field()
  year: number;
}

@InputType()
export class ViewFilter {
  @Field(() => MonthYear, { nullable: true })
  from?: MonthYear;

  @Field(() => MonthYear, { nullable: true })
  to?: MonthYear;
}

@InputType()
export class ListSongFilter {
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

  @Field(() => ViewFilter, { nullable: true })
  views?: ViewFilter;

  @Field(() => String, { nullable: true })
  order?: keyof Pick<Song, 'id' | 'year'> = 'id';

  @Field(() => String, { nullable: true })
  direction?: FindOptionsOrderValue = 'ASC';
}

@InputType()
export class SongFilter {
  @Field(() => ViewFilter, { nullable: true })
  views?: ViewFilter;
}

@ArgsType()
export class ListSongArgs extends args(ListSongFilter) {}

@ArgsType()
export class SongArgs extends args(SongFilter) {}

@ObjectType()
export class PaginatedSong extends paginated(Song) {}
