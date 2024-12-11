import { Injectable } from '@nestjs/common';
import { Song } from './entities/song.entity';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { PaginatedSong, SongArgs } from './song.args';
import { PaginationArgs } from '@/shared/pagination/pagination.args';
import { paginate } from '@/shared/pagination/pagination';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
  ) {}

  async paginate(
    pagination: PaginationArgs,
    query: SongArgs,
  ): Promise<PaginatedSong> {
    const options: FindManyOptions<Song> = {
      where: {},
      order: {
        [query.order]: query.direction,
      },
    };

    if (query.title) {
      Object.assign(options.where, {
        title: Like(`%${query.title}%`),
      });
    }

    if (query.year) {
      Object.assign(options.where, {
        year: query.year,
      });
    }

    if (query.artist) {
      Object.assign(options.where, {
        songArtists: {
          artist: {
            name: Like(`%${query.artist}%`),
          },
        },
      });
    }

    if (query.writer) {
      Object.assign(options.where, {
        songWriters: {
          artist: {
            name: Like(`%${query.writer}%`),
          },
        },
      });
    }

    if (query.album) {
      Object.assign(options.where, {
        album: {
          title: Like(`%${query.album}%`),
        },
      });
    }

    const { data, pageInfo } = await paginate<Song>(
      this.songRepository,
      options,
      pagination,
      20,
      query.order,
      query.direction,
    );

    const edges = [];

    if (data.length) {
      edges.push({
        cursor: pageInfo.startCursor || '',
        node: data[0],
      });

      if (data.length > 1) {
        edges.push({
          cursor: pageInfo.endCursor || '',
          node: data[data.length - 1],
        });
      }
    }

    return {
      edges,
      nodes: data.map((song) => this.transform(song)),
      pageInfo,
    };
  }

  async findOne(id: number): Promise<Song> {
    const song = await this.songRepository.findOneBy({ id });

    return this.transform(song);
  }

  protected transform(song: Song): Song {
    song.artist = [
      song.songArtists.map((v) => v.artist.name).join(' and '),
      song.songFeaturings.map((v) => v.artist.name).join(' and '),
    ].join(' featuring ');

    song.writers = song.songWriters.map((v) => v.artist.name);

    return song;
  }
}
