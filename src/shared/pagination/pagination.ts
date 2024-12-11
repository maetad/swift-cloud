import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';
import {
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsOrderValue,
  LessThan,
  MoreThan,
  Repository,
} from 'typeorm';
import { PageInfo } from './page-info';
import { PaginationArgs } from './pagination.args';
import { decode, encode } from './util';

type IEdgeType<T> = {
  cursor: string;
  node: T;
};

type IPaginatedType<T> = {
  edges: IEdgeType<T>[];
  nodes: T[];
  pageInfo: PageInfo;
};

export const paginated = <T>(classRef: Type<T>): Type<IPaginatedType<T>> => {
  @ObjectType(`${classRef.name}Edge`)
  abstract class EdgeType {
    @Field(() => String)
    cursor: string;

    @Field(() => classRef)
    node: T;
  }

  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements IPaginatedType<T> {
    @Field(() => [EdgeType], { nullable: true })
    edges: EdgeType[];

    @Field(() => [classRef], { nullable: true })
    nodes: T[];

    @Field(() => PageInfo, { nullable: true })
    pageInfo: PageInfo;
  }

  return PaginatedType as Type<IPaginatedType<T>>;
};

export const paginate = async <T>(
  repository: Repository<T>,
  options: FindManyOptions<T>,
  pagination: PaginationArgs,
  defaultLimit: number = 25,
  cursorColumn: string = 'id',
  direction: FindOptionsOrderValue = 'ASC',
): Promise<{ data: T[]; pageInfo: PageInfo }> => {
  options.take = defaultLimit;
  if (!options.where) {
    options.where = {};
  }

  const count = await repository.count(options);

  if (pagination.first) {
    if (pagination.after) {
      const order = decode(pagination.after);
      cursorColumn = order.key;
      direction = order.direction;

      options.order = <FindOptionsOrder<T>>{
        [order.key]: order.direction,
      };

      Object.assign(options.where, {
        [order.key]:
          direction === 'DESC' ? LessThan(order.value) : MoreThan(order.value),
      });
    }

    options.take = pagination.first ?? defaultLimit;
  } else if (pagination.last && pagination.before) {
    const order = decode(pagination.before);
    cursorColumn = order.key;
    direction = order.direction;

    options.order = <FindOptionsOrder<T>>{
      [order.key]: order.direction,
    };

    Object.assign(options.where, {
      [order.key]:
        direction === 'DESC' ? MoreThan(order.value) : LessThan(order.value),
    });
    options.take = pagination.last ?? defaultLimit;
  }

  options.order = <FindOptionsOrder<T>>{
    [cursorColumn]: direction,
  };

  const data = await repository.find(options);

  const pageInfo = new PageInfo();
  pageInfo.totalCount = count;

  if (pageInfo.totalCount > 0) {
    pageInfo.startCursor = encode(
      cursorColumn,
      data[0][cursorColumn],
      direction,
    );
    pageInfo.endCursor = encode(
      cursorColumn,
      data[data.length - 1][cursorColumn],
      direction,
    );
  }

  return { data, pageInfo };
};
