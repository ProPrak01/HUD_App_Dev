import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  Image,
  Text,
  Platform,
  PermissionsAndroid,
  TouchableOpacity,
} from "react-native";
import { BleManager } from "react-native-ble-plx";
import base64 from "base-64";
const manager = new BleManager();

import MapView, { Polyline, Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
const requestPermissions = async () => {
  if (Platform.OS === "android") {
    if (Platform.Version >= 31) {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
    } else if (Platform.Version >= 23) {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);
    }
  }
};
const DirectionMarker = ({ coordinate, maneuver, distance }) => {
  const getArrowImage = (maneuver) => {
    switch (maneuver) {
      case "turn-slight-left":
        return require("../../assets/nav/turn-left.png");
      case "turn-slight-right":
        return require("../../assets/nav/turn-right.png");
      case "turn-left":
        return require("../../assets/nav/turn-hard-left.png");
      case "turn-right":
        return require("../../assets/nav/turn-hard-right.png");
      case "straight":
        return require("../../assets/nav/straight.png");
      default:
        return require("../../assets/nav/null.png");
    }
  };

  return (
    <Marker coordinate={coordinate}>
      <Image
        source={getArrowImage(maneuver)}
        style={{ width: 30, height: 30 }}
      />

      <Text>{maneuver}</Text>

      <Callout>
        <View>
          <Text>{maneuver}</Text>
          <Text>{distance}</Text>
        </View>
      </Callout>
    </Marker>
  );
};

