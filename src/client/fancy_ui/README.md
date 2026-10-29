# Neue Benutzeroberfläche

Öffne `/fancy_ui/`, um diese eigenständige Benutzeroberfläche ohne Framework zu verwenden. Die ursprüngliche Oberfläche bleibt unter `/` verfügbar.

Die Oberfläche verwendet weiterhin `../js/TTT_logic_classes.js` und lädt den Socket.IO-Browserclient erst, wenn ein Online-Modus geöffnet wird. Standardmäßig wird eine Verbindung zum aktuellen Host auf Port `3000` hergestellt. Falls dein Socket.IO-Server eine andere Adresse verwendet, setze `window.TTT_SERVER_URL`, bevor `js/app.js` geladen wird.
