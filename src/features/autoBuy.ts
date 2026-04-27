import { Schematic } from "@/structure/Schematic.js";
import { ranInt } from "@/utils/math.js";

export default Schematic.registerFeature({
  name: "autoBuy",
  cooldown: () => 5000, // 5 seconds
  condition: () => true,
  run: async ({ agent }) => {
    await agent.send("buy 1");
  },
});
