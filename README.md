# PromptDump.io

A modern AI prompt sharing platform built with React, TypeScript, and Firebase.

## Live Demo
Visit [https://promptdump-io.web.app](https://promptdump-io.web.app) (soon: [promptdump.io](https://promptdump.io))

## Features
- 🚀 Modern, responsive UI with Matrix-inspired design
- 🔐 Secure authentication with Firebase
- 💾 Real-time data with Firestore
- 📁 File storage with Firebase Storage
- ⚡ Fast and optimized with Vite
- 🎨 Styled with Tailwind CSS
- 🎬 Smooth animations with Framer Motion

## Tech Stack
- React + TypeScript
- Firebase (Auth, Firestore, Storage)
- Vite
- Tailwind CSS
- Framer Motion
- Lucide Icons

## Prerequisites
- Node.js 18 or higher
- npm or yarn
- Firebase account

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/promptdumpdotio.git
cd promptdumpdotio
```

2. Install dependencies:
```bash
npm install
```

3. Create a Firebase project:
- Go to [Firebase Console](https://console.firebase.google.com)
- Create a new project
- Enable Authentication, Firestore, and Storage
- Get your Firebase configuration

4. Set up environment variables:
```bash
cp .env.example .env.local
```
Then fill in your Firebase configuration values in `.env.local`

5. Start the development server:
```bash
npm run dev
```

## Deployment

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase:
```bash
firebase init
```
Select:
- Firestore
- Hosting
- Storage

4. Build and deploy:
```bash
npm run build
firebase deploy
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Firebase Configuration

The project uses Firebase for:
- Authentication
- Firestore Database
- Storage
- Hosting

Security rules are configured for:
- Public read access
- Authenticated write access
- User-specific content protection
- File size and type restrictions

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
