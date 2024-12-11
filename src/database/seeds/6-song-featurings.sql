INSERT INTO "song_featurings" ("order", "songId", "artistId")
SELECT ROW_NUMBER() OVER (ORDER BY "id"), (SELECT "id" FROM "songs" WHERE "title" = 'Babe' LIMIT 1) "songId", "id" "artistId" FROM "artists" WHERE "name" IN ('Taylor Swift') UNION
SELECT ROW_NUMBER() OVER (ORDER BY "id"), (SELECT "id" FROM "songs" WHERE "title" = 'Bad Blood (remixed single version)' LIMIT 1) "songId", "id" "artistId" FROM "artists" WHERE "name" IN ('Kendrick Lamar') UNION
SELECT ROW_NUMBER() OVER (ORDER BY "id"), (SELECT "id" FROM "songs" WHERE "title" = 'Both of Us' LIMIT 1) "songId", "id" "artistId" FROM "artists" WHERE "name" IN ('Taylor Swift') UNION
SELECT ROW_NUMBER() OVER (ORDER BY "id"), (SELECT "id" FROM "songs" WHERE "title" = 'Breathe' LIMIT 1) "songId", "id" "artistId" FROM "artists" WHERE "name" IN ('Colbie Caillat') UNION
SELECT ROW_NUMBER() OVER (ORDER BY "id"), (SELECT "id" FROM "songs" WHERE "title" = 'End Game' LIMIT 1) "songId", "id" "artistId" FROM "artists" WHERE "name" IN ('Ed Sheeran', 'Future') UNION
SELECT ROW_NUMBER() OVER (ORDER BY "id"), (SELECT "id" FROM "songs" WHERE "title" = 'Everything Has Changed' LIMIT 1) "songId", "id" "artistId" FROM "artists" WHERE "name" IN ('Ed Sheeran') UNION
SELECT ROW_NUMBER() OVER (ORDER BY "id"), (SELECT "id" FROM "songs" WHERE "title" = 'Exile' LIMIT 1) "songId", "id" "artistId" FROM "artists" WHERE "name" IN ('Bon Iver') UNION
SELECT ROW_NUMBER() OVER (ORDER BY "id"), (SELECT "id" FROM "songs" WHERE "title" = 'Half of My Heart (album version)' LIMIT 1) "songId", "id" "artistId" FROM "artists" WHERE "name" IN ('Taylor Swift') UNION
SELECT ROW_NUMBER() OVER (ORDER BY "id"), (SELECT "id" FROM "songs" WHERE "title" = 'Highway Don''t Care' LIMIT 1) "songId", "id" "artistId" FROM "artists" WHERE "name" IN ('Keith Urban') UNION
SELECT ROW_NUMBER() OVER (ORDER BY "id"), (SELECT "id" FROM "songs" WHERE "title" = 'Hold On (live cover)' LIMIT 1) "songId", "id" "artistId" FROM "artists" WHERE "name" IN ('Taylor Swift') UNION
SELECT ROW_NUMBER() OVER (ORDER BY "id"), (SELECT "id" FROM "songs" WHERE "title" = 'The Last Time' LIMIT 1) "songId", "id" "artistId" FROM "artists" WHERE "name" IN ('Gary Lightbody of Snow Patrol') UNION
SELECT ROW_NUMBER() OVER (ORDER BY "id"), (SELECT "id" FROM "songs" WHERE "title" = 'Long Live (single version)' LIMIT 1) "songId", "id" "artistId" FROM "artists" WHERE "name" IN ('Paula Fernandes') UNION
SELECT ROW_NUMBER() OVER (ORDER BY "id"), (SELECT "id" FROM "songs" WHERE "title" = 'Lover (Remix)' LIMIT 1) "songId", "id" "artistId" FROM "artists" WHERE "name" IN ('Shawn Mendes') UNION
SELECT ROW_NUMBER() OVER (ORDER BY "id"), (SELECT "id" FROM "songs" WHERE "title" = 'Me!' LIMIT 1) "songId", "id" "artistId" FROM "artists" WHERE "name" IN ('Brendon Urie of Panic! at the Disco') UNION
SELECT ROW_NUMBER() OVER (ORDER BY "id"), (SELECT "id" FROM "songs" WHERE "title" = 'Safe & Sound' LIMIT 1) "songId", "id" "artistId" FROM "artists" WHERE "name" IN ('The Civil Wars') UNION
SELECT ROW_NUMBER() OVER (ORDER BY "id"), (SELECT "id" FROM "songs" WHERE "title" = 'Soon You''ll Get Better' LIMIT 1) "songId", "id" "artistId" FROM "artists" WHERE "name" IN ('Dixie Chicks') UNION
SELECT ROW_NUMBER() OVER (ORDER BY "id"), (SELECT "id" FROM "songs" WHERE "title" = 'Two Is Better Than One' LIMIT 1) "songId", "id" "artistId" FROM "artists" WHERE "name" IN ('Taylor Swift')
