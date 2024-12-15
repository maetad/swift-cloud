import { Test, TestingModule } from '@nestjs/testing';
import { SongResolver } from './song.resolver';
import { SongService } from './song.service';
import { PaginationArgs } from '@/shared/pagination/pagination.args';
import { PaginatedSong, ListSongArgs, SongArgs } from './song.args';
import { Song } from './entities/song.entity';
import { faker } from '@faker-js/faker/.';
import { SongArtist } from './entities/song-artist.entity';
import { Artist } from '@/artist/entities/artist.entity';
import { SongView } from './entities/song-view.entity';

const mockSong = <Song>{
  id: 1,
  title: faker.music.songName(),
  year: faker.date.past().getFullYear(),
  songArtists: [
    <SongArtist>{
      artist: <Artist>{
        name: faker.music.artist(),
      },
      order: 1,
    },
  ],
  songFeaturings: [
    <SongArtist>{
      artist: <Artist>{
        name: faker.music.artist(),
      },
      order: 1,
    },
  ],
  songWriters: faker.helpers.multiple(
    (_, i) =>
      <SongArtist>{
        artist: <Artist>{
          name: faker.music.artist(),
        },
        order: i + 1,
      },
    { count: 2 },
  ),
};

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
            loadViews: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<SongResolver>(SongResolver);
    service = module.get<SongService>(SongService);
  });

  describe('songs', () => {
    it('should query songs', async () => {
      const pagination = <PaginationArgs>{
        pagination: { first: 10 },
      };
      const query = <ListSongArgs>{ filter: { year: 2024 } };
      const songs = await resolver.songs(pagination, query);

      expect(service.paginate).toHaveBeenCalledWith(
        pagination.pagination,
        query.filter,
      );
      expect(songs.nodes.length).toEqual(2);
    });
  });

  describe('song', () => {
    it('should get song by id', async () => {
      const song = await resolver.song(1, <SongArgs>{ filter: {} });
      expect(service.findOne).toHaveBeenCalledWith(1, {});
      expect(song.id).toEqual(mockSong.id);
    });
  });

  describe('artist', () => {
    it('should return full artist name', () => {
      const artist = resolver.artist(mockSong);
      expect(artist).toBe(
        `${mockSong.songArtists[0].artist.name} featuring ${mockSong.songFeaturings[0].artist.name}`,
      );
    });
  });

  describe('writers', () => {
    it('should return list of song writers', () => {
      const writters = resolver.writers(mockSong);
      expect(writters).toEqual(mockSong.songWriters.map((w) => w.artist.name));
    });
  });

  describe('totalViews', () => {
    it('should summarize view correctly', async () => {
      mockSong.views = [<SongView>{ count: 1 }, <SongView>{ count: 2 }];
      const totalViews = await resolver.totalViews(mockSong);

      expect(totalViews).toBe(3);
    });

    it('should call loadView', async () => {
      mockSong.views = [];
      await resolver.totalViews(mockSong);
      expect(service.loadViews).toHaveBeenCalled();
    });
  });

  describe('views', () => {
    it('should summarize view correctly', async () => {
      mockSong.views = [<SongView>{ count: 1 }, <SongView>{ count: 2 }];
      const views = await resolver.views(mockSong);

      expect(views).toBe(mockSong.views);
    });

    it('should call loadView', async () => {
      mockSong.views = [];
      await resolver.views(mockSong);

      expect(service.loadViews).toHaveBeenCalled();
    });
  });
});
