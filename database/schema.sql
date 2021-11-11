set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "public"."users" (
	"screenNameId" serial NOT NULL,
	"screenName" TEXT NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("screenNameId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "public"."gameRooms" (
	"roomId" serial NOT NULL,
	"roomName" TEXT NOT NULL,
	"storeValues" json NOT NULL DEFAULT '[[], []]',
	"pitValues" json NOT NULL DEFAULT '[[], [], [], [], [], [], [], [], [], [], [], []]',
  "players" integer NOT NULL DEFAULT 0,
  "activePlayer" integer NOT NULL DEFAULT 1,
  "gameStarted" boolean NOT NULL DEFAULT false,
	"playerOne" integer,
	"playerTwo" integer,
	CONSTRAINT "gameRooms_pk" PRIMARY KEY ("roomId")
) WITH (
  OIDS=FALSE
);

ALTER TABLE "gameRooms" ADD CONSTRAINT "gameRooms_fk0" FOREIGN KEY ("playerOne") REFERENCES "users"("screenNameId");
ALTER TABLE "gameRooms" ADD CONSTRAINT "gameRooms_fk1" FOREIGN KEY ("playerTwo") REFERENCES "users"("screenNameId");
