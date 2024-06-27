import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TextInput, Button } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';

const Create = () => {
  const [region, setRegion] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [destination, setDestination] = useState('');
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
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
    if (region) {
      const origin = `${region.latitude},${region.longitude}`;
      const apiKey = 'AIzaSyB0zs1nX0J0-gzA0UybHdVF2DLQCtr-K-k';

      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}`
        );
        const points = decode(response.data.routes[0].overview_polyline.points);
        setRouteCoordinates(points);
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
        >
          <Polyline coordinates={routeCoordinates} strokeWidth={5} />
        </MapView>
      )}
      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          placeholder="Enter destination"
          value={destination}
          onChangeText={setDestination}
        />
        <Button title="Get Route" onPress={getRoute} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  searchBox: {
    position: 'absolute',
    top: 40,
    width: '90%',
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#000',
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
