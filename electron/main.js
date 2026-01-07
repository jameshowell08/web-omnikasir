const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        icon: path.join(__dirname, '../public/assets/omnikasir-png.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    // Remove the default menu bar
    mainWindow.setMenu(null);

    const appUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../.next/server/pages/index.html')}`;

    // In production, you might want to serve static files differently or use a custom protocol.
    // For this setup, we primarily target the dev experience wrapper or a simple build wrapper.

    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
    } else {
        // Fallback for production build loading
        // Note: Next.js by default does simple SSR. To run in true offline mode requires 'next export' (now 'output: export')
        // OR carrying the server with us.
        // For now, let's assume we load the localhost URL even in prod if we bundle the server,
        // or we might look for a static file if 'output: export' is used.

        // Attempt to load from the .next folder (roughly) or a packaged URL.
        // Realistically for a robust app, we'd use 'serve' or similar to spawn the next server.
        // But commonly, people use electron-serve or similar.
        // Let's stick to the basic "loadURL" for dev and a place holder for prod.

        mainWindow.loadURL('http://localhost:3000'); // Assuming server is started separately for now in prod too
    }
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
