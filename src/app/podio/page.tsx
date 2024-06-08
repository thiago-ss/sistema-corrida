"use client";

import PodiumTable from "@/components/podium-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchTeams } from "@/lib/requests";
import { calculatePodium } from "@/lib/utils";

const Podio = () => {
  const { data: teams } = useFetchTeams();

  if (!teams) {
    return (
      <div className="px-20">
        <Skeleton className="w-[1760px] h-[282px]" />
      </div>
    );
  }

  const podium = calculatePodium(teams.data);
  return (
    <div className="px-20">
      <PodiumTable rankings={podium} />
    </div>
  );
};

export default Podio;
