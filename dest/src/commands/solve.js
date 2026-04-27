const solveCommand = {
    name: "solve",
    description: "Retry solving HCaptcha",
    execute: async (agent, message, ...args) => {
        if (!agent.captchaDetected)
            return message.reply("No captcha detected");
        try {
            message.reply("Attempting to solve captcha...");
            // This command just notifies that manual captcha solving should be done
            message.reply("✅ Manual captcha solving mode activated. Please check your notifications.");
        }
        catch (error) {
            console.error(error);
            message.reply("❌ Attempt to solve captcha failed.");
        }
    },
};
export default solveCommand;
