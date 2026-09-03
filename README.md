# HHWeekPlanner - Personal Weekly Planner and Agenda

HHWeekPlanner is a multi-tenant personal productivity application built with React 18, Vite, React Router v6, Firebase Authentication, and Cloud Firestore. It unifies tasks, reminders, fixed recurring weekly schedules, and project deadlines into an agenda-style weekly calendar and an intelligent executive dashboard.

---

## Technical Stack

- Frontend Framework: React 18 (Vite build system)
- Routing: React Router DOM v6
- Database and Authentication: Firebase Web SDK v10 (Google Authentication, Cloud Firestore)
- Iconography: Lucide React
- Date Manipulation: date-fns
- Styling System: Vanilla CSS (Custom tokens, CSS Variables, Glassmorphism, Responsive Grid System)
- Deployment: Firebase Hosting

---

## Core System Architecture

### 1. Multi-Tenant Data Isolation Strategy
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

### 2. Firestore Security Rules
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

## Key Features

### Intelligent Executive Dashboard
The dashboard provides a consolidated overview of current priorities:
- Time-aware executive greeting and personal briefing.
- Summary metrics for today's event count, weekly task completion ratio, urgent project deadlines (< 48 hours), and official statutory holidays for the current month.
- Chronological daily agenda list with single-click completion toggles.
- Project deadline monitor with automated urgency badges (Urgent for < 24h, Warning for < 48h, Normal for > 48h).

### Natural Language Event Parsing Engine
An in-browser, deterministic Spanish Natural Language Processing parser converts text input into structured event objects without requiring external artificial intelligence application programming interfaces:
- Action prefix stripping (agendar, programar, recordar, crear).
- Automatic event category detection (gym, project, reminder, task).
- Relative date extraction (hoy, mañana, pasado mañana, días de la semana, fechas de calendario).
- 12-hour and 24-hour time detection (a las 7 AM, 5:30 PM, 3 de la tarde).

### Interactive Weekly Agenda Calendar
- Weekly grid layout (Monday through Sunday) spanning hours 06:00 to 23:00.
- Category filtering options (Todos, Tareas, Gym, Proyectos, Recordatorios).
- Slot selection to create events pre-populated with selected timestamps.
- Mobile-optimized Day View selector tabs and Agenda Timeline List mode.

### Statutory Colombian Holidays Engine
- Dynamic calculation of official Colombian holidays based on Ley Emiliani (Law 51 of 1983) and Meeus/Jones/Butcher Easter Sunday algorithm.
- Automatic shifting of statutory holidays to the following Monday when applicable.
- Real-time indicator banners on calendar headers and dedicated monthly holiday summary component.

### Recurring Weekly Schedules
- Expansion engine generates virtual weekly instances for recurring activities (e.g., fitness routines) across any target calendar week without database record duplication.

### Notification System
- Polling mechanism evaluating upcoming events against user-defined alert thresholds (`reminderMinutesBefore`).
- Native browser notification integration and animated in-app toast alerts.

---

## Project Directory Structure

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

## Environment Variables and Security Configuration

This repository excludes production credentials using environment variables.

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Populate `.env` with your Firebase project credentials:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

---

## Local Development Installation

1. Clone the repository:
```bash
git clone https://github.com/dobleh16/HHweekplanner.git
cd HHweekplanner
```

2. Install dependencies:
```bash
npm install
```

3. Run local development server:
```bash
npm run dev
```

4. Build production distribution:
```bash
npm run build
```

---

## Firebase Hosting Deployment

Deploy the application dist bundle and Security Rules to Firebase:

```bash
npx firebase deploy --only firestore:rules,hosting
```

Live Application URL: https://hhweekplanner.web.app

---

## License

This project is maintained for personal productivity management.
