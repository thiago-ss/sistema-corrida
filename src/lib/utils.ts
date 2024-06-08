import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Team, TeamRanking } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const gradesMap = [1, 1, 1, 0.8, 0.8, 0.8, 0.6, 0.6, 0.4];

const calculateRaceRanking = (
  teams: Team[],
  raceName: string,
  comparator: (a: number, b: number) => number
): TeamRanking[] => {
  const sortedTeams = teams
    .map((team) => {
      const race = team.races?.find((r) => r.name === raceName);
      return { team, score: race ? race.data : 0 };
    })
    .sort((a, b) => comparator(a.score || 0, b.score || 0));

  const rankings: TeamRanking[] = [];
  let currentRank = 1;

  for (let i = 0; i < sortedTeams.length; i++) {
    if (i > 0 && sortedTeams[i].score !== sortedTeams[i - 1].score) {
      currentRank = i + 1;
    }
    rankings.push({
      team: sortedTeams[i].team,
      score: sortedTeams[i].score || 0,
      podium: [currentRank],
      averagePodium: 0,
    });
  }

  return rankings;
};

export const calculatePodium = (teams: Team[]): TeamRanking[] => {
  const rampRanking = calculateRaceRanking(
    teams,
    "Rampa em 45°",
    (a, b) => b - a
  );
  const speedRanking = calculateRaceRanking(
    teams,
    "Velocidade máxima em pista reta",
    (a, b) => a - b
  );
  const tractionRanking = calculateRaceRanking(
    teams,
    "Tração com retenção de peso",
    (a, b) => b - a
  );

  const combinedRankings: { [key: string]: TeamRanking } = {};

  [...rampRanking, ...speedRanking, ...tractionRanking].forEach(
    ({ team, podium }) => {
      if (!combinedRankings[team.id]) {
        combinedRankings[team.id] = {
          team,
          podium: [],
          score: 0,
          averagePodium: 0,
        };
      }
      combinedRankings[team.id].podium.push(podium[0]);
    }
  );

  const finalRankings = Object.values(combinedRankings).map((ranking) => {
    const totalPodium = ranking.podium.reduce((acc, pos) => acc + pos, 0);
    ranking.averagePodium = totalPodium / ranking.podium.length;
    return ranking;
  });

  finalRankings.sort((a, b) => a.averagePodium - b.averagePodium);

  finalRankings.forEach((ranking, index) => {
    const grade = gradesMap[Math.min(index, gradesMap.length - 1)];
    if (ranking.team.participants) {
      ranking.team.participants.forEach((participant) => {
        participant.grade = grade;
      });
    }
  });

  return finalRankings;
};
