# Flight Board App

This project is a Flight Board application that provides real-time flight updates.


- **Backend**: .NET Core 8.0
  • Uses Entity Framework with SQLite  
  • Exposes RESTful endpoints via controllers  
  • Provides real-time notifications using SignalR For Added and Deleted Flights
  
- 	*EndPoints*:
	• GET /flights Retrieves flights with optional filtering (by status or destination).
	• POST /flights Adds a new flight record with proper validations.
	• DELETE /flights/{id} Deletes (or marks as deleted) a flight based on its ID.
  
  -** Examples: **
  able to run test from FlightBoard.http file 
  
  
- **Frontend**: React + Vite + TS
  • Consumes backend APIs and SignalR endpoints  
  • Uses Material-UI components, Emotion, and SCSS for styling




- *External NPM Dependencies*:

@emotion/styled	^11.14.0 - CSS-in-JS styling solution for React components.
@microsoft/signalr	^8.0.7 - For real-time communication using SignalR.
@mui/icons-material	^7.0.2 - Material Design icons for UI elements.
@mui/material	^7.0.2 - A library of React components based on Material UI.
@mui/x-date-pickers	^8.0.0 - Provides date picker components for improved UX.
dayjs	^1.11.13 - Lightweight library for managing dates/times.
formik	^2.4.6 - For handling form state and validation.
react	^19.0.0 - Core library for building React applications.
react-dom	^19.0.0 - For rendering React components in the DOM.
react-router-dom	^7.5.0 - Provides routing for React apps.
sass	^1.86.3 - Enables SCSS styling support.

---

## Features

- **Real-Time Updates**: SignalR hub notifies connected clients when flights are added or deleted.  
- **RESTful API Endpoints**: Manage flights with GET, POST, and DELETE endpoints.  
- **SQLite Database**: Lightweight database configured via EF Core.  
- **CORS Enabled**: Only Allows the origin http://localhost:5173 to access APIs.  
- **Modern UI**: The React client leverages Material-UI, Formik, Day.js

---

## Prerequisites

- [.NET Core SDK 8.0+](https://dotnet.microsoft.com/download)
- [Node.js v19+](https://nodejs.org/)
- [SQLite](https://www.sqlite.org/index.html)


---

## Backend Setup

The application is configured to use controllers, EF Core with SQLite, scoped services, and SignalR. 
CORS and logging are also enabled. The server exposes its REST endpoints on `/api/flights` and the SignalR hub on `/api/connect`.

1. inside back folder go to FlightBoard Folder and run the .sln file in Visual Studio.
2. run https profile debugger in Visual Studio.
3. this will run on Secure https:
	https://localhost:7233
4. if sqlite DB not exists or Flights Table not exists, On First Run - they will be created.
	
## FrontEnd Setup
1. inside Front folder, run: npm i - to install all npm packages.
2. run npm start
3. this will run on:
	http://localhost:5173