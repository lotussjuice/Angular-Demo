import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class Weather {
  apiKey: string = '8abef07cef9b9b70b9f14cafd3acf302';
  
  private baseUrl: string = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private http: HttpClient) {}

  getWeather(city: string, country: string) {
    console.log(`Obteniendo clima para ${city}, ${country}`);
    const url = `${this.baseUrl}?appid=${this.apiKey}&units=metric&q=${city},${country}`;
    
    return this.http.get(url);
  }
}
