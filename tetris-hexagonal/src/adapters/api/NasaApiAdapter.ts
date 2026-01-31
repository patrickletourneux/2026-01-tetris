import type { INasaApi, NasaPhoto } from '../../domain/ports/INasaApi';

const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY;
const NASA_APOD_URL = 'https://api.nasa.gov/planetary/apod';

/**
 * Adaptateur pour l'API NASA APOD.
 * Implémente le port INasaApi pour récupérer les photos astronomiques.
 */
export class NasaApiAdapter implements INasaApi {
  async fetchPhotoOfTheDay(): Promise<NasaPhoto> {
    const response = await fetch(`${NASA_APOD_URL}?api_key=${NASA_API_KEY}`);

    if (!response.ok) {
      throw new Error(`NASA API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      url: data.url,
      hdurl: data.hdurl,
      title: data.title,
      explanation: data.explanation
    };
  }
}
