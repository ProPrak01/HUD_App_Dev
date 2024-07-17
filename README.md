# HUD App Report

## Introduction

This report provides an overview of the development of a navigation app built using React Native with Expo, Google Maps API for real-time navigation, and Appwrite for backend services. The app provides real-time routing and direction guidance, similar to Google Maps.

## Prerequisites

Before starting the development, the following prerequisites were ensured:

- Node.js and npm were installed.
- Expo CLI was installed globally.
- A Google Cloud account was created for obtaining API keys.
- An Appwrite server was set up for backend services.

## Project Setup

A new Expo project was created and necessary dependencies were installed:

```sh
npx create-expo-app 
cd hud-app
npm install expo-location @react-native-maps axios appwrite ...dependencies below
```
## Dependencies
The following dependencies were used in the project:
```sh
    "@react-native-community/geolocation": "^3.2.1",
    "axios": "^1.7.2",
    "expo": "~51.0.14",
    "expo-constants": "~15.4.5",
    "expo-font": "^11.10.3",
    "expo-linking": "~6.2.2",
    "expo-location": "^17.0.1",
    "expo-router": "~3.4.8",
    "expo-status-bar": "~1.11.1",
    "nativewind": "^2.0.11",
    "react": "18.2.0",
    "react-native": "0.73.6",
    "react-native-appwrite": "^0.2.2",
    "react-native-maps": "^1.15.6",
    "react-native-safe-area-context": "4.8.2",
    "react-native-screens": "~3.29.0",
    "react-native-splash-screen": "^3.3.0",
    "react-native-url-polyfill": "^2.0.0"
```
## Dev Preview:

Dev->
(the following images are old and not updated yet)

![](images/dev.png)
<img src="images/1.PNG" width="200">
<img src="images/2.PNG" width="200">
<img src="images/3.PNG" width="200">
<img src="images/4.PNG" width="200">
<img src="images/auth.jpg" width="200">
<img src="images/auth2.jpg" width="200">

# Navigation Methodology and API Description
## Navigation Methodology
The navigation functionality in the app revolves around real-time routing and direction guidance using a combination of client-side and server-side technologies. Here’s an overview of the methodology:

## User Location Tracking:

The app continuously monitors the user's location using expo-location, which provides access to the device's GPS and sensors.
Updates to the user's location are handled in real-time to ensure accurate positioning.
Route Calculation:

When the user sets a destination, the app makes a request to the Google Directions API to calculate the optimal route.
The API returns a detailed polyline encoding the route and step-by-step navigation instructions.
Route Display:

The decoded polyline is displayed on the map using @react-native-maps, providing a visual representation of the route.
Various map features such as markers, overlays, and animations enhance the user experience.
Turn-by-Turn Navigation:

## Instructions for navigating the route are extracted from the Directions API response.

The app tracks the user's progress along the route and displays turn-by-turn instructions in real-time.
Instructions include actions like "continue straight," "turn left," "turn right," and other relevant guidance based on the user's current location and the upcoming route segment.
Google Maps API
The Google Maps API is central to the navigation functionality of the app:

## Maps JavaScript API:

Used for displaying interactive maps within the app interface.
Provides customization options for map styles, markers, and overlays.
## Directions API:

Used for calculating routes between locations.
Returns detailed information including step-by-step directions, distance, duration, and encoded polylines representing the route.
## Geocoding API: (will be used !)

Converts addresses (geocoding) and geographic coordinates (reverse geocoding) into readable location data and vice versa.
Used for converting user inputs (like destination addresses) into coordinates for routing purposes.
Distance Matrix API:

Calculates travel distances and times between multiple origins and destinations.
Useful for estimating travel durations based on current traffic conditions or multiple waypoints.

# Appwrite Integration Summary

## Overview

This document outlines the integration of Appwrite into a React Native application for user authentication and database operations.

## Configuration

Appwrite is configured with:

- Endpoint: `https://cloud.appwrite.io/v1`
- Platform: `com.aora.appwrite`
- Project ID: `661eeae85bb09be2ff9f`
- Database ID: `661eec975d86062d3bab`
- User Collection ID: `661eecd75d64463ecb33`

## Functionality

### User Management

#### Create User

The `createUser` function registers a new user with Appwrite, storing user details in a designated collection.

#### Sign In

The `signIn` function authenticates a user with their email and password, creating a session for further authenticated actions.

#### Get Current User

The `getCurrentUser` function retrieves details of the currently authenticated user from the Appwrite database.

## Global Context Provider

A global context provider manages Appwrite functionality across the app, including user authentication and state management.

## Conclusion

This integration enables secure user authentication and database operations within the React Native application using Appwrite, enhancing overall application functionality and user experience.
# Wireframe Description

## Overview

The wireframe for the navigation app is designed using Figma to visualize the user interface and navigation flow.

link :
```sh
https://www.figma.com/design/skFikHWeFmrpeCREgsdrwQ/HUD-APP-WIREFRAME?node-id=0-727&t=tgPQuN7jDg3gzGhI-0
```
## Key Components

1. **Home Screen:**
   - Displays a map view with options to set a destination and initiate navigation.

2. **Navigation Interface:**
   - Shows real-time route information, including turn-by-turn directions and estimated time of arrival (ETA) -> sending data to IOT.

3. **User Profile:**
   - Provides access to user settings, saved locations, and navigation history.

4. **Authentication Screens:**
   - Includes screens for user login, registration, and password recovery using Appwrite for backend authentication.
5. **IOT Screens:**
   - The IOT interface tells of all the info related to current device connected/disconnected.

## Navigation Flow
- Users start at the Home Screen, where they can enter a destination address or select from saved locations.
- Upon starting navigation, the app displays the route on the map and provides voice-guided turn-by-turn directions.
- The navigation interface updates dynamically based on the user's location and upcoming maneuvers. and sends the data to IOT
- The IOT interface tells of all the info related to current device connected/disconnected. 
- User profile screens allow customization of settings, managing saved locations, and viewing navigation history.

## Conclusion

The wireframe in Figma provides a blueprint for designing and implementing a user-friendly HUD app interface, ensuring intuitive interaction and efficient navigation experience.


    
