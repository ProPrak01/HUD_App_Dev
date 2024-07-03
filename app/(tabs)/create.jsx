import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, TextInput, Button, Image, Text } from "react-native";
import MapView, { Polyline, Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";

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
      <Image source={getArrowImage(maneuver)} style={{ width: 30, height: 30 }} />
      <Callout>
        <View>
          <Text>{maneuver}</Text>
          <Text>{distance}</Text>
        </View>
      </Callout>
    </Marker>
  );
};

const Create = () => {
  const [region, setRegion] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [destination, setDestination] = useState(null);
  const [destinationInput, setDestinationInput] = useState("");
  const mapRef = useRef(null);
  const [stepPoints, setStepPoints] = useState([]);

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setDestination({ latitude, longitude });
    setDestinationInput(`${latitude},${longitude}`);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const initialRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setRegion(initialRegion);
    })();
  }, []);

  const getRoute = async () => {
    if (region && destinationInput) {
      const origin = `${region.latitude},${region.longitude}`;
      const final = destinationInput;
      const apiKey = "AIzaSyAjHLF4WJrkfOMBCi-Hdnit7QC_fpepzSY";

      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${final}&key=${apiKey}`
        );
        const steps = response.data.routes[0].legs[0].steps;
        const points = steps.flatMap((step) => decode(step.polyline.points));
        setRouteCoordinates(points);

        const stepPoints = steps.map((step) => ({
          start_location: step.start_location,
          end_location: step.end_location,
          maneuver: step.maneuver,
          distance: step.distance,
        }));
        setStepPoints(stepPoints);
      } catch (error) {
        console.error(error);
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
});

export default Create;
