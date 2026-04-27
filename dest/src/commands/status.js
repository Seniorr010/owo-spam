import { Schematic } from "@/structure/Schematic.js";
import { formatTime } from "@/utils/time.js";
import { logger } from "@/utils/logger.js";
export default Schematic.registerCommand({
    name: "status",
    description: "commands.status.description",
    usage: "status",
    execute: async ({ agent, message, t, locale }) => {
        try {
            // Send the status message
            await message.reply(t("commands.status.status", {
                status: agent.captchaDetected ? "🔴 Captcha Detected"
                    : agent.farmLoopPaused ? "🟡 Paused" : "🟢 Running",
                uptime: formatTime(agent.client.readyTimestamp, Date.now()),
                texts: agent.totalTexts,
                commands: agent.totalCommands,
                captchasSolved: agent.totalCaptchaSolved,
                captchasFailed: agent.totalCaptchaFailed
            }));
        }
        catch (error) {
            logger.error("Error during status command execution:");
            logger.error(error);
        }
    }
});