const Bookmark = () => {
  const [region, setRegion] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [destination, setDestination] = useState(null);
  const [destinationInput, setDestinationInput] = useState("");
  const mapRef = useRef(null);
  const [stepPoints, setStepPoints] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [connectedDevice, setConnectedDevice] = useState(null);
  useEffect(() => {
    const checkProximity = () => {
      if (region && stepPoints.length > 0) {
        const { latitude, longitude } = region;

        console.log("Current location:", latitude, longitude);
        console.log("Step points:", stepPoints);

        for (const step of stepPoints) {
          const distance = getDistance(
            latitude,
            longitude,
            step.start_location.lat,
            step.start_location.lng,
          );

          console.log(`Distance to step ${step.maneuver}: ${distance} meters`);

          if (distance < 50) {
            if (!step.maneuver) {
              step.maneuver = "straight";
            }
            const message = `${step.maneuver}: ${step.distance.text}`;
            setMessage(message);
            console.log("Proximity message updated:", message);
            handleSendMessage();
            break;
          }
        }
      }
    };

    const interval = setInterval(checkProximity, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [region, stepPoints, connectedDevice]);

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in meters
  };
  useEffect(() => {
    requestPermissions();

    // Cleanup on component unmount
    return () => manager.destroy();
  }, []);
  useEffect(() => {
    const subscription = manager.onDeviceDisconnected(
      "deviceIdentifier",
      (error, device) => {
        if (error) {
          console.error(error);
          return;
        }
        console.log(`Device disconnected: ${device.name}`);
        setIsConnected(false);
        setConnectedDevice(null);
      },
    );

    return () => subscription.remove();
  }, []);
  const connectToDevice = async (device) => {
    try {
      const connected = await device.connect();
      console.log(`Connected to ${connected.name}`);
      setIsConnected(true);
      setConnectedDevice(connected);
      await connected.discoverAllServicesAndCharacteristics();
      return connected;
    } catch (error) {
      console.error("Connection failed", error);
      setIsConnected(false);
      setConnectedDevice(null);
    }
  };
  const writeCharacteristic = async (device, dataToWrite) => {
    try {
      const serviceUUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
      const characteristicUUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

      await device.discoverAllServicesAndCharacteristics();

      const base64Message = base64.encode(dataToWrite);

      await device.writeCharacteristicWithResponseForService(
        serviceUUID,
        characteristicUUID,
        base64Message,
      );

      console.log("Write to characteristic successful");

      // If you want to read the value after writing:
      const characteristic = await device.readCharacteristicForService(
        serviceUUID,
        characteristicUUID,
      );

      console.log(
        "Read characteristic value after write:",
        base64.decode(characteristic.value),
      );
    } catch (error) {
      console.error("Error writing to characteristic:", error);
    }
  };
  const scanAndConnect = () => {
    manager.startDeviceScan(null, null, async (error, device) => {
      if (error) {
        console.log(error);
        return;
      }

      if (device.name === "ESP32_BLE") {
        console.log(`Found device: ${device.name}`);
        manager.stopDeviceScan();
        const connectedDevice = await connectToDevice(device);
        if (connectedDevice) {
          await writeCharacteristic(connectedDevice, message);
        }
      }
    });
  };
  const handleSendMessage = () => {
    if (connectedDevice) {
      writeCharacteristic(connectedDevice, message);
    } else {
      scanAndConnect();
    }
  };
  // useEffect(() => {
  //   console.log("bluetooth Message updated:", message);
  //   handleSendMessage();
  // }, [message, connectedDevice]);

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setDestination({ latitude, longitude });
    setDestinationInput(`${latitude},${longitude}`);
  };

  useEffect(() => {
    const startWatchingLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      const watchId = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 5000 },
        (location) => {
          const { latitude, longitude } = location.coords;
          setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
          // Optionally update route coordinates based on the new location
          getRoute();
        },
      );

      return () => {
        watchId.remove();
      };
    };

    startWatchingLocation();

    return () => manager.destroy();
  }, []);
  // const getRoute = async () => {
  //   if (region && destinationInput) {
  //     const origin = `${region.latitude},${region.longitude}`;
  //     const final = destinationInput;
  //     const apiKey = "AIzaSyAjHLF4WJrkfOMBCi-Hdnit7QC_fpepzSY";

  //     try {
  //       const response = await axios.get(
  //         `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${final}&key=${apiKey}`,
  //       );
  //       const steps = response.data.routes[0].legs[0].steps;
  //       const points = steps.flatMap((step) => decode(step.polyline.points));
  //       setRouteCoordinates(points);

  //       const stepPoints = steps.map((step) => ({
  //         start_location: step.start_location,
  //         end_location: step.end_location,
  //         maneuver: step.maneuver,
  //         distance: step.distance,
  //       }));
  //       setStepPoints(stepPoints);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  // };
  const getRoute = async () => {
    if (region && destinationInput) {
      const origin = `${region.latitude},${region.longitude}`;
      const final = destinationInput;
      const apiKey = "OVqa5LrGSh9Jk2oSS8gL7UeqxHBBFNublmHWFSa0"; // Replace with your actual API key

      try {
        const response = await axios.post(
          `https://api.olamaps.io/routing/v1/directions?origin=${origin}&destination=${final}&api_key=${apiKey}`,
        );

        const route = response.data.routes[0];
        if (route) {
          const overviewPolyline = route.overview_polyline;
          const points = decode(overviewPolyline);
          setRouteCoordinates(points);

          const stepPoints = route.legs.flatMap((leg) =>
            leg.steps.map((step) => ({
              start_location: step.start_location,
              end_location: step.end_location,
              maneuver: step.maneuver,
              distance: step.readable_distance,
            })),
          );
          setStepPoints(stepPoints);
        }
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    }
  };

  const decode = (t, e) => {
    let d = [],
      n = 0,
      l = 0,
      r = 0,
      h = 0,
      i = 0,
      a = 0;

    while (i < t.length) {
      let o,
        u = 0,
        s = 0;

      do {
        o = t.charCodeAt(i++) - 63;
        u |= (31 & o) << s;
        s += 5;
      } while (o >= 32);

      n += u & 1 ? ~(u >> 1) : u >> 1;

      s = 0;
      u = 0;

      do {
        o = t.charCodeAt(i++) - 63;
        u |= (31 & o) << s;
        s += 5;
      } while (o >= 32);

      l += u & 1 ? ~(u >> 1) : u >> 1;

      d[r++] = { latitude: n * 1e-5, longitude: l * 1e-5 };
    }

    return d;
  };

  return (
    <View style={styles.container}>
      {region && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          showsUserLocation
          onPress={handleMapPress}
        >
          <Polyline coordinates={routeCoordinates} strokeWidth={5} />
          {destination && <Marker coordinate={destination} />}
          {stepPoints.map((step, index) => (
            <DirectionMarker
              key={index}
              coordinate={{
                latitude: step.start_location.lat,
                longitude: step.start_location.lng,
              }}
              maneuver={step.maneuver}
              distance={step.distance.text}
            />
          ))}
        </MapView>
      )}
      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          placeholder="Enter destination"
          value={destinationInput}
          onChangeText={(text) => setDestinationInput(text)}
        />
        <Button title="Get Route" onPress={getRoute} />
      </View>

      <Text style={styles.connectedText}>
        {isConnected ? "Connected to ESP32" : "Device Not Connected"}
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleSendMessage}>
        <Text style={styles.buttonText}>Pair</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  searchBox: {
    position: "absolute",
    top: 70,
    width: "90%",
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#555",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    flex: 1,
    padding: 0,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginLeft: 200,
    marginBottom: 40,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    paddingHorizontal: 20,
    textAlign: "center",
  },
  textInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    width: "80%",
  },
  connectedText: {
    fontSize: 16,
    marginLeft: 200,

    padding: 3,
    borderRadius: 20,
  },
});

export default Bookmark;
