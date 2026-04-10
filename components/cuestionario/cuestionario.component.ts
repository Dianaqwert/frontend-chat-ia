import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from '../../services/services/chat.service';

@Component({
  selector: 'app-cuestionario',
  standalone:true,
  imports: [FormsModule],
  templateUrl: './cuestionario.component.html',
  styleUrl: './cuestionario.component.css'
})

export class CuestionarioComponent {
  datosPersonales = { edad: '', ocupacion: '', nombre: '' };
  fase = 0;

  preguntas = [
    { id: '1', texto: 'En las últimas semanas, ¿has sentido que el estrés te sobrepasa?', respuesta: null as number | null },
    { id: '2', texto: '¿Has perdido el interés o las ganas de hacer las cosas?', respuesta: null as number | null },
    { id: '3', texto: '¿Sientes que te quedas sin energía o herramientas?', respuesta: null as number | null },
    { id: '4', texto: '¿Has notado cambios de humor repentinos o tristeza?', respuesta: null as number | null },
    { id: '5', texto: '¿Te has sentido aislado(a) o has evitado interactuar?', respuesta: null as number | null },
    { id: '6', texto: '¿Te has sentido fácilmente frustrado(a) o irritable?', respuesta: null as number | null },
    { id: '7', texto: '¿Has notado cambios fuertes en tus hábitos de sueño o peso?', respuesta: null as number | null },
    { 
      id: '8', 
      texto: '¿Cuánto tiempo llevas sintiendo la necesidad de aislarte?', 
      respuesta: null as number | null,
      opciones: [{v: 0, t: 'No me aíslo'}, {v: 1, t: 'Unas semanas'}, {v: 2, t: 'Más de un mes'}]
    },
    { 
      id: '9', 
      texto: '¿Has recibido atención psicológica anteriormente?', 
      respuesta: null as number | null,
      opciones: [{v: 0, t: 'No, nunca'}, {v: 2, t: 'Sí, he estado en tratamiento'}]
    }
  ];

  constructor(private router: Router, private chatService: ChatService) {}

  pasarACuestionario() {
    if (this.datosPersonales.nombre && this.datosPersonales.edad && this.datosPersonales.ocupacion) {
      this.fase = 1;
    }
  }

  seleccionarRespuesta(index: number, valor: number) {
    this.preguntas[index].respuesta = valor;
  }

  get totalRespondidas() {
    return this.preguntas.filter(p => p.respuesta !== null).length;
  }

  todasRespondidas(): boolean {
    return this.preguntas.every(p => p.respuesta !== null);
  }

  finalizarCuestionario() {
    if (this.todasRespondidas()) {
      const payload = {
        nombre: this.datosPersonales.nombre,
        edad: this.datosPersonales.edad,
        ocupacion: this.datosPersonales.ocupacion,
        respuestas_clinicas: this.preguntas.map(p => p.respuesta)
      };

      this.chatService.iniciarSesion(payload).subscribe({
        next: (res) => {
          console.log('Backend OK:', res);
          this.router.navigate(['/chat']);
        },
        error: (err) => {
          console.error(err);
          alert('Error de conexión con Python.');
        }
      });
    }
  }
}