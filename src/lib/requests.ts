import { useQuery, useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Participant, Race, Team } from "./types";

const apiClient = axios.create({
  baseURL: "https://sistema-corrida.test-gg.workers.dev/api",
});

const fetchData = async <T>(url: string): Promise<T> => {
  const response = await apiClient.get<T>(url);
  return response.data;
};

const postData = async <T>(url: string, data: T): Promise<T> => {
  const response = await apiClient.post<T>(url, data);
  return response.data;
};

const updateData = async <T>(url: string, data: T): Promise<T> => {
  const response = await apiClient.put<T>(url, data);
  return response.data;
};

// Teams

type TeamsResponse = {
  data: Team[];
};

export const useFetchTeams = () =>
  useQuery<TeamsResponse, AxiosError>({
    queryKey: ["teams"],
    queryFn: () => fetchData<TeamsResponse>("/teams"),
  });

export const useFetchTeam = (id: string) =>
  useQuery<Team, AxiosError>({
    queryKey: ["team", id],
    queryFn: () => fetchData<Team>(`/teams/${id}`),
  });

export const usePostTeam = () =>
  useMutation<Team, AxiosError, Team>({
    mutationKey: ["team"],
    mutationFn: (data: Team) => postData<Team>("/teams", data),
  });

// Races

type RacesResponse = {
  data: Race[];
};

export const useFetchRaces = () =>
  useQuery<RacesResponse, AxiosError>({
    queryKey: ["races"],
    queryFn: () => fetchData<RacesResponse>("/races"),
  });

export const useFetchRace = (id: string) =>
  useQuery<Race, AxiosError>({
    queryKey: ["race", id],
    queryFn: () => fetchData<Race>(`/races/${id}`),
  });

export const usePostRace = () =>
  useMutation<Race, AxiosError, Race>({
    mutationKey: ["race"],
    mutationFn: (data: Race) => postData<Race>("/races", data),
  });

export const useUpdateRace = (id: string) =>
  useMutation<Race, AxiosError, Race>({
    mutationKey: ["race", id],
    mutationFn: (data: Race) => updateData<Race>(`/races/${id}`, data),
  });

export const useUpdateTeamRace = (id: string) => 
  useMutation<Race, AxiosError, Race>({
    mutationKey: ["team", id],
    mutationFn: (data: Race) => updateData<Race>(`/teams/${id}/races`, data),
  });

export const usePostParticipant = () =>
  useMutation<Participant, AxiosError, Participant>({
    mutationKey: ["participants"],
    mutationFn: (data: Participant) =>
      postData<Participant>(`/participants`, data),
  });

export const useFetchParticipants = () =>
  useQuery<{ data: Participant[] }, AxiosError>({
    queryKey: ["participants"],
    queryFn: () => fetchData<{ data: Participant[] }>(`/participants`),
  });