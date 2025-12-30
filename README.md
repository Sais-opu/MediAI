# MediAI

MediAI is a comprehensive healthcare management system built using the MERN stack. It focuses on secure authentication, admin activity monitoring, AI-powered doctor recommendations, and efficient emergency appointment handling. The frontend is powered by React with Vite for fast development and hot module replacement (HMR).

## Contributor
**MD Saidul Islam Apu**  
Project member

## Tech Stack
- **Language / Stack:** MERN (MongoDB, Express.js, React.js, Node.js)
- **Frontend Framework:** React.js (with Vite)
- **Styling:** Tailwind CSS, Daisy UI
- **Database:** MongoDB
- **DB Access:** Prisma, MongoDB Native Driver
- **Authentication:** JWT, Google OAuth
- **Real-Time Communication:** Socket.io, WebSocket
- **AI Search:** Google Gemini API
- **Deployment:** Vercel / Render

## Features
- User registration, login, and logout
- Secure password management with validation
- Role-based access control (Admin, Doctor, Patient/User)
- Admin activity logs and history tracking
- Real-time doctor search
- AI-powered doctor finder using Google Gemini API
- Emergency and on-call appointment system

## Authentication & Role-Based Access
This module handles secure Login, Logout, Registration, Password Management, Role-Based Access Control, and Google Authentication.

### User Registration & Validation
- Required fields: Name, Email, Date of Birth, Gender, Password
- Registration blocked if any field is missing or email format is invalid
- Duplicate handling: If user/email exists → notification (React Toastify/SweetAlert): “Account already exists. Try logging in.”

### Password Management
- Users must confirm current password to change it
- Error: “Current password doesn’t match.”
- Success: “Password updated successfully.” (session refreshed)
- Secure backend updates in the user collection

### Role-Based Access Control
- JWT decoded on login to determine role (Admin, Doctor, Patient/User)
- Restricted routes and permissions per role
- Unauthorized access → redirect to “403 – Access Denied” page

## Activity Logs & History (Admin-Focused)
Ensures transparency by logging critical actions (authentication, password changes, role modifications).

- Automatic log entry creation in dedicated collection
- Admin dashboard to view/filter logs by:
  - User (ID or name)
  - Date range (today, last week, custom)
  - Activity type (Login, Password Change, Role Modification)
- Dynamic table display: User ID, Action Type, Description, Timestamp
- Error handling:
  - “Unable to fetch logs. Try again later.”
  - “No logs found for the selected criteria.”

## Search & AI Doctor Finder
Helps patients quickly locate doctors using real-time search or natural language AI queries.

### Real-Time Search
- Instant suggestions by name or specialty (no Enter required)
- Grid layout results showing:
  - Name
  - Specialty
  - Ratings
  - Availability
  - Profile Link

### AI Doctor Finder (Google Gemini API)
- Natural language prompts supported (e.g., “Find a heart specialist near me” or “I have a kidney problem”)
- Extracts key terms → maps to specialties (e.g., “heart” → Cardiology)
- Returns relevant doctors with:
  - Name
  - Specialty
  - Location
  - Rating
  - Availability (e.g., “Available on Monday, Wednesday, Friday”)
- Error handling:
  - “No doctors found matching your search. Please try a different search term.”
  - “Something went wrong while fetching results. Please try again later.”

## Emergency & On-Call Appointments
- “Emergency Appointment” button bypasses standard scheduling
- Sends real-time alerts (Socket.io/WebSocket) to on-call doctors and admins
- Outcomes:
  - Accepted → patient assigned slot (visible to admin)
  - Rejected → marked as rejected

## Setup & Installation
(To be added once repository structure is finalized)

## Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## License
[MIT License](LICENSE) (or specify your preferred license)

---

**MediAI** – Making healthcare access smarter, faster, and more secure.
