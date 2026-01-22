/*
  Warnings:

  - The primary key for the `HomeworkSubmission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `LastActivity` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Rating` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "HomeworkSubmission" DROP CONSTRAINT "HomeworkSubmission_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "HomeworkSubmission_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "HomeworkSubmission_id_seq";

-- AlterTable
ALTER TABLE "LastActivity" DROP CONSTRAINT "LastActivity_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "LastActivity_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "LastActivity_id_seq";

-- AlterTable
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Rating_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Rating_id_seq";
