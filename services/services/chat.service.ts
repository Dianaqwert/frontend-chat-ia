import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})


export class ChatService {
  // La URL de tu servidor FastAPI
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  // 1. Enviar datos del cuestionario
  iniciarSesion(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/iniciar_sesion`, datos);
  }

  // 2. Enviar mensaje y recibir respuesta de la IA
  enviarMensaje(texto: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/chat`, { texto });
  }

  // 3. Solicitar la generación del PDF
  terminarSesion(): Observable<any> {
    return this.http.post(`${this.apiUrl}/terminar_sesion`, {});
  }
}