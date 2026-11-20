/**
 * Alle data-verzoeken van de app, met TanStack Query.
 *
 * useQuery haalt data op en onthoudt (cachet) het resultaat. Ga je terug naar een
 * scherm, dan zie je meteen de vorige data terwijl op de achtergrond ververst wordt.
 * useMutation is voor acties die iets veranderen (starten, afvallen, aanmelden).
 * Na een mutatie zeggen we met invalidateQueries welke lijsten opnieuw geladen moeten worden.
 *
 * De "queryKey" is de naam van het lijstje in de cache, bijv. ['games', 12].
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from './api';
import { useAuth } from './auth';
import type { AgendaEvent, AttendanceStatus, Game, GamePlayer, LiveGame, Paginated, Player } from './types';

export type StandingsSort = 'points' | 'avg' | 'won' | 'cup' | 'played';

export function useStandings(sort: StandingsSort) {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['players', sort],
    queryFn: () => api<{ data: Player[] }>(`/players?sort=${sort}&dir=desc`, { token }),
    select: (result) => result.data,
  });
}

export function useGames() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['games'],
    queryFn: () => api<Paginated<Game>>('/games', { token }),
    select: (result) => result.data,
  });
}

export function useGame(id: number) {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['games', id],
    queryFn: () => api<{ data: Game }>(`/games/${id}`, { token }),
    select: (result) => result.data,
  });
}

export function useCurrentGame() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['games', 'current'],
    queryFn: () => api<{ data: LiveGame | null }>('/games/current', { token }),
    select: (result) => result.data,
    // Ververs elke 10 seconden, zodat iedereen aan tafel hetzelfde ziet.
    refetchInterval: 10_000,
  });
}

/** Na elke wijziging aan een wedstrijd: stand, lijst en live opnieuw laden. */
function useRefreshGames() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['games'] });
    queryClient.invalidateQueries({ queryKey: ['players'] });
    queryClient.invalidateQueries({ queryKey: ['cup-winner'] });
  };
}

export function useStartGame() {
  const { token } = useAuth();
  const refresh = useRefreshGames();
  return useMutation({
    mutationFn: (players: number[]) => api('/games', { method: 'POST', body: { players }, token }),
    onSuccess: refresh,
  });
}

export function useEliminatePlayer(gameId: number) {
  const { token } = useAuth();
  const refresh = useRefreshGames();
  return useMutation({
    mutationFn: (userId: number) =>
      api<{ completed: boolean; data: LiveGame | Game }>(`/games/${gameId}/eliminate`, {
        method: 'POST',
        body: { user_id: userId },
        token,
      }),
    onSuccess: refresh,
  });
}

export function useUploadCupPhoto(gameId: number) {
  const { token } = useAuth();
  const refresh = useRefreshGames();
  return useMutation({
    mutationFn: (photo: { uri: string; mimeType?: string | null; fileName?: string | null }) => {
      const form = new FormData();
      // React Native verwacht voor een bestand een object met uri, name en type.
      form.append('photo', {
        uri: photo.uri,
        name: photo.fileName ?? 'beker.jpg',
        type: photo.mimeType ?? 'image/jpeg',
      } as unknown as Blob);
      return api<{ data: GamePlayer }>(`/games/${gameId}/cup-photo`, { method: 'POST', body: form, token });
    },
    onSuccess: refresh,
  });
}

export function useCupWinner() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['cup-winner'],
    queryFn: () => api<{ data: (GamePlayer & { game_id: number; game_date: string }) | null }>('/cup-winner', { token }),
    select: (result) => result.data,
  });
}

export function useEvents() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['events'],
    queryFn: () => api<Paginated<AgendaEvent>>('/events', { token }),
    select: (result) => result.data,
  });
}

export function useEvent(slug: string) {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['events', slug],
    queryFn: () => api<{ data: AgendaEvent }>(`/events/${slug}`, { token }),
    select: (result) => result.data,
  });
}

export function useSetAttendance(slug: string) {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: AttendanceStatus) =>
      api(`/events/${slug}/attendance`, { method: 'PUT', body: { status }, token }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  });
}
