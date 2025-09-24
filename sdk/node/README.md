# A2A SDK for Node.js

SDK للتطبيقات الخارجية للتفاعل مع نظام A2A (Application-to-Application).

## التثبيت

```bash
npm install @auraos/a2a-sdk-node
```

## الاستخدام السريع

```javascript
import { A2AClient } from '@auraos/a2a-sdk-node';

// إنشاء عميل A2A
const client = new A2AClient({
  gatewayUrl: 'http://localhost:3001',
  apiKey: 'your_api_key_here'
});

// تسجيل الدخول
const authResult = await client.login('username', 'password');
console.log('تم تسجيل الدخول:', authResult.user);

// إرسال رسالة
const messageResult = await client.publishMessage('test.topic', {
  type: 'notification',
  target: 'telegram',
  payload: { message: 'Hello World!' }
});
console.log('تم إرسال الرسالة:', messageResult.messageId);

// الاتصال بـ WebSocket
await client.connectWebSocket();

// الاشتراك في موضوع
await client.subscribeWebSocket(['test.topic']);

// معالجة الرسائل الواردة
client.on('message', (message) => {
  console.log('رسالة واردة:', message);
});
```

## الوثائق الكاملة

راجع ملف [README-A2A-SYSTEM.md](../README-A2A-SYSTEM.md) للوثائق الكاملة.
