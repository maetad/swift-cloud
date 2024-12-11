import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1733592195915 implements MigrationInterface {
  name = 'Init1733592195915';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "albums" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_838ebae24d2e12082670ffc95d7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "song_views" ("id" SERIAL NOT NULL, "month" integer NOT NULL, "year" integer NOT NULL, "count" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "songId" integer, CONSTRAINT "PK_c3fd3ba45862259cc4a99028f8f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "song_writers" ("id" SERIAL NOT NULL, "order" integer NOT NULL, "songId" integer, "artistId" integer, CONSTRAINT "PK_b8eacec0d35119ca92ca657b16b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "song_featurings" ("id" SERIAL NOT NULL, "order" integer NOT NULL, "songId" integer, "artistId" integer, CONSTRAINT "PK_6e7661d3d987646d08fb5e2309b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "artists" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_09b823d4607d2675dc4ffa82261" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "song_artists" ("id" SERIAL NOT NULL, "order" integer NOT NULL, "songId" integer, "artistId" integer, CONSTRAINT "PK_218e5e321c8d1e535a899d8c905" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "songs" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "year" integer, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "albumId" integer, CONSTRAINT "PK_e504ce8ad2e291d3a1d8f1ea2f4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "song_views" ADD CONSTRAINT "FK_0f14e7bbf10c615ccd07d0a3fbf" FOREIGN KEY ("songId") REFERENCES "songs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "song_writers" ADD CONSTRAINT "FK_bf63dce8d51c29a02017d30fcf1" FOREIGN KEY ("songId") REFERENCES "songs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "song_writers" ADD CONSTRAINT "FK_1dc869f3da9851d186a4c1261d9" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "song_featurings" ADD CONSTRAINT "FK_f614db89ffc43429d7b2f63c6b1" FOREIGN KEY ("songId") REFERENCES "songs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "song_featurings" ADD CONSTRAINT "FK_92f6236de51e8c6beb34fcc2560" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "song_artists" ADD CONSTRAINT "FK_11f0759ecbc03df953d2243a94a" FOREIGN KEY ("songId") REFERENCES "songs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "song_artists" ADD CONSTRAINT "FK_f3653c324faa9dcef75da825001" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "songs" ADD CONSTRAINT "FK_3807642f5c436d2492f486567fc" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "songs" DROP CONSTRAINT "FK_3807642f5c436d2492f486567fc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "song_artists" DROP CONSTRAINT "FK_f3653c324faa9dcef75da825001"`,
    );
    await queryRunner.query(
      `ALTER TABLE "song_artists" DROP CONSTRAINT "FK_11f0759ecbc03df953d2243a94a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "song_featurings" DROP CONSTRAINT "FK_92f6236de51e8c6beb34fcc2560"`,
    );
    await queryRunner.query(
      `ALTER TABLE "song_featurings" DROP CONSTRAINT "FK_f614db89ffc43429d7b2f63c6b1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "song_writers" DROP CONSTRAINT "FK_1dc869f3da9851d186a4c1261d9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "song_writers" DROP CONSTRAINT "FK_bf63dce8d51c29a02017d30fcf1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "song_views" DROP CONSTRAINT "FK_0f14e7bbf10c615ccd07d0a3fbf"`,
    );
    await queryRunner.query(`DROP TABLE "songs"`);
    await queryRunner.query(`DROP TABLE "song_artists"`);
    await queryRunner.query(`DROP TABLE "artists"`);
    await queryRunner.query(`DROP TABLE "song_featurings"`);
    await queryRunner.query(`DROP TABLE "song_writers"`);
    await queryRunner.query(`DROP TABLE "song_views"`);
    await queryRunner.query(`DROP TABLE "albums"`);
  }
}
