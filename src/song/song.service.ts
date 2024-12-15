import { Injectable } from '@nestjs/common';
import { Song } from './entities/song.entity';
import { FindManyOptions, Like, Repository } from 'typeorm';
import {
  PaginatedSong,
  ListSongFilter,
  ViewFilter,
  SongFilter,
} from './song.args';
import { Pagination } from '@/shared/pagination/pagination.args';
import { paginate } from '@/shared/pagination/pagination';
import { InjectRepository } from '@nestjs/typeorm';
import { SongView } from './entities/song-view.entity';

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    @InjectRepository(SongView)
    private songViewRepository: Repository<SongView>,
  ) {}

  async paginate(
    pagination: Pagination,
    filter: ListSongFilter,
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

    if (filter?.views) {
      await this.loadViews(data, filter?.views);
    }

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
      nodes: data,
      pageInfo,
    };
  }

  async findOne(id: number, filter?: SongFilter): Promise<Song> {
    const song = await this.songRepository.findOneBy({ id });

    if (filter?.views) {
      await this.loadViews([song], filter?.views);
    }

    return song;
  }

  async loadViews(songs: Song[], filter: ViewFilter = {}): Promise<void> {
    const views = await this.songViewRepository
      .createQueryBuilder(SongView.name)
      .where(
        'songId in ?',
        songs.map(({ id }) => id),
      )
      .where(
        '(year, month) BETWEEN (:fromYear, :fromMonth) AND (:toYear, :toMonth)',
        {
          fromYear: filter?.from?.year || 0,
          fromMonth: filter?.from?.month || 1,
          toYear: filter?.to?.year || new Date().getUTCFullYear(),
          toMonth: filter?.to?.month || new Date().getUTCFullYear(),
        },
      )
      .orderBy('year', 'DESC')
      .addOrderBy('month', 'DESC')
      .getMany();

    if (!views?.length) {
      return;
    }

    for (const song of songs) {
      song.views = views.filter(({ songId }) => songId === song.id);
    }
  }
}
