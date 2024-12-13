import { Injectable } from '@nestjs/common';
import { Song } from './entities/song.entity';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { PaginatedSong, SongFilter } from './song.args';
import { Pagination } from '@/shared/pagination/pagination.args';
import { paginate } from '@/shared/pagination/pagination';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
  ) {}

  async paginate(
    pagination: Pagination,
    filter: SongFilter,
  ): Promise<PaginatedSong> {
    const { order: ordering = 'id', direction = 'ASC' } = filter || {};

    const options: FindManyOptions<Song> = {
      where: {},
      order: {
        [ordering]: direction,
      },
    };

    if (filter?.title?.length) {
      Object.assign(options.where, {
        title: Like(`%${filter.title}%`),
      });
    }

    if (filter?.year) {
      Object.assign(options.where, {
        year: filter.year,
      });
    }

    if (filter?.artist?.length) {
      Object.assign(options.where, {
        songArtists: {
          artist: {
            name: Like(`%${filter.artist}%`),
          },
        },
      });
    }

    if (filter?.writer?.length) {
      Object.assign(options.where, {
        songWriters: {
          artist: {
            name: Like(`%${filter.writer}%`),
          },
        },
      });
    }

    if (filter?.album?.length) {
      Object.assign(options.where, {
        album: {
          title: Like(`%${filter.album}%`),
        },
      });
    }

    const { data, pageInfo } = await paginate<Song>(
      this.songRepository,
      options,
      pagination,
      20,
      ordering,
      direction,
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
