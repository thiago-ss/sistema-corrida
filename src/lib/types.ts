export interface Participant {
  name: string;
  grade?: number;
}

export interface Team {
  id: string;
  name: string;
  car_number: number;
  participants?: Participant[];
  races?: Race[];
}

export interface Race {
  name: string;
  data?: number;
}

export interface TeamRanking {
  team: Team;
  podium: number[];
  score: number;
  averagePodium: number;
}
