import React, { useEffect, useState } from "react";
import base64 from "base-64";

import {
  PermissionsAndroid,
  Platform,
  View,
  Text,
  Button,
  FlatList,
  NativeEventEmitter,
} from "react-native";
import { BleManager, Device } from "react-native-ble-plx";
import { NativeModules } from "react-native";

const Create = () => {
  // const manager = new BleManager();
  //const eventEmitter = new NativeEventEmitter(NativeModules.BleManager);
  const [devices, setDevices] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(false);
  let bleManager = new BleManager();
  const Base64 = {
    encode: (input) => base64.encode(input),
    decode: (input) => base64.decode(input),
  };
  useEffect(() => {
    requestBluetoothPermission();

    return () => {
      stopScan();
      bleManager.destroy();
    };
  }, []);

  const requestBluetoothPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);

      if (
        granted["android.permission.ACCESS_FINE_LOCATION"] !== "granted" ||
        granted["android.permission.BLUETOOTH_SCAN"] !== "granted" ||
        granted["android.permission.BLUETOOTH_CONNECT"] !== "granted"
      ) {
        console.error("Required permissions not granted!");
      }
    }
  };

  const startScan = () => {
    setScanning(true);
    setDevices([]); // Clear the devices list before starting a new scan
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error("Error scanning:", error);
        return;
      }
      if (device) {
        setDevices((prevDevices) => {
          // Check if the device is already in the list
          const deviceExists = prevDevices.some((d) => d.id === device.id);

          // Only add the device if it doesn't already exist
          if (!deviceExists) {
            return [...prevDevices, device];
          }

          // If the device already exists, return the previous array unchanged
          return prevDevices;
        });
      }
    });
  };

  const stopScan = () => {
    setScanning(false);
    bleManager.stopDeviceScan();
  };

  const connectToDevice = async (device) => {
    try {
      const connectedDevice = await device.connect();
      setConnectedDevice(connectedDevice);

      // Discover services and characteristics
      const discoveredDevice =
        await connectedDevice.discoverAllServicesAndCharacteristics();

      // You might want to save the discovered services and characteristics
      setConnectedDevice(discoveredDevice);

      console.log("Connected to", discoveredDevice.name);
    } catch (error) {
      console.error("Error connecting to device:", error);
    }
  };
  const sendDataToESP32 = async (data) => {
    if (!connectedDevice) {
      console.error("No device connected");
      return;
    }

    try {
      // Replace these UUIDs with your ESP32's service and characteristic UUIDs
      const serviceUUID = "YOUR_SERVICE_UUID";
      const characteristicUUID = "YOUR_CHARACTERISTIC_UUID";

      const service = await connectedDevice
        .services()
        .then((services) =>
          services.find((service) => service.uuid === serviceUUID),
        );

      if (!service) {
        console.error("Service not found");
        return;
      }

      const characteristic = await service
        .characteristics()
        .then((characteristics) =>
          characteristics.find((c) => c.uuid === characteristicUUID),
        );

      if (!characteristic) {
        console.error("Characteristic not found");
        return;
      }

      // Convert the data to Base64 encoding
      const dataBase64 = Base64.encode(data);

      // Write the data to the characteristic
      await characteristic.writeWithResponse(dataBase64);
      console.log("Data sent successfully");
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  const renderDeviceItem = ({ item }) => (
    <View style={{ padding: 10 }}>
      <Text>{item.name || "Unnamed Device"}</Text>
      <Text>{item.id}</Text>
      <Text>{item.rssi}</Text>
      <Button
        title="Connect"
        disabled={!!(connectedDevice && connectedDevice.id === item.id)}
        onPress={() => connectToDevice(item)}
      />
    </View>
  );

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <FlatList
        data={devices}
        renderItem={renderDeviceItem}
        keyExtractor={(item) => item.id}
        style={{ marginTop: 20 }}
      />
      <Button
        title={scanning ? "Stop Scanning" : "Start Scanning"}
        onPress={() => (scanning ? stopScan() : startScan())}
      />
      <Button
        title="Send Data to ESP32"
        onPress={() => sendDataToESP32("Hello ESP32!")}
        disabled={!connectedDevice}
      />
    </View>
  );
};

export default Create;
