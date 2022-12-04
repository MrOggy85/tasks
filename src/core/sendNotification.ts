async function askForNotificationPermission() {
  if (Notification.permission === 'granted') {
    console.log('Notifications on!');
    return true;
  } else if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    console.log('Notification permission', permission);
    return permission === 'granted'
  }

  return false;
}

async function sendNotification(text: string) {
  if (Notification.permission === 'granted') {
    new Notification(text);
    return;
  }

  if (Notification.permission !== 'denied') {
    const hasPermission = await askForNotificationPermission()
    if (hasPermission) {
      new Notification(text);
      return;
    }
  }

  console.log('No notifcation sent. Persmission:', Notification.permission);
}

export default sendNotification;
