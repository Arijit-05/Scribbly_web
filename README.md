# Scribbly - Web App

A modern, responsive web application for managing notes with Firebase integration. This app allows users to create, edit, organize, and sync their notes across devices.

## Features

- 🔐 **User Authentication**: Sign up and sign in with email/password
- 📝 **Note Management**: Create, edit, and delete notes
- 🏷️ **Labels**: Organize notes with custom labels
- 📌 **Pin Notes**: Pin important notes to the top
- 🎨 **Color Coding**: Choose from 12 different background colors
- ☑️ **Checklists**: Add interactive checklists to your notes
- 🔍 **Filtering**: Filter notes by labels
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- ☁️ **Cloud Sync**: All data is synced with Firebase

## Screenshots
<img width="1920" height="1080" alt="Screenshot (4)" src="https://github.com/user-attachments/assets/41311bc3-01c3-488e-bd5a-953e4238c1a3" />
<img width="1920" height="1080" alt="Screenshot (3)" src="https://github.com/user-attachments/assets/a4704ba3-1a31-4ff0-89f5-46f5bc81729c" />
<img width="1920" height="1080" alt="Screenshot (2)" src="https://github.com/user-attachments/assets/734def03-609f-4d3c-ad89-bb8274641993" />


## Tech Stack

- **Frontend**: React 19, Material-UI
- **Backend**: Firebase (Authentication, Firestore)
- **Routing**: React Router DOM
- **State Management**: React Context API

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd scribbly
```

### 2. Install Dependencies
```bash
npm install
```

### 5. Run the Application
```bash
npm start
```

The application will open at `http://localhost:3000`

## Usage

### Authentication
- Sign up with your email and password
- Sign in with your credentials
- Your session will persist until you log out

### Creating Notes
1. Click the floating "+" button to create a new note
2. Add a title and content
3. Choose a background color
4. Add labels for organization
5. Create checklist items if needed
6. Pin the note if it's important
7. Click "Create" to save

### Managing Notes
- **Edit**: Click the edit icon on any note
- **Delete**: Click the delete icon (with confirmation)
- **Pin**: Use the pin checkbox in the note editor
- **Filter**: Use the label filter dropdown to show specific notes

### Labels
- Add labels while creating or editing notes
- Labels are automatically saved to your account
- Use the filter dropdown to show notes with specific labels

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
