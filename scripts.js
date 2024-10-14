document.addEventListener("DOMContentLoaded", function () {
    // Display for frame rate
    const frameRateDisplay = document.createElement("div");
    frameRateDisplay.style.position = "absolute";
    frameRateDisplay.style.top = "10px";
    frameRateDisplay.style.right = "10px";
    frameRateDisplay.style.padding = "10px";
    frameRateDisplay.style.backgroundColor = "#000";
    frameRateDisplay.style.color = "#fff";
    frameRateDisplay.style.fontSize = "16px";
    frameRateDisplay.style.zIndex = 1000;
    document.body.appendChild(frameRateDisplay);

    // Display for click data
    const clickDataDisplay = document.createElement("div");
    clickDataDisplay.style.position = "absolute";
    clickDataDisplay.style.top = "40px"; // Adjust position below the frame rate display
    clickDataDisplay.style.right = "10px";
    clickDataDisplay.style.padding = "10px";
    clickDataDisplay.style.backgroundColor = "#000";
    clickDataDisplay.style.color = "#fff";
    clickDataDisplay.style.fontSize = "16px";
    clickDataDisplay.style.zIndex = 1000;
    document.body.appendChild(clickDataDisplay);

    let frameCount = 0;
    let lastTime = performance.now();

    let lastFrameTime = performance.now(); // Time of the last frame for latency calculation
    let currentFrameLatency = 0; // Store the current frame latency

    // Initialize click data variables
    let clickCount = 0;
    let lastClickTime = performance.now();
    let clickLatency = 0; // Store the current click latency
    let colorChangeLatency = 0; // Store the color change latency

    // Define colors for button
    const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"];
    let currentColorIndex = 0;

    function calculateFrameRate() {
        const currentTime = performance.now();
        frameCount++;

        // Calculate frame latency (time to render this frame)
        currentFrameLatency = currentTime - lastFrameTime;
        lastFrameTime = currentTime; // Update last frame time

        // Request the next frame
        requestAnimationFrame(calculateFrameRate);
    }

    // Auto-click functionality
    const autoClickButton = document.getElementById('auto-click-button');

    function simulateClick() {
        if (autoClickButton) {
            const currentTime = performance.now();
            clickLatency = currentTime - lastClickTime; // Calculate click latency
            lastClickTime = currentTime;

            clickCount++;

            // Change button color and capture the time it takes for the UI to update
            autoClickButton.style.backgroundColor = colors[currentColorIndex];
            currentColorIndex = (currentColorIndex + 1) % colors.length; // Cycle through colors
            
            // Capture the time after the color change
            const colorChangeStartTime = performance.now();
            // Change button text to display the click count
            autoClickButton.textContent = `Clicked ${clickCount} times`;
            colorChangeLatency = performance.now() - colorChangeStartTime; // Calculate color change latency

            // Save click and frame data
            saveDataToFile(); // Save both click and frame data
        }
    }

    function saveDataToFile() {
        const timestamp = new Date().toISOString();
        const frameRate = Math.round(frameCount / ((performance.now() - lastTime) / 1000));
        
        // Create data string
        const data = `Timestamp: ${timestamp}\n` +
                     `Frame Rate: ${frameRate} FPS\n` +
                     `Frame Latency: ${currentFrameLatency.toFixed(2)} ms\n` +
                     `Click Latency: ${clickLatency.toFixed(2)} ms\n` +
                     `Color Change Latency: ${colorChangeLatency.toFixed(2)} ms\n`;

        const blob = new Blob([data], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'data_log.txt'; // Single file for both data
        link.click();
        URL.revokeObjectURL(link.href);
    }

    function updateDisplays() {
        // Update displays
        frameRateDisplay.textContent = `Frame Rate: ${Math.round(frameCount / ((performance.now() - lastTime) / 1000))} FPS, Frame Latency: ${currentFrameLatency.toFixed(2)} ms`;
        clickDataDisplay.textContent = `Click Latency: ${clickLatency.toFixed(2)} ms`;

        // Reset counts and last time
        frameCount = 0; // Reset frame count
        lastTime = performance.now(); // Reset last time
    }

    // Simulate a click every 10 seconds
    setInterval(simulateClick, 10000);

    // Update displays every 10 seconds
    setInterval(updateDisplays, 10000);

    // Start measuring the frame rate
    calculateFrameRate();
});
