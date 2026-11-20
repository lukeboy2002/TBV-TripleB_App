/**
 * TypeScript-types die precies passen op wat de Laravel API Resources teruggeven.
 * Zie in de site: app/Http/Resources/*.php
 */

export type PlayerStats = {
  played: number;
  points: number;
  average: number;
  won: number;
  cups: number;
};

export type Player = {
  id: number;
  username: string;
  name: string;
  avatar_url: string;
  stats?: PlayerStats;
};

export type Me = Player & {
  email: string;
  roles: string[];
};

export type GamePlayer = {
  player: Player;
  /** 1 = als eerste afgevallen (beker), hoogste = winnaar, null = zit nog in het spel */
  position: number | null;
  points: number;
  is_winner: boolean;
  has_cup: boolean;
  cup_photo_url: string | null;
};

export type Game = {
  id: number;
  date: string;
  status: 'in_progress' | 'completed';
  completed_at: string | null;
  players: GamePlayer[];
};

export type LiveGame = {
  id: number;
  date: string;
  status: 'in_progress' | 'completed';
  /** Wie nog meedoet, in speelvolgorde */
  remaining: GamePlayer[];
  /** Wie al af is, in volgorde van afvallen */
  eliminated: GamePlayer[];
};

export type AttendanceStatus = 'attending' | 'maybe' | 'not_attending';

export type AgendaEvent = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  body?: string;
  date: string;
  end_date: string | null;
  image_url: string | null;
  organizer?: Player;
  my_status: AttendanceStatus | null;
  counts?: Record<AttendanceStatus, number>;
  attendees?: { player: Player; status: AttendanceStatus }[];
};

/** Laravel geeft lijsten terug als { data: [...] }, met paginering erbij. */
export type Paginated<T> = {
  data: T[];
  meta: { current_page: number; last_page: number };
};
