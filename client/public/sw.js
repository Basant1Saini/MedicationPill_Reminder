self.addEventListener('push', (e) => {
  const data = e.data?.json() || { title: 'Pill Reminder', body: 'Time to take your medication' }
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/favicon.ico',
    })
  )
})

self.addEventListener('notificationclick', (e) => {
  e.notification.close()
  e.waitUntil(clients.openWindow('/'))
})
