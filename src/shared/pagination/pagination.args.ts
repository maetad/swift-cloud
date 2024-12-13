import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class Pagination {
  @Field(() => Int, { nullable: true })
  first: number;

  @Field(() => Int, { nullable: true })
  last: number;

  @Field(() => String, { nullable: true })
  before: string;

  @Field(() => String, { nullable: true })
  after: string;
}

@ArgsType()
export class PaginationArgs {
  @Field(() => Pagination, { nullable: true })
  pagination: Pagination;
}
