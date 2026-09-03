# MASTER PROMPT — HHWeekPlanner

Actúa como un ingeniero de software full-stack senior, especializado en React y Firebase, con criterio fuerte de UI/UX y seguridad de datos multiusuario. Vas a construir de principio a fin una aplicación web de productividad personal llamada **HHWeekPlanner**.

## 1. Objetivo del producto

HHWeekPlanner es un planificador semanal personal que centraliza en un solo lugar:
- Tareas y recordatorios.
- Horarios fijos recurrentes (ej. horarios de gym) para organizar la semana completa como un calendario.
- Proyectos con fecha de entrega, con avisos anticipados configurables antes del vencimiento.
- Un dashboard con la vista general del estado de la semana.

Debe sentirse como un calendario/agenda personal, no como un simple to-do list.

## 2. Stack técnico obligatorio

- **Frontend:** React (Vite), React Router.
- **Backend/Datos:** Firebase (Auth, Firestore). No usar backend propio ni servidor adicional salvo que sea estrictamente necesario para notificaciones (evalúalo en la sección 7).
- **Autenticación:** Firebase Authentication, **únicamente con proveedor de Google** (Google Sign-In). No implementar registro con email/password.
- **Multiusuario:** cada usuario autenticado con Google debe ver y gestionar exclusivamente su propia información. Ningún dato de un usuario debe ser accesible ni visible para otro usuario, ni a nivel de UI ni a nivel de backend/reglas de Firestore.

### Configuración de Firebase a usar (ya provisionada, úsala tal cual)

```js
// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB2yQL_nUuC0YsiPmXEhe5mWY_JNeW2t2E",
  authDomain: "hhweekplanner.firebaseapp.com",
  projectId: "hhweekplanner",
  storageBucket: "hhweekplanner.firebasestorage.app",
  messagingSenderId: "799686241392",
  appId: "1:799686241392:web:f255e180c0477a1fc398b5",
  measurementId: "G-G0LHT6W9GS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
```

## 3. Modelo de datos en Firestore

Estructura por subcolecciones anidadas al usuario, para que el aislamiento de datos sea natural:

```
/users/{uid}
    displayName, email, photoURL, createdAt, timezone, reminderDefaults

/users/{uid}/events/{eventId}
    title: string
    description: string
    type: "task" | "reminder" | "gym" | "project" | "custom"
    startDateTime: timestamp
    endDateTime: timestamp
    isRecurring: boolean
    recurrenceRule: { frequency: "weekly", daysOfWeek: [1,3,5] } | null
    reminderMinutesBefore: number[]   // ej. [60, 1440] = avisar 1h y 1 día antes
    category/color: string
    completed: boolean
    createdAt, updatedAt: timestamp
```

Un solo tipo de documento "event" con un campo `type` cubre tareas, recordatorios, horarios de gym (recurrentes) y proyectos con entrega — simplifica el CRUD y el render en el calendario.

## 4. Reglas de seguridad de Firestore (obligatorias)

