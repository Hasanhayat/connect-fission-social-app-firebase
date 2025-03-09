# Connect-Fission-Social-App-Firebase

Connect-Fission is a modern and interactive social media application built using React.js and powered by Firebase for backend services. This app allows users to connect, share posts, and interact with others in real-time while offering a sleek and responsive user interface.

## 🚀 Features

- **User Authentication:** Secure sign-up and login with Firebase Authentication.
- **Post Creation:** Users can create, edit, and delete posts.
- **Real-Time Data:** Fetch and update posts in real-time using Firebase Firestore.
- **User Profiles:** Customizable user profiles with unique content.
- **Responsive Design:** Fully responsive UI built with Material-UI (MUI).
- **Alerts & Notifications:** Smooth user feedback using SweetAlert for popups.

## 🛠️ Tech Stack

- **Frontend:** React.js, React Router, Material-UI (MUI)
- **Backend:** Firebase (Firestore, Authentication, Analytics)
- **State Management:** React Context API
- **Notifications:** SweetAlert
- **Icons:** Material-UI Icons

## 📂 Project Structure

```
Connect-Fission-Social-App-Firebase/
├── public/
├── src/
│   ├── components/        # Reusable UI components (Navbar, PostCard, etc.)
│   ├── context/           # Global Context (Auth & Theme Management)
│   ├── pages/             # Page components (Home, Signup, Login, etc.)
│   ├── App.js             # Main application file
│   └── main.js            # Application entry point
└── package.json
```

## 📦 Installation

1. Clone the repository:

```bash
   git clone https://github.com/your-username/Connect-Fission-Social-App-Firebase.git
   cd Connect-Fission-Social-App-Firebase
```

2. Install dependencies:

```bash
   npm install
```

3. Set up Firebase:

- Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
- Add your Firebase configuration to `firebaseConfig` in `App.js`.

4. Start the development server:

```bash
   npm run dev
```

## 🔐 Environment Variables

Ensure you configure your Firebase credentials in the project. Replace the values in `firebaseConfig` with your project details:

```javascript
const firebaseConfig = {
   apiKey: "YOUR_API_KEY",
   authDomain: "YOUR_AUTH_DOMAIN",
   projectId: "YOUR_PROJECT_ID",
   storageBucket: "YOUR_STORAGE_BUCKET",
   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
   appId: "YOUR_APP_ID",
   measurementId: "YOUR_MEASUREMENT_ID"
};
```

## 📌 Upcoming Features

- Comment System
- Follow/Unfollow Users
- Image Uploads
- Push Notifications

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repository and create a pull request.

## 📄 License

This project is licensed under the MIT License.

## 🌟 Acknowledgements

Special thanks to the open-source community and Firebase for their amazing tools and resources.

---

Built with 💙 by Hassan Hayat


