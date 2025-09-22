const admin = require('firebase-admin');
const fs = require('fs');

// تهيئة Firebase Admin
let db, systemStatusRef, buildsRef, debugSessionsRef, errorLogsRef;

// دالة تهيئة Firebase
function initializeFirebase() {
  try {
    // استخدام متغيرات البيئة أو ملف الخدمة
    if (
      process.env.FIREBASE_PRIVATE_KEY &&
      process.env.FIREBASE_PRIVATE_KEY !== 'YOUR_PRIVATE_KEY_HERE'
    ) {
      // استخدام متغيرات البيئة
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
        databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`,
        storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
      });
    } else if (fs.existsSync('./service-account-key.json')) {
      // استخدام ملف الخدمة (إذا كان موجود)
      const serviceAccount = require('./service-account-key.json');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`,
        storageBucket: `${serviceAccount.project_id}.appspot.com`,
      });
    } else {
      throw new Error(
        'No Firebase credentials found. Please set up Firebase configuration.'
      );
    }

    // تهيئة Firestore
    db = admin.firestore();

    // مراجع المجموعات
    systemStatusRef = db.collection('system').doc('status');
    buildsRef = db.collection('builds');
    debugSessionsRef = db.collection('debug-sessions');
    errorLogsRef = db.collection('error-logs');

    console.log('✅ Firebase Admin initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error.message);
    return false;
  }
}

// اختبار الاتصال
async function testConnection() {
  try {
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    await systemStatusRef.set({
      status: 'connected',
      timestamp: new Date().toISOString(),
      message: 'Firebase Admin connected successfully',
      version: '1.0.0',
    });

    console.log('✅ Firebase Admin connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Firebase connection test failed:', error.message);
    return false;
  }
}

// تهيئة Firebase عند تحميل الملف
const isInitialized = initializeFirebase();

module.exports = {
  admin,
  db: () => db,
  systemStatusRef: () => systemStatusRef,
  buildsRef: () => buildsRef,
  debugSessionsRef: () => debugSessionsRef,
  errorLogsRef: () => errorLogsRef,
  testConnection,
  isInitialized,
};
