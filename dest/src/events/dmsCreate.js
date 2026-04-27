import { Schematic } from "@/structure/Schematic.js";
import { CaptchaService } from "@/services/CaptchaService.js";
import { logger } from "@/utils/logger.js";
export default Schematic.registerEvent({
    name: "dmsCreate",
    event: "messageCreate",
    handler: async ({ agent }, message) => {
        if (!agent.captchaDetected || message.channel.type !== "DM")
            return;
        if (!agent.config.adminID || message.author.id !== agent.config.adminID)
            return;
        if (message.channel.recipient.id !== message.client.user?.id)
            return;
        if (/^\w{3,6}$/.test(message.content)) {
            const owo = await message.client.users
                .fetch(agent.owoID)
                .catch(() => null);
            const dms = await owo?.createDM();
            if (!owo || !dms) {
                message.reply("Failed to fetch OWO user or create DM channel.");
                return;
            }
            const res = await agent.awaitResponse({
                trigger: () => agent.send(message.content, { channel: dms }),
                filter: (m) => m.author.id === owo.id &&
                    m.channel.type === "DM" &&
                    /(wrong verification code!)|(verified that you are.{1,3}human!)|(have been banned)/gim.test(m.content),
            });
            if (res && /verified that you are.{1,3}human!/gim.test(res.content)) {
                logger.info(`CAPTCHA RESOLVED BY ADMIN, attempting Discord authorization...`);
                // Try to authorize Discord if authToken is available
                if (agent.config.authToken) {
                    try {
                        const captchaService = new CaptchaService({
                            provider: agent.config.captchaAPI,
                            apiKey: agent.config.apiKey,
                        });
                        await captchaService.authorizeDiscord(agent.config.authToken);
                        logger.info(`Discord authorization completed successfully!`);
                    }
                    catch (error) {
                        logger.error(`Discord authorization failed: ${error instanceof Error ? error.message : String(error)}`);
                    }
                }
                else {
                    logger.warn(`No authToken configured, skipping Discord authorization`);
                }
                logger.info(`RESTARTING SELFBOT...`);
                agent.captchaDetected = false;
                agent.farmLoop();
                return message.reply(`✅ Captcha resolved and farm restarted!`);
            }
            return message.reply(res?.content || "No response received from OWO user.");
        }
    },
});
