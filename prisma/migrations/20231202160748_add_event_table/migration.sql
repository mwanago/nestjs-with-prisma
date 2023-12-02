-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "dateRange" tstzrange NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);
