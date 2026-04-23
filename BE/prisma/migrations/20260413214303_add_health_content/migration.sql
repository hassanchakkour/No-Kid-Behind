-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "isHealthContent" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "grade" DROP NOT NULL;
