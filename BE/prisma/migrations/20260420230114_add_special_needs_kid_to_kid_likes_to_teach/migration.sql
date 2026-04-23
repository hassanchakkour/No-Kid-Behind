-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "isKidToKid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSpecialNeeds" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "likesToTeach" BOOLEAN NOT NULL DEFAULT false;
