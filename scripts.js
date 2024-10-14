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
    let lastFrameTime = performance.now();
    let currentFrameLatency = 0;

    // Arrays to store metrics over a minute
    let frameRateValues = [];
    let frameLatencyValues = [];
    let clickLatencyValues = [];

    // Initialize click data variables
    let clickCount = 0;
    let lastClickTime = performance.now();
    let clickLatency = 0;
    let colorChangeLatency = 0;

    // Define colors for button
    const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"];
    let currentColorIndex = 0;

    function calculateFrameRate() {
        const currentTime = performance.now();
        frameCount++;

        // Calculate frame latency
        currentFrameLatency = currentTime - lastFrameTime;
        lastFrameTime = currentTime;

        // Collect values
        const frameRate = Math.round(frameCount / ((performance.now() - lastTime) / 1000));
        frameRateValues.push(frameRate);
        frameLatencyValues.push(currentFrameLatency);

        // Request next frame
        requestAnimationFrame(calculateFrameRate);
    }

    const autoClickButton = document.getElementById('auto-click-button');

    function simulateClick() {
        if (autoClickButton) {
            const currentTime = performance.now();
            clickLatency = currentTime - lastClickTime;
            lastClickTime = currentTime;

            // Increment click count
            clickCount++;

            // Change button color and capture color change latency
            autoClickButton.style.backgroundColor = colors[currentColorIndex];
            currentColorIndex = (currentColorIndex + 1) % colors.length;
            const colorChangeStartTime = performance.now();
            autoClickButton.textContent = `Clicked ${clickCount} times`;
            colorChangeLatency = performance.now() - colorChangeStartTime;

            // Save click latency
            clickLatencyValues.push(clickLatency);

            // No need to save to file every click
        }
    }

    // Function to calculate min, max, and average
    function calculateStats(values) {
        const min = Math.min(...values);
        const max = Math.max(...values);
        const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
        return { min, max, avg };
    }

    function saveDataToFile() {
        const timestamp = new Date().toISOString();

        // Calculate statistics for the last minute
        const frameRateStats = calculateStats(frameRateValues);
        const frameLatencyStats = calculateStats(frameLatencyValues);
        const clickLatencyStats = calculateStats(clickLatencyValues);

        // Create data string
        const data = `Timestamp: ${timestamp}\n` +
                     `Frame Rate: min ${frameRateStats.min} FPS, max ${frameRateStats.max} FPS, avg ${frameRateStats.avg.toFixed(2)} FPS\n` +
                     `Frame Latency: min ${frameLatencyStats.min.toFixed(2)} ms, max ${frameLatencyStats.max.toFixed(2)} ms, avg ${frameLatencyStats.avg.toFixed(2)} ms\n` +
                     `Click Latency: min ${clickLatencyStats.min.toFixed(2)} ms, max ${clickLatencyStats.max.toFixed(2)} ms, avg ${clickLatencyStats.avg.toFixed(2)} ms\n`;

        const blob = new Blob([data], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'data_log.txt';
        link.click();
        URL.revokeObjectURL(link.href);

        // Reset arrays for the next minute
        frameRateValues = [];
        frameLatencyValues = [];
        clickLatencyValues = [];
    }

    function updateDisplays() {
        // Update displays
        const frameRate = Math.round(frameCount / ((performance.now() - lastTime) / 1000));
        frameRateDisplay.textContent = `Frame Rate: ${frameRate} FPS, Frame Latency: ${currentFrameLatency.toFixed(2)} ms`;
        clickDataDisplay.textContent = `Click Latency: ${clickLatency.toFixed(2)} ms`;

        // Reset counts and last time
        frameCount = 0;
        lastTime = performance.now();
    }

    // Simulate a click every 10 seconds
    setInterval(simulateClick, 10000);

    // Update displays every second
    setInterval(updateDisplays, 1000);

    // Save data and calculate averages every minute
    setInterval(saveDataToFile, 60000);

    // Start measuring frame rate
    calculateFrameRate();
});
