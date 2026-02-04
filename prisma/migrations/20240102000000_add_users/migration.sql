-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "twitchId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "profilePicture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_twitchId_key" ON "User"("twitchId");

-- CreateIndex
CREATE INDEX "User_twitchId_idx" ON "User"("twitchId");

-- Drop old columns and add new ones
ALTER TABLE "StreamIdea" DROP COLUMN IF EXISTS "ipHash";
ALTER TABLE "StreamIdea" ADD COLUMN "userId" TEXT;

ALTER TABLE "Vote" DROP COLUMN IF EXISTS "ipHash";
ALTER TABLE "Vote" ADD COLUMN "userId" TEXT;

-- CreateIndex
CREATE INDEX "StreamIdea_userId_idx" ON "StreamIdea"("userId");

-- CreateIndex
CREATE INDEX "Vote_userId_idx" ON "Vote"("userId");

-- Drop old unique constraint and add new one
DROP INDEX IF EXISTS "Vote_ideaId_ipHash_key";
CREATE UNIQUE INDEX "Vote_ideaId_userId_key" ON "Vote"("ideaId", "userId");
