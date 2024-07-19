import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
  PermissionsAndroid,
} from "react-native";
import { BleManager } from "react-native-ble-plx";
import base64 from "base-64"; // Import the base-64 library

const manager = new BleManager();

const requestPermissions = async () => {
  if (Platform.OS === "android" && Platform.Version >= 23) {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]);
  }
};

const Create = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState(""); // State for the message
  const [connectedDevice, setConnectedDevice] = useState(null); // State for the connected device

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
        setConnectedDevice(null); // Reset connected device
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
      setConnectedDevice(null); // Reset connected device
    }
  };

  const writeCharacteristic = async (device, dataToWrite) => {
    try {
      // Replace these UUIDs with your actual service and characteristic UUIDs
      const serviceUUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
      const characteristicUUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

      // Discover all services and characteristics for the device
      await device.discoverAllServicesAndCharacteristics();

      // Convert message to Base64
      const base64Message = base64.encode(dataToWrite);

      // Write to the characteristic
      const characteristic =
        await device.writeCharacteristicWithResponseForService(
          serviceUUID,
          characteristicUUID,
          base64Message,
        );

      console.log("Write to characteristic successful", characteristic.value);
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
      scanAndConnect(); // If not connected, initiate scan and connection
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder="Enter message"
        value={message}
        onChangeText={setMessage}
      />
      <TouchableOpacity style={styles.button} onPress={handleSendMessage}>
        <Text style={styles.buttonText}>
          {isConnected ? "Send Message" : "Connect and Send Message"}
        </Text>
      </TouchableOpacity>
      <Text style={styles.connectedText}>
        {isConnected ? "Connected to ESP32" : "Not Connected"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
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
    marginTop: 20,
    fontSize: 16,
  },
});

export default Create;
