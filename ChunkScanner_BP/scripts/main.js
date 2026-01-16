import { world, system } from "@minecraft/server";

const CONFIG = {
    entityId: "custom:selected_block",
    duration: 20 // Khung sẽ biến mất sau 1 giây (20 ticks)
};

world.afterEvents.playerInteractWithBlock.subscribe((ev) => {
    const { block } = ev;
    const dim = block.dimension;
    const { x, y, z } = block.location;

    // Spawn thực thể bao quanh block tại tâm (x+0.5, y+0.5, z+0.5)
    const selection = dim.spawnEntity(CONFIG.entityId, { x: x + 0.5, y: y + 0.5, z: z + 0.5 });

    // Tự động xóa thực thể sau khi hết thời gian duration
    system.runTimeout(() => {
        if (selection && selection.isValid()) {
            selection.remove();
        }
    }, CONFIG.duration);
});