import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { microRepairPlan } from "../data/trainingPlans";

const WEEKDAY_REMINDER_TIMES = [
  { hour: 10, minute: 20 },
  { hour: 14, minute: 20 },
  { hour: 16, minute: 20 }
];

const SEDENTARY_CHANNEL_NAME = "Sedentary repair";
const SEDENTARY_TITLE = "3-minute posture reset";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
});

export async function registerSedentaryReminderNotifications() {
  const permission = await Notifications.getPermissionsAsync();
  const finalPermission =
    permission.status === "granted" ? permission : await Notifications.requestPermissionsAsync();

  if (finalPermission.status !== "granted") {
    return [];
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("sedentary-repair", {
      name: SEDENTARY_CHANNEL_NAME,
      importance: Notifications.AndroidImportance.DEFAULT
    });
  }

  await cancelSedentaryReminderNotifications();

  const identifiers: string[] = [];
  for (const weekday of [2, 3, 4, 5, 6]) {
    for (const time of WEEKDAY_REMINDER_TIMES) {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: SEDENTARY_TITLE,
          body: microRepairPlan.items.join(" / "),
          data: { type: "sedentary-repair", weekday, ...time }
        },
        trigger: {
          weekday,
          hour: time.hour,
          minute: time.minute,
          repeats: true,
          channelId: "sedentary-repair"
        }
      });
      identifiers.push(id);
    }
  }

  return identifiers;
}

export async function cancelSedentaryReminderNotifications() {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const sedentaryNotifications = scheduled.filter(
    (notification) => notification.content.data?.type === "sedentary-repair"
  );

  await Promise.all(
    sedentaryNotifications.map((notification) =>
      Notifications.cancelScheduledNotificationAsync(notification.identifier)
    )
  );
}
