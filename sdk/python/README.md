# A2A SDK for Python

SDK للتطبيقات الخارجية للتفاعل مع نظام A2A (Application-to-Application).

## التثبيت

```bash
pip install -r requirements.txt
```

## الاستخدام السريع

```python
import asyncio
from a2a_client import A2AClient, A2AConfig

async def main():
    # إنشاء عميل A2A
    config = A2AConfig(
        gateway_url="http://localhost:3001",
        api_key="your_api_key_here"
    )
    
    async with A2AClient(config) as client:
        # تسجيل الدخول
        auth_result = await client.login('username', 'password')
        print('تم تسجيل الدخول:', auth_result['user'])
        
        # إرسال رسالة
        message_result = await client.publish_message(
            topic='test.topic',
            message_type='notification',
            target='telegram',
            payload={'message': 'Hello World!'}
        )
        print('تم إرسال الرسالة:', message_result['messageId'])
        
        # الاتصال بـ WebSocket
        await client.connect_websocket()
        
        # الاشتراك في موضوع
        await client.subscribe_websocket(['test.topic'])
        
        # معالجة الرسائل الواردة
        client.on_message = lambda message: print('رسالة واردة:', message)
        
        # انتظار الرسائل
        await asyncio.sleep(10)

if __name__ == "__main__":
    asyncio.run(main())
```

## الوثائق الكاملة

راجع ملف [README-A2A-SYSTEM.md](../README-A2A-SYSTEM.md) للوثائق الكاملة.