Implementa exactamente este aislamiento por usuario, y ajústalo solo si agregas más subcolecciones bajo el mismo patrón:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, update, delete: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;

      match /events/{eventId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

Ningún dato debe quedar accesible por reglas abiertas (`allow read, write: if true`) ni por colecciones a nivel raíz sin filtro por `uid`.

## 5. Autenticación

- Pantalla de login minimalista con un único botón "Continuar con Google".
- Al autenticar por primera vez, crear el documento `/users/{uid}` si no existe.
- Rutas protegidas: si no hay sesión activa, redirigir siempre al login.
- Botón de cerrar sesión visible en la navegación principal.

## 6. Funcionalidades

### 6.1 Dashboard (vista principal al entrar)
- Resumen del día actual (eventos de hoy, ordenados por hora).
- Próximas entregas de proyectos (los `type: "project"` más cercanos en el tiempo), con indicador visual de urgencia (ej. rojo/ámbar suave si quedan menos de 48h).
- Contador rápido: tareas pendientes vs completadas de la semana.
- Acceso directo para crear un nuevo evento.

### 6.2 Vista de calendario semanal
- Vista tipo agenda semanal (lunes a domingo), con franjas horarias.
- Debe mostrar en la misma grilla: horarios de gym (recurrentes), tareas puntuales, recordatorios y fechas de entrega de proyectos, diferenciados por color/categoría.
- Los eventos recurrentes (gym) se generan automáticamente en cada semana según `recurrenceRule`, sin necesidad de crear un documento por cada repetición.
- Navegación entre semanas (anterior/siguiente/hoy).

### 6.3 CRUD de eventos
- Crear, leer, actualizar y eliminar eventos desde un modal o panel lateral.
- Formulario con: título, descripción, tipo, fecha/hora inicio, fecha/hora fin, si es recurrente (y su regla), minutos/horas de anticipación para el recordatorio, categoría/color.
- Validaciones básicas (fecha fin posterior a inicio, título obligatorio).
- Marcar tareas/proyectos como completados.

### 6.4 Recordatorios y avisos anticipados
- Cada evento puede tener uno o más `reminderMinutesBefore`.
- Implementación MVP (sin backend adicional): al cargar la app, calcular en el cliente qué recordatorios caen dentro de la ventana actual y disparar `Notification` del navegador (pidiendo permiso al usuario) + un toast/banner in-app. Revisar periódicamente con un intervalo (ej. cada 60s) mientras la app esté abierta.
- Dejar preparado (comentado o como sección aparte, no bloqueante para el MVP) un plan de mejora futura con Firebase Cloud Functions + Firebase Cloud Messaging para notificaciones push reales aunque la app esté cerrada.

## 7. Diseño UI/UX

- **Modo oscuro por defecto (único modo, no requiere toggle).**
- Estilo minimalista: mucho espacio en blanco (oscuro), tipografía clara, sin elementos decorativos innecesarios.
- Paleta de bajo contraste, pensada para no cansar la vista en sesiones largas (evitar negro puro `#000000` y blanco puro `#FFFFFF`):
  - Fondo base: `#12141A`
  - Fondo de tarjetas/paneles: `#1B1E27`
  - Bordes/separadores sutiles: `#2A2E3A`
  - Texto principal: `#E4E6EB`
  - Texto secundario/atenuado: `#9AA0AC`
  - Acento primario (acciones, links, hoy en el calendario): azul-teal suave `#5B8DEF`
  - Éxito/completado: verde suave `#6EE7B7`
  - Urgencia/vencimiento cercano: ámbar suave `#F0B429` (evitar rojos saturados agresivos)
- Categorías de eventos con colores propios pero dentro de la misma gama de saturación baja (gym, tarea, recordatorio, proyecto).
- Tipografía: una sans-serif legible (ej. Inter o system-ui), tamaños generosos, buen interlineado.
- Componentes reutilizables: botón, input, modal, tarjeta de evento, badge de categoría.

## 8. Estructura de proyecto sugerida

```
src/
  firebase/
    config.js
  context/
    AuthContext.jsx
  components/
    layout/ (Navbar, Sidebar)
    events/ (EventForm, EventCard, EventModal)
    calendar/ (WeekView, DayColumn, TimeSlot)
    dashboard/ (SummaryCard, UpcomingDeadlines)
    ui/ (Button, Input, Modal, Badge)
  pages/
    Login.jsx
    Dashboard.jsx
    Calendar.jsx
  hooks/
    useEvents.js
    useReminders.js
  utils/
    dateHelpers.js
    recurrence.js
  App.jsx
  main.jsx
```

## 9. Requisitos no funcionales

- Responsive: debe verse y funcionar bien tanto en escritorio como en móvil.
- Manejo de estados de carga y error en todas las operaciones contra Firestore.
- Código organizado, componentes pequeños y reutilizables, sin lógica de negocio mezclada con la UI.
- Nada de datos hardcodeados de ejemplo en producción; usar estados vacíos ("aún no tienes eventos esta semana") cuando corresponda.

## 10. Entregable esperado

Construye la aplicación completa siguiendo todo lo anterior: configuración de Firebase, autenticación con Google, modelo de datos, reglas de seguridad de Firestore, dashboard, calendario semanal, CRUD de eventos y sistema de recordatorios, con el diseño minimalista en modo oscuro especificado. Al finalizar, indica los pasos que quedan pendientes de mi lado (por ejemplo: habilitar Google como proveedor en la consola de Firebase, publicar las reglas de Firestore, configurar dominios autorizados).