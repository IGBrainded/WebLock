const { spawn } = require('child_process');
const path = require('path');

// Define the paths to your different pages

const pages = [
    { path: 'Bruteforce/app.js', port: 3001 },
    { path: 'SQLi/app.js', port: 3002 },
    { path: 'File_Upload/app.js', port: 3003 },
    // Add other pages with unique port numbers
];

/* 
const pages = [
  { path: 'SQLi/app.js', port: 3002 },
  { path: 'Bruteforce/app.js', port: 3001 },
  // Add other pages with unique port numbers
];
*/

// Function to start each page as a separate process
function startPage(page) {
    const pageAbsolutePath = path.resolve(__dirname, page.path);
    const process = spawn('node', [pageAbsolutePath]);

    process.stdout.on('data', (data) => {
        console.log(`[${page.path}] ${data}`);
    });

    process.stderr.on('data', (data) => {
        console.error(`[${page.path}] ${data}`);
    });

    process.on('close', (code) => {
        console.log(`[${page.path}] Child process exited with code ${code}`);
    });
}

// Start each page
pages.forEach(startPage);
