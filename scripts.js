document.addEventListener("DOMContentLoaded", function () {
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

    let frameCount = 0;
    let lastTime = performance.now();

    // Function to send the frame rate to the Flask server
    const sendFrameRateToFlask = (frameRate) => {
        const flaskHost = window.location.hostname; // gets the host of the current window
        fetch("http://${flaskHost}:5000/update-frame-rate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ frameRate: frameRate })
        })
        .then(response => console.log("Server response:", response.status))
        .catch((error) => console.error("Error sending frame rate:", error));
    };

    function calculateFrameRate() {
        const currentTime = performance.now();
        frameCount++;

        // Calculate elapsed time in seconds
        const elapsedTime = (currentTime - lastTime) / 1000;

        // Update frame rate every second
        if (elapsedTime >= 1) {
            const frameRate = Math.round(frameCount / elapsedTime);
            frameRateDisplay.textContent = `Frame Rate: ${frameRate} FPS`;

            // Send frame rate to the server
            sendFrameRateToFlask(frameRate);

            frameCount = 0; // Reset frame count
            lastTime = currentTime; // Reset last time
        }

        // Request the next frame
        requestAnimationFrame(calculateFrameRate);
    }

    // Start measuring the frame rate
    calculateFrameRate();
});
