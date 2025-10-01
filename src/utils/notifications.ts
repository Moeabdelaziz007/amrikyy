export function requestNotificationPermission() {
  if (!('Notification' in window)) {
    return;
  }
  if (Notification.permission !== 'denied') {
    Notification.requestPermission();
  }
}

export function showNotification(title: string, body: string) {
  if (Notification.permission === 'granted') {
    new Notification(title, { body });
  }
}
// Keep this file focused on notifications only

