"use client";

import ParticipantsTable from "@/components/participants-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchTeams } from "@/lib/requests";

const Notas = () => {
  const { data: teams } = useFetchTeams();

  if (!teams) {
    return (
      <div className="px-20">
        <Skeleton className="w-[1760px] h-[282px]" />
      </div>
    );
  }

  return (
    <div className="px-20">
      <ParticipantsTable teams={teams.data} />
    </div>
  );
};

export default Notas;
