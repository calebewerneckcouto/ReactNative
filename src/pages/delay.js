// delay.js
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    await delay(5000); // 5000 ms = 5 seconds
})();
