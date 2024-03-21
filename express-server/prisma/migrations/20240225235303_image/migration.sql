-- AlterTable
ALTER TABLE "Album" ALTER COLUMN "coverImage" SET DEFAULT 'https://shunofiles.s3.amazonaws.com/images/1708905006504-unknown.png';

-- AlterTable
ALTER TABLE "Artist" ALTER COLUMN "primaryImage" SET DEFAULT 'https://shunofiles.s3.amazonaws.com/images/1708905006504-unknown.png';

-- AlterTable
ALTER TABLE "Playlist" ALTER COLUMN "primaryImage" SET DEFAULT 'https://shunofiles.s3.amazonaws.com/images/1708905006504-unknown.png';

-- AlterTable
ALTER TABLE "Song" ALTER COLUMN "primaryImage" SET DEFAULT 'https://shunofiles.s3.amazonaws.com/images/1708905006504-unknown.png';
