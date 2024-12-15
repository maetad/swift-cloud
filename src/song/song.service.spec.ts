import { Test, TestingModule } from '@nestjs/testing';
import { SongService } from './song.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Song } from './entities/song.entity';
import { Like, Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { SongArtist } from './entities/song-artist.entity';
import { Artist } from '@/artist/entities/artist.entity';
import { Pagination } from '@/shared/pagination/pagination.args';
import { ListSongFilter } from './song.args';
import { encode } from '@/shared/pagination/util';
import { SongView } from './entities/song-view.entity';

describe('SongService', () => {
  let service: SongService;
  let songRepository: Repository<Song>;

  const take = 10;
  const songs = faker.helpers.multiple(
    (_, i) =>
      <Song>{
        id: i + 1,
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
      },
    { count: take },
  );

  const songViews = songs.reduce<SongView[]>((views, song) => {
    views.push(
      <SongView>{
        id: song.id * 10 + 7,
        songId: song.id,
        month: 7,
        year: 2024,
        count: faker.number.int({ min: 1, max: 10 }),
      },
      <SongView>{
        id: song.id * 10 + 8,
        songId: song.id,
        month: 8,
        year: 2024,
        count: faker.number.int({ min: 1, max: 10 }),
      },
    );

    return views;
  }, []);

  const getMany = jest.fn().mockResolvedValue(songViews);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongService,
        {
          provide: getRepositoryToken(Song),
          useValue: {
            find: jest.fn(),
            count: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(SongView),
          useValue: {
            createQueryBuilder: jest.fn(() => ({
              where: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              addOrderBy: jest.fn().mockReturnThis(),
              getMany,
            })),
          },
        },
      ],
    }).compile();

    service = module.get<SongService>(SongService);
    songRepository = module.get<Repository<Song>>(getRepositoryToken(Song));
  });

  describe('paginate', () => {
    beforeEach(() => {
      jest.spyOn(songRepository, 'find').mockResolvedValue(songs);
      jest.spyOn(songRepository, 'count').mockResolvedValue(50);
    });

    it('should load views', async () => {
      const result = await service.paginate(
        <Pagination>{ first: take },
        <ListSongFilter>{
          views: {
            from: { month: 1, year: 2024 },
            to: { month: 2, year: 2024 },
          },
        },
      );

      expect(result.nodes.length).toBe(songs.length);
      expect(result.pageInfo.totalCount).toBe(50);
      expect(songRepository.find).toHaveBeenCalledWith({
        order: {
          id: 'ASC',
        },
        take,
        where: {},
      });
      expect(getMany).toHaveBeenCalled();

      // edges
      expect(result.edges[0]).toEqual({
        cursor: encode('id', songs[0].id, 'ASC'),
        node: songs[0],
      });
      expect(result.edges[1]).toEqual({
        cursor: encode('id', songs[songs.length - 1].id, 'ASC'),
        node: songs[songs.length - 1],
      });
    });

    it('should handle query correctly', async () => {
      await service.paginate(
        <Pagination>{
          first: take,
        },
        <ListSongFilter>{
          title: 'title',
          artist: 'artist',
          writer: 'writer',
          album: 'album',
          year: 2024,
        },
      );

      expect(songRepository.find).toHaveBeenCalledWith({
        order: {
          id: 'ASC',
        },
        take,
        where: {
          title: Like('%title%'),
          year: 2024,
          songArtists: {
            artist: {
              name: Like('%artist%'),
            },
          },
          songWriters: {
            artist: {
              name: Like('%writer%'),
            },
          },
          album: {
            title: Like('%album%'),
          },
        },
      });
    });
  });

  describe('findOne', () => {
    const song = songs[0];
    beforeEach(() => {
      jest.spyOn(songRepository, 'findOneBy').mockResolvedValue(song);
    });

    it('should call fineOneBy', async () => {
      await service.findOne(2);

      expect(songRepository.findOneBy).toHaveBeenCalled();
    });

    it('should load views', async () => {
      await service.findOne(2, { views: { from: { month: 1, year: 2024 } } });

      expect(getMany).toHaveBeenCalled();
    });
  });
});
