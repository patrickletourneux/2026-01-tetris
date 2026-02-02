/**
 * Port définissant l'accès à l'API NASA APOD (Astronomy Picture of the Day).
 */
export interface NasaPhoto {
  url: string;
  hdurl?: string;
  title: string;
  explanation: string;
}

export interface INasaApi {
  /**
   * Récupère la photo astronomique du jour depuis l'API NASA.
   */
  fetchPhotoOfTheDay(): Promise<NasaPhoto>;
}
