# 🎓 InfoPlus App
InfoPlus is a school-management product: a React Native app for learners and school staff backed by an Express/MongoDB API.
Users authenticate, enter the app’s navigation, and access academic and administrative features such as assignments, attendance, results, events, schedules, payments, and complaints.
The backend also handles accounts, training formations, and email.
The excerpts support the server’s route registration, authentication/model interactions.

## 🧱 Architecture Overview

<img width="8450" height="13440" alt="diagram (5)" src="https://github.com/user-attachments/assets/4f1bd358-1b9f-4ae7-abc2-d8ea6c6ae1fa" />

## 📁 Structure

```
Directory structure:
└── nourchene-hamrita-infoplus/
    ├── backend/
    │   ├── index.js
    │   ├── package.json
    │   ├── controllers/
    │   │   ├── auth.js
    │   │   ├── emailController.js
    │   │   ├── event.js
    │   │   ├── formation.js
    │   │   ├── intern.js
    │   │   ├── paiement.js
    │   │   ├── reclamation.js
    │   │   ├── result.js
    │   │   └── user.js
    │   ├── models/
    │   │   ├── Company.js
    │   │   ├── Event.js
    │   │   ├── Formation.js
    │   │   ├── Intern.js
    │   │   ├── Paiement.js
    │   │   ├── Parent.js
    │   │   ├── Reclamation.js
    │   │   ├── Result.js
    │   │   ├── Teacher.js
    │   │   ├── Timetable.js
    │   │   └── User.js
    │   ├── routes/
    │   │   ├── assignments.js
    │   │   ├── auth.js
    │   │   ├── emailRoutes.js
    │   │   ├── events.js
    │   │   ├── formations.js
    │   │   ├── interns.js
    │   │   ├── paiement.js
    │   │   ├── reclamation.js
    │   │   ├── result.js
    │   │   ├── timetables.js
    │   │   └── users.js
    │   └── utils/
    │       ├── errors.js
    │       └── verifyToken.js
    └── infoPlus_App/
        ├── README.md
        ├── App.js
        ├── app.json
        ├── babel.config.js
        ├── Gemfile
        ├── index.js
        ├── jest.config.js
        ├── metro.config.js
        ├── package.json
        ├── react-native.config.js
        ├── tsconfig.json
        ├── .eslintrc.js
        ├── .prettierrc.js
        ├── .watchmanconfig
        ├── __tests__/
        │   └── App.test.tsx
        ├── android/
        │   ├── gradle.properties
        │   ├── gradlew
        │   ├── gradlew.bat
        │   ├── link-assets-manifest.json
        │   ├── app/
        │   │   ├── debug.keystore
        │   │   ├── proguard-rules.pro
        │   │   └── src/
        │   │       ├── debug/
        │   │       │   ├── AndroidManifest.xml
        │   │       │   └── java/
        │   │       │       └── com/
        │   │       │           └── infoplus_app/
        │   │       │               └── ReactNativeFlipper.java
        │   │       ├── main/
        │   │       │   ├── AndroidManifest.xml
        │   │       │   ├── java/
        │   │       │   │   └── com/
        │   │       │   │       └── infoplus_app/
        │   │       │   │           ├── MainActivity.java
        │   │       │   │           └── MainApplication.java
        │   │       │   └── res/
        │   │       │       ├── drawable/
        │   │       │       │   └── rn_edit_text_material.xml
        │   │       │       └── values/
        │   │       │           ├── strings.xml
        │   │       │           └── styles.xml
        │   │       └── release/
        │   │           └── java/
        │   │               └── com/
        │   │                   └── infoplus_app/
        │   │                       └── ReactNativeFlipper.java
        │   └── gradle/
        │       └── wrapper/
        │           └── gradle-wrapper.properties
        ├── components/
        │   ├── CustomDrawer.js
        │   ├── KeyboardAvoiding.js
        │   └── styles.js
        ├── constants/
        │   ├── Animations.js
        │   ├── icons.js
        │   ├── images.js
        │   ├── index.js
        │   └── theme.js
        ├── context/
        │   └── AuthContext.js
        ├── hooks/
        │   └── useFetch.js
        ├── ios/
        │   ├── link-assets-manifest.json
        │   ├── Podfile
        │   ├── .xcode.env
        │   ├── InfoPlus_App/
        │   │   ├── AppDelegate.h
        │   │   ├── AppDelegate.mm
        │   │   ├── Info.plist
        │   │   ├── LaunchScreen.storyboard
        │   │   ├── main.m
        │   │   └── Images.xcassets/
        │   │       ├── Contents.json
        │   │       └── AppIcon.appiconset/
        │   │           └── Contents.json
        │   └── InfoPlus_AppTests/
        │       ├── Info.plist
        │       └── InfoPlus_AppTests.m
        ├── navigators/
        │   ├── AppStack.js
        │   ├── AuthStack.js
        │   ├── RootStack.js
        │   └── tabs.js
        ├── redux/
        │   ├── action.js
        │   ├── reducer.js
        │   └── store.js
        ├── screens/
        │   ├── Home.js
        │   ├── index.js
        │   ├── InternsList.js
        │   ├── Login.js
        │   ├── Paiement.js
        │   ├── Profile.js
        │   ├── Rate.js
        │   ├── Search.js
        │   ├── SignUp.js
        │   ├── TimeTable.js
        │   ├── Welcome.js
        │   ├── Announcements/
        │   │   ├── AddAnnouncement.js
        │   │   ├── Announcement.js
        │   │   └── AnnouncementByClass.js
        │   ├── Assignments/
        │   │   ├── Assignment.js
        │   │   ├── AssignmentByClass.js
        │   │   └── AssignmentDetail.js
        │   ├── Attendance/
        │   │   ├── Attendance.js
        │   │   └── AttendanceList.js
        │   ├── Events/
        │   │   ├── DetailEvent.js
        │   │   └── ViewAll.js
        │   ├── Reclamations/
        │   │   ├── Reclamation.js
        │   │   └── ReclamationsList.js
        │   └── Results/
        │       └── Result.js
        └── utils/
            ├── config.js
            └── date.js


