# HHWeekPlanner - Planificador Semanal y Agenda Personal

[Español](#español) | [English](#english)

---

<a name="español"></a>
## 🇪🇸 Descripción (Español)

**HHWeekPlanner** es una aplicación de productividad personal multi-usuario construida con React 18, Vite, React Router v6, Firebase Authentication y Cloud Firestore. Unifica tareas, recordatorios, horarios semanales recurrentes y fechas límite de proyectos en un calendario de agenda semanal interactivo y un panel ejecutivo inteligente.

---

### Stack Tecnológico

- **Framework Frontend:** React 18 (Sistema de construcción con Vite)
- **Enrutamiento:** React Router DOM v6
- **Base de Datos y Autenticación:** Firebase Web SDK v10 (Google Authentication, Cloud Firestore)
- **Iconografía:** Lucide React
- **Manipulación de Fechas:** date-fns
- **Sistema de Estilos:** Vanilla CSS (Tokens personalizados, Variables CSS, Glassmorphism, Sistema Grid Responsivo)
- **Despliegue:** Firebase Hosting

---

### Arquitectura Principal del Sistema

#### 1. Estrategia de Aislamiento de Datos Multi-Usuario
HHWeekPlanner garantiza el aislamiento estricto de datos por usuario tanto a nivel de aplicación como en las reglas de seguridad de la base de datos. Cada documento de usuario y evento anidado se organiza bajo el UID del usuario autenticado:

```text
/users/{userId}
  ├── displayName: string
  ├── email: string
  ├── photoURL: string
  ├── createdAt: timestamp
  ├── timezone: string
  └── reminderDefaults: array
      └── /events/{eventId}
          ├── title: string
          ├── description: string
          ├── type: "task" | "reminder" | "gym" | "project" | "custom"
          ├── startDateTime: timestamp
          ├── endDateTime: timestamp
          ├── isRecurring: boolean
          ├── recurrenceRule: object | null
          ├── reminderMinutesBefore: array
          ├── category: string
          └── completed: boolean
```

#### 2. Reglas de Seguridad de Firestore
Las reglas de control de acceso evitan la filtración de datos entre usuarios. La autorización requiere `request.auth != null` y valida que `request.auth.uid` coincida con `{userId}`:

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /events/{eventId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

---

### Características Principales

#### Panel Ejecutivo Inteligente
- Saludo ejecutivo adaptativo según la hora y resumen personal.
- Métricas consolidadas: conteo de eventos de hoy, tasa de cumplimiento semanal, entregas urgentes (< 48 horas) y festivos oficiales del mes.
- Agenda diaria cronológica con alternancia de estado completado en un clic.
- Monitor de entregas con insignias de urgencia automatizadas (Urgente para < 24h, Advertencia para < 48h, Normal para > 48h).

#### Motor de Procesamiento de Lenguaje Natural para Eventos
Parser determinista de Lenguaje Natural en español que corre localmente en el navegador y convierte texto en objetos de eventos estructurados sin APIs externas:
- Eliminación de prefijos de acción (agendar, programar, recordar, crear).
- Detección automática de categoría (gym, project, reminder, task).
- Extracción de fechas relativas (hoy, mañana, pasado mañana, días de la semana, fechas de calendario).
- Detección de horas en formato 12h y 24h (a las 7 AM, 5:30 PM, 3 de la tarde).

#### Calendario de Agenda Semanal Interactivo
- Vista en cuadrícula semanal (Lunes a Domingo) que abarca de 06:00 a 23:00.
- Filtros por categoría (Todos, Tareas, Gym, Proyectos, Recordatorios).
- Selección de bloques para crear eventos pre-poblados con las horas seleccionadas.
- Vistas móviles optimizadas con pestañas de días y modo lista cronológica.

#### Motor de Festivos Oficiales de Colombia
- Cálculo dinámico de festivos oficiales colombianos según la Ley Emiliani (Ley 51 de 1983) y el algoritmo de Meeus/Jones/Butcher para el Domingo de Pascua.
- Traslado automático de festivos al siguiente lunes cuando corresponde.
- Banners indicadores en el calendario y componente resumen del mes.

#### Horarios Semanales Recurrentes
- Generación de instancias virtuales para actividades recurrentes (ej. rutina de gimnasio) en cualquier semana sin duplicar registros en la base de datos.

#### Sistema de Notificaciones
- Mecanismo de monitoreo de eventos próximos según umbrales de alerta del usuario (`reminderMinutesBefore`).
- Notificaciones nativas del navegador y alertas visuales tipo toast en la aplicación.

---

### Instalación y Desarrollo Local

1. Clonar el repositorio:
```bash
git clone https://github.com/dobleh16/HHweekplanner.git
cd HHweekplanner
```

2. Instalar dependencias:
```bash
npm install
```

3. Variables de entorno (`.env`):
Copia `.env.example` a `.env` y configura tus credenciales de Firebase:
```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
VITE_FIREBASE_MEASUREMENT_ID=tu_measurement_id
```

4. Ejecutar el servidor de desarrollo:
```bash
npm run dev
```

5. Compilar para producción:
```bash
npm run build
```

---

<a name="english"></a>
## 🇬🇧 Overview (English)

**HHWeekPlanner** is a multi-tenant personal productivity application built with React 18, Vite, React Router v6, Firebase Authentication, and Cloud Firestore. It unifies tasks, reminders, fixed recurring weekly schedules, and project deadlines into an agenda-style weekly calendar and an intelligent executive dashboard.

---

### Technical Stack

- **Frontend Framework:** React 18 (Vite build system)
- **Routing:** React Router DOM v6
- **Database & Authentication:** Firebase Web SDK v10 (Google Authentication, Cloud Firestore)
- **Iconography:** Lucide React
- **Date Manipulation:** date-fns
- **Styling System:** Vanilla CSS (Custom tokens, CSS Variables, Glassmorphism, Responsive Grid System)
- **Deployment:** Firebase Hosting

---

### Core System Architecture

#### 1. Multi-Tenant Data Isolation Strategy
HHWeekPlanner enforces strict user data isolation at both application and database security levels. Every user document and nested event document is anchored directly under the authenticated user UID:

```text
/users/{userId}
  ├── displayName: string
  ├── email: string
  ├── photoURL: string
  ├── createdAt: timestamp
  ├── timezone: string
  └── reminderDefaults: array
      └── /events/{eventId}
          ├── title: string
          ├── description: string
          ├── type: "task" | "reminder" | "gym" | "project" | "custom"
          ├── startDateTime: timestamp
          ├── endDateTime: timestamp
          ├── isRecurring: boolean
          ├── recurrenceRule: object | null
          ├── reminderMinutesBefore: array
          ├── category: string
          └── completed: boolean
```

#### 2. Firestore Security Rules
Access control rules prevent cross-user data leakage. Authorization requires `request.auth != null` and validates that `request.auth.uid` matches `{userId}`:

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /events/{eventId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

---

### Key Features

#### Intelligent Executive Dashboard
- Time-aware executive greeting and personal briefing.
- Summary metrics for today's event count, weekly task completion ratio, urgent project deadlines (< 48 hours), and official statutory holidays for the current month.
- Chronological daily agenda list with single-click completion toggles.
- Project deadline monitor with automated urgency badges (Urgent for < 24h, Warning for < 48h, Normal for > 48h).

#### Natural Language Event Parsing Engine
An in-browser, deterministic Spanish Natural Language Processing parser converts text input into structured event objects without requiring external AI APIs:
- Action prefix stripping (agendar, programar, recordar, crear).
- Automatic event category detection (gym, project, reminder, task).
- Relative date extraction (hoy, mañana, pasado mañana, días de la semana, fechas de calendario).
- 12-hour and 24-hour time detection (a las 7 AM, 5:30 PM, 3 de la tarde).

#### Interactive Weekly Agenda Calendar
- Weekly grid layout (Monday through Sunday) spanning hours 06:00 to 23:00.
- Category filtering options (Todos, Tareas, Gym, Proyectos, Recordatorios).
- Slot selection to create events pre-populated with selected timestamps.
- Mobile-optimized Day View selector tabs and Agenda Timeline List mode.

#### Statutory Colombian Holidays Engine
- Dynamic calculation of official Colombian holidays based on Ley Emiliani (Law 51 of 1983) and Meeus/Jones/Butcher Easter Sunday algorithm.
- Automatic shifting of statutory holidays to the following Monday when applicable.
- Real-time indicator banners on calendar headers and dedicated monthly holiday summary component.

#### Recurring Weekly Schedules
- Expansion engine generates virtual weekly instances for recurring activities across any target calendar week without database record duplication.

#### Notification System
- Polling mechanism evaluating upcoming events against user-defined alert thresholds (`reminderMinutesBefore`).
- Native browser notification integration and animated in-app toast alerts.

---

### Project Directory Structure

```text
src/
  components/
    calendar/
      EventCard.jsx
      WeekView.jsx
    dashboard/
      AssistantBriefing.jsx
      CurrentMonthHolidays.jsx
      SummaryCard.jsx
      TodayEvents.jsx
      UpcomingDeadlines.jsx
    events/
      EventForm.jsx
      EventModal.jsx
    layout/
      Navbar.jsx
    reminders/
      NotificationToastManager.jsx
    ui/
      Badge.jsx
      Button.jsx
      Input.jsx
      Modal.jsx
      Select.jsx
      UserAvatar.jsx
  context/
    AuthContext.jsx
  firebase/
    config.js
  hooks/
    useEvents.js
    useReminders.js
  pages/
    CalendarPage.jsx
    Dashboard.jsx
    Login.jsx
  utils/
    assistantParser.js
    colombianHolidays.js
    dateHelpers.js
    recurrence.js
  App.jsx
  index.css
  main.jsx
firestore.rules
firebase.json
vite.config.js
```

---

## License / Licencia

Este proyecto está bajo la Licencia **MIT**. Consulta el archivo [LICENSE](LICENSE) para más detalles.

This project is licensed under the **MIT** License. See the [LICENSE](LICENSE) file for details.
