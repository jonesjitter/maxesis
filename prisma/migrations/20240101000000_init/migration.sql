-- CreateTable
CREATE TABLE "StreamIdea" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "votes" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipHash" TEXT NOT NULL,

    CONSTRAINT "StreamIdea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StreamIdea_votes_idx" ON "StreamIdea"("votes");

-- CreateIndex
CREATE INDEX "StreamIdea_status_idx" ON "StreamIdea"("status");

-- CreateIndex
CREATE INDEX "StreamIdea_createdAt_idx" ON "StreamIdea"("createdAt");

-- CreateIndex
CREATE INDEX "Vote_ideaId_idx" ON "Vote"("ideaId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_ideaId_ipHash_key" ON "Vote"("ideaId", "ipHash");
