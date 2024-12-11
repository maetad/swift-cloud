import { Test, TestingModule } from '@nestjs/testing';
import { SongService } from './song.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Song } from './entities/song.entity';
import { Like, Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { SongArtist } from './entities/song-artist.entity';
import { Artist } from '@/artist/entities/artist.entity';
import { PaginationArgs } from '@/shared/pagination/pagination.args';
import { SongArgs } from './song.args';
import { encode } from '@/shared/pagination/util';

describe('SongService', () => {
  let service: SongService;
  let songRepository: Repository<Song>;

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
      ],
    }).compile();

    service = module.get<SongService>(SongService);
    songRepository = module.get<Repository<Song>>(getRepositoryToken(Song));
  });

  describe('paginate', () => {
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

    beforeEach(() => {
      jest.spyOn(songRepository, 'find').mockResolvedValue(songs);
      jest.spyOn(songRepository, 'count').mockResolvedValue(50);
    });

    it('should transform data correctly', async () => {
      const result = await service.paginate(
        <PaginationArgs>{ first: take },
        <SongArgs>{},
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

      result.nodes.forEach((node, index) => {
        const song = songs[index];
        expect(node.artist).toBe(
          `${song.songArtists[0].artist.name} featuring ${song.songFeaturings[0].artist.name}`,
        );
        expect(node.writers).toEqual(
          song.songWriters.map((w) => w.artist.name),
        );
      });

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
        <PaginationArgs>{
          first: take,
        },
        <SongArgs>{
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
    it('should transform data correctly', async () => {
      const song = <Song>{
        id: 2,
        title: faker.music.songName(),
        year: faker.date.past().getFullYear(),
        songArtists: faker.helpers.multiple(
          (_, i) =>
            <SongArtist>{
              artist: <Artist>{
                name: faker.music.artist(),
              },
              order: i + 1,
            },
          { count: 2 },
        ),
        songFeaturings: faker.helpers.multiple(
          (_, i) =>
            <SongArtist>{
              artist: <Artist>{
                name: faker.music.artist(),
              },
              order: i + 1,
            },
          { count: 2 },
        ),
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

      jest.spyOn(songRepository, 'findOneBy').mockResolvedValue(song);

      const result = await service.findOne(2);

      expect(result.artist).toBe(
        `${song.songArtists[0].artist.name} and ${song.songArtists[1].artist.name} featuring ${song.songFeaturings[0].artist.name} and ${song.songFeaturings[1].artist.name}`,
      );
      expect(result.writers).toEqual(
        song.songWriters.map((w) => w.artist.name),
      );
    });
  });
});
