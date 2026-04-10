import { Routes } from '@angular/router';
import { HomeComponent } from '../../components/home/home.component';
import { ChatComponent } from '../../components/chat/chat.component';
import { CuestionarioComponent } from '../../components/cuestionario/cuestionario.component';

export const routes: Routes = [
    { path: '', component: HomeComponent }, // Ruta por defecto (Home)
    {path:'cuestionario',component:CuestionarioComponent},
    { path: 'chat', component: ChatComponent }, // Ruta del chat
    { path: '**', redirectTo: '' } // Si escriben una URL que no existe, los regresa al Home
];
