import React from "react";
import { StatusBar } from "expo-status-bar";
import { Alert, Button, StyleSheet, View, Platform } from "react-native";
import * as Notification from "expo-notifications";

Notification.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowAlert: true,
    };
  },
});

export default function App() {
  React.useEffect(() => {
    const configurePushNotification = async () => {
      const { status } = await Notification.getPermissionsAsync();
      let finalStatus = status;

      if (finalStatus !== "granted") {
        const { status } = await Notification.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert(
          "Permission required",
          "Push notifications need the appropriate permissions."
        );
        return;
      }

      if (Platform.OS === "android") {
        Notification.setNotificationCategoryAsync("default", {
          name: "default",
          importance: Notification.AndroidImportance.DEFAULT,
        });
      }

      const pushTokenData = await Notification.getExpoPushTokenAsync();

      // return pushTokenData;
    };

    configurePushNotification();
  }, []);

  React.useEffect(() => {
    const subscriptionUsual = Notification.addNotificationReceivedListener(
      (notification) => {
        const userName = notification.request.content.data.userName;
      }
    );

    const subscriptionResponse =
      Notification.addNotificationResponseReceivedListener((response) => {
        const userName = response.notification.request.content.data.userName;
      });
    return () => {
      subscriptionUsual.remove();
      subscriptionResponse.remove;
    };
  }, []);

  const scheduleNotitficationHandler = () => {
    Notification.scheduleNotificationAsync({
      content: {
        title: "My first local notification",
        body: "This is the body of the notofication",
        data: { userName: "Vova" },
      },
      trigger: {
        seconds: 2,
      },
    });
  };

  const sendPushNotification = () => {
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: "ExponentPushToken[****************]",
        title: "Test - sent from device!",
        body: "This is test!",
      }),
    });
  };

  return (
    <View style={styles.container}>
      <Button
        title="Scedule Notification"
        onPress={scheduleNotitficationHandler}
      />
      <Button title="Send Push Notification" onPress={sendPushNotification} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
