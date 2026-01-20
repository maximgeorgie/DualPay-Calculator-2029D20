// pwa-install.js
// Handles beforeinstallprompt, install button UI and service worker registration.
// Keeps the logic separate from your main UI script.

(function () {
  const installBtn = document.getElementById('installBtn');
  let deferredPrompt = null;

  // Listen for beforeinstallprompt and save the event for later
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the browser from showing the mini-infobar
    e.preventDefault();
    deferredPrompt = e;
    // Show the install button in the UI
    if (installBtn) {
      installBtn.style.display = 'inline-block';
    }
    console.log('beforeinstallprompt captured');
  });

  // Handle the click on the install button
  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (!deferredPrompt) {
        alert('За да инсталирате: използвайте "Add to Home Screen" в менюто на браузъра.');
        return;
      }
      // Show the prompt
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      console.log('User install choice:', choice);
      // Reset
      deferredPrompt = null;
      installBtn.style.display = 'none';
    });
  }

  // Optional: react to appinstalled event
  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    if (installBtn) installBtn.style.display = 'none';
  });

  // Register service worker from root (relative path). File must be at repo root.
  if ('serviceWorker' in navigator) {
    // prefer explicit filename service-worker.js
    navigator.serviceWorker.register('./service-worker.js')
      .then(reg => {
        console.log('Service worker registered with scope:', reg.scope);
      })
      .catch(err => {
        console.warn('Service worker registration failed:', err);
      });
  }
})();
