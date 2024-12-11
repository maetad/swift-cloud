import { Test, TestingModule } from '@nestjs/testing';
import { SongResolver } from './song.resolver';
import { SongService } from './song.service';
import { PaginationArgs } from '@/shared/pagination/pagination.args';
import { PaginatedSong, SongArgs } from './song.args';
import { Song } from './entities/song.entity';

const mockSong = <Song>{ id: 1 };

describe('SongResolver', () => {
  let resolver: SongResolver;
  let service: SongService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongResolver,
        {
          provide: SongService,
          useValue: {
            paginate: jest.fn(
              (): PaginatedSong =>
                <PaginatedSong>{
                  edges: [
                    {
                      cursor: 'cursor-1',
                      node: mockSong,
                    },
                    {
                      cursor: 'cursor-2',
                      node: mockSong,
                    },
                  ],
                  nodes: [mockSong, mockSong],
                  pageInfo: {
                    startCursor: 'cursor-1',
                    endCursor: 'cursor-2',
                    totalCount: 2,
                  },
                },
            ),
            findOne: jest.fn((): Song => mockSong),
          },
        },
      ],
    }).compile();

    resolver = module.get<SongResolver>(SongResolver);
    service = module.get<SongService>(SongService);
  });

  it('should query songs', async () => {
    const pagination = <PaginationArgs>{
      first: 10,
    };
    const query = <SongArgs>{ year: 2024 };
    const songs = await resolver.songs(pagination, query);

    expect(service.paginate).toHaveBeenCalledWith(pagination, query);
    expect(songs.nodes.length).toEqual(2);
  });

  it('should get song by id', async () => {
    const song = await resolver.song(1);
    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(song.id).toEqual(mockSong.id);
  });
});
