/**
 * Een klein hulpje om met de Laravel-API te praten.
 *
 * - Zet altijd "Accept: application/json", zodat Laravel fouten als JSON terugstuurt
 *   in plaats van een HTML-pagina.
 * - Stuurt het token mee als "Authorization: Bearer ...".
 * - Bij een fout (status 4xx/5xx) gooit hij een ApiError met de melding van Laravel.
 */
import { API_URL } from './config';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    /** Validatiefouten van Laravel, bijv. { email: ['Deze gegevens kloppen niet.'] } */
    public errors: Record<string, string[]> = {},
  ) {
    super(message);
  }
}

type Options = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  token?: string | null;
};

export async function api<T>(path: string, { method = 'GET', body, token }: Options = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let payload: BodyInit | undefined;
  if (body instanceof FormData) {
    // Voor foto's: de telefoon zet zelf de juiste multipart-header.
    payload = body;
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { method, headers, body: payload });
  } catch {
    throw new ApiError('Geen verbinding met de server. Controleer je internet.', 0);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    const firstError = json.errors ? Object.values<string[]>(json.errors)[0]?.[0] : undefined;
    throw new ApiError(firstError ?? json.message ?? 'Er ging iets mis.', response.status, json.errors ?? {});
  }

  return json as T;
}
