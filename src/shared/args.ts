import { Type } from '@nestjs/common';
import { ArgsType, Field } from '@nestjs/graphql';

type IArgsType<T> = {
  filter: T;
};

export const args = <T>(classRef: Type<T>): Type<IArgsType<T>> => {
  @ArgsType()
  abstract class Args {
    @Field(() => classRef, { nullable: true })
    filter: T;
  }

  return Args as Type<IArgsType<T>>;
};
