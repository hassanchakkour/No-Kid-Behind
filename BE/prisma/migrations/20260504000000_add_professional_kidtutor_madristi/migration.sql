-- Migration: rename teacher→professional, add kid_tutor role, kidTutorApproved, MadristiClick

-- Step 0: Clean up any partial state from a previous failed run
DROP TYPE IF EXISTS "Role_new";

-- Step 1: Create the new Role enum with all values
CREATE TYPE "Role_new" AS ENUM ('student', 'professional', 'kid_tutor', 'admin');

-- Step 2: Drop the DEFAULT on role so the column has no bound enum default
ALTER TABLE "User" ALTER COLUMN role DROP DEFAULT;

-- Step 3: Convert the User.role column to text temporarily
ALTER TABLE "User" ALTER COLUMN role TYPE TEXT;

-- Step 4: Migrate existing 'teacher' values to 'professional'
UPDATE "User" SET role = 'professional' WHERE role = 'teacher';

-- Step 5: Switch column to new enum type
ALTER TABLE "User" ALTER COLUMN role TYPE "Role_new" USING (role::"Role_new");

-- Step 6: Restore the default using the new enum type
ALTER TABLE "User" ALTER COLUMN role SET DEFAULT 'student'::"Role_new";

-- Step 7: Drop old enum and rename new one
DROP TYPE "Role";
ALTER TYPE "Role_new" RENAME TO "Role";

-- Step 8: After rename, reset default to reference the renamed type
ALTER TABLE "User" ALTER COLUMN role DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN role SET DEFAULT 'student'::"Role";

-- Step 9: Add kidTutorApproved column to User
ALTER TABLE "User" ADD COLUMN "kidTutorApproved" BOOLEAN NOT NULL DEFAULT false;

-- Step 10: Create MadristiClick table
CREATE TABLE "MadristiClick" (
    "id" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MadristiClick_pkey" PRIMARY KEY ("id")
);

-- Step 11: Index on school for analytics queries
CREATE INDEX "MadristiClick_school_idx" ON "MadristiClick"("school");
