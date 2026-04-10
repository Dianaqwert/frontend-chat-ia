import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/services/chat.service';


interface Mensaje{
  texto:string;
  esUsuario:boolean;
}

@Component({
  selector: 'app-chat',
  standalone:true,
  imports: [FormsModule,],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})

export class ChatComponent implements AfterViewChecked{
  
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  nuevoMensaje: string = '';
  sesionTerminada: boolean = false;
  urlPdfGenerado: string = '';
  pdfUrl = '';
  
  mensajes: Mensaje[] = [
    { texto: '¡Hola! Soy Ballena Solitaria. ¿Cómo te sientes hoy? estoy para escucharte ...', esUsuario: false }
  ];

  cargando: boolean = false; // Para mostrar que la IA está pensando

  constructor(private chatService: ChatService) {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  enviarMensaje(textarea: HTMLTextAreaElement) {
    if (this.nuevoMensaje.trim() === '' || this.cargando) return;

    const textoUsuario = this.nuevoMensaje;
    this.mensajes.push({ texto: textoUsuario, esUsuario: true });
    this.nuevoMensaje = '';
    this.cargando = true;
    textarea.style.height = 'auto';

    // Llamada real a la API
    this.chatService.enviarMensaje(textoUsuario).subscribe({
      next: (res) => {
        this.mensajes.push({ texto: res.respuesta, esUsuario: false });
        this.cargando = false;
        
        // Si hay una alerta crítica (suicida), podrías mostrar un aviso extra aquí
        if (res.alerta) {
            console.warn("ALERTA CRÍTICA DETECTADA POR EL BACKEND");
        }
      },
      error: () => {
        this.mensajes.push({ texto: 'Error de conexión con la IA.', esUsuario: false });
        this.cargando = false;
      }
    });
  }

  terminarSesion() {
    this.sesionTerminada = true;
    this.cargando = true;

    this.chatService.terminarSesion().subscribe({
      next: (res) => {
        this.urlPdfGenerado = res.url_pdf;
        this.cargando = false;
      },
      error: () => {
        alert('No se pudo generar el PDF.');
        this.cargando = false;
      }
    });
  }
  

  // 1. Función que hace crecer el textarea
  autoResize(textarea: HTMLTextAreaElement) {
    textarea.style.height = 'auto'; // Resetea la altura para recalcular
    textarea.style.height = textarea.scrollHeight + 'px'; // Ajusta al tamaño exacto del texto
  }

  // 2. Función para controlar la tecla Enter
  enviarConEnter(event: any, textarea: HTMLTextAreaElement) {
    // Si presiona Enter SIN la tecla Shift, enviamos el mensaje
    if (!event.shiftKey) {
      event.preventDefault(); // Evita que se haga un salto de línea en blanco
      this.enviarMensaje(textarea);
    }
  }

}
