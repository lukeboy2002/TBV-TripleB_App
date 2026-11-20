/**
 * Het adres van de Laravel-API.
 *
 * Variabelen die met EXPO_PUBLIC_ beginnen leest Expo uit het bestand .env
 * en bakt ze in de app. Zo kun je tijdens het ontwikkelen naar je lokale
 * Herd-site wijzen en later naar tbv-tripleb.nl, zonder code te veranderen.
 */
export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? 'https://tbv-tripleb.nl/api').replace(/\/$/, '');
