import { LessThan, Like, MoreThan, Repository } from 'typeorm';
import { paginate } from './pagination';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Pagination } from './pagination.args';
import { faker } from '@faker-js/faker/.';
import { encode } from './util';

class MockEntity {
  id: number;
  name: string;
}

describe('paginate', () => {
  let repository: Repository<MockEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(MockEntity),
          useValue: {
            find: jest.fn(),
            count: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<Repository<MockEntity>>(
      getRepositoryToken(MockEntity),
    );
  });

  it('should found 25 records', async () => {
    const pagination = <Pagination>{};

    jest.spyOn(repository, 'find').mockResolvedValue(
      faker.helpers.multiple((_, i) => <MockEntity>{ id: i + 1 }, {
        count: 25,
      }),
    );

    jest.spyOn(repository, 'count').mockResolvedValue(20);

    const result = await paginate(repository, {}, pagination, 25, 'id', 'DESC');
    expect(result.data.length).toBe(25);
    expect(repository.find).toHaveBeenCalledWith({
      order: { id: 'DESC' },
      take: 25,
      where: {},
    });
  });

  it('should found first 10 records after cursor', async () => {
    const pagination = <Pagination>{
      first: 10,
      after: encode('id', 1, 'ASC'),
    };

    jest.spyOn(repository, 'find').mockResolvedValue(
      faker.helpers.multiple((_, i) => <MockEntity>{ id: i + 1 }, {
        count: 10,
      }),
    );

    jest.spyOn(repository, 'count').mockResolvedValue(20);

    const result = await paginate(
      repository,
      { where: { name: Like('test') } },
      pagination,
    );
    expect(result.data.length).toBe(10);
    expect(repository.find).toHaveBeenCalledWith({
      order: { id: 'ASC' },
      take: 10,
      where: {
        id: MoreThan('1'),
        name: Like('test'),
      },
    });
  });

  it('should found last 10 records before cursor', async () => {
    const pagination = <Pagination>{
      last: 10,
      before: encode('id', 11, 'ASC'),
    };

    jest.spyOn(repository, 'find').mockResolvedValue(
      faker.helpers.multiple((_, i) => <MockEntity>{ id: i + 1 }, {
        count: 10,
      }),
    );

    jest.spyOn(repository, 'count').mockResolvedValue(20);

    const result = await paginate(
      repository,
      { where: { name: Like('test') } },
      pagination,
    );
    expect(result.data.length).toBe(10);
    expect(repository.find).toHaveBeenCalledWith({
      order: { id: 'ASC' },
      take: 10,
      where: {
        id: LessThan('11'),
        name: Like('test'),
      },
    });
  });
});
