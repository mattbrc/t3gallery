import Link from "next/link";
import Image from "next/image";
import { db } from "~/server/db";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getUserPicksCount, getUserWinPercentage } from "~/server/queries";

export const dynamic = "force-dynamic";

async function UserCard() {
  const user = await currentUser();
  console.log("user id: ", user?.id);
  const userCount = await getUserPicksCount();
  const winPercentage = await getUserWinPercentage();

  console.log("win perc: ", winPercentage);
  const username = user?.username;

  return (
    <Card className="w-[380px]">
      <CardHeader>
        <CardTitle>{username}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <p>Total Picks:</p>
          <p>{userCount[0]?.count ?? 0}</p>
        </div>
        <div className="flex justify-between">
          <p>Win Percentage:</p>
          <p>{winPercentage.toFixed(2) ?? 0}%</p>
        </div>
        {/* <div className="flex justify-between">
          <p>Rank:</p>
          <p>0</p>
        </div> */}
      </CardContent>
    </Card>
  );
}

async function Fights() {
  const fights = await db.query.fightCards.findMany({
    orderBy: (model, { desc }) => desc(model.fightDate),
  });

  console.log("Fights: ", fights);

  return (
    <div className="flex flex-col gap-4">
      {[...fights].map((fight) => (
        <Card key={fight.fightId} className="w-[380px]">
          <CardHeader>
            <CardTitle>{fight.eventName}</CardTitle>
            <div className="flex justify-between">
              <CardDescription>{fight.fightDate}</CardDescription>
              <CardDescription>{fight.weightClass}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <h1 className="font-bold">{fight.fighter1Name}</h1>
            <CardDescription>vs</CardDescription>
            <h1 className="font-bold">{fight.fighter2Name}</h1>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default async function HomePage() {
  const userCount = await getUserPicksCount();

  console.log("user count: ", userCount);
  return (
    <main className="">
      <SignedOut>
        <div className="h-full w-full text-center text-2xl">
          <p>Degenerate gamblers unite</p>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="flex flex-col items-center justify-center gap-4">
          <UserCard />
          <p className="text-xl font-bold">Latest Fights</p>
          <Fights />
        </div>
      </SignedIn>
    </main>
  );
}
