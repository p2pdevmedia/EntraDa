-- SQL migration to add image URLs to events
ALTER TABLE "Event" ADD COLUMN "posterUrl" TEXT;
ALTER TABLE "Event" ADD COLUMN "sliderUrl" TEXT;
ALTER TABLE "Event" ADD COLUMN "miniUrl" TEXT;
