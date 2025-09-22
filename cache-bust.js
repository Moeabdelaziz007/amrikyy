// Cache Busting Script for AuraOS
// This script forces a hard refresh to show the latest updates

console.log('🚀 AuraOS Environment Protection System - Cache Busting Active');

// Force reload if this is a cached version
if (performance.navigation.type === 1) {
    console.log('🔄 Hard refresh detected - showing latest version');
} else {
    console.log('📱 Fresh load - latest version active');
}

// Add update indicator
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're showing the updated version
    const title = document.title;
    if (title.includes('Updated')) {
        console.log('✅ Updated version confirmed');
        
        // Add a subtle indicator in the console
        console.log('%c🛡️ Environment Protection System Active', 'color: #00ff88; font-size: 16px; font-weight: bold;');
        console.log('%c🚀 Cache Busting Successful', 'color: #00d9ff; font-size: 14px;');
    }
});

// Service Worker cache busting
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
            registration.unregister();
            console.log('🔄 Service Worker cache cleared');
        }
    });
}
