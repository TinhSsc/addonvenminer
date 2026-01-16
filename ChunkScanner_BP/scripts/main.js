import { world, system } from "@minecraft/server";

const HIGHLIGHT_ENTITY = "custom:selected_block";
const MAX_DISTANCE = 10;
const playerHighlights = new Map();

// Bước 1: Kiểm tra nạp script thành công
world.sendMessage("§e[1] Script đã nạp. Đang bắt đầu vòng lặp...");

system.runInterval(() => {
    try {
        const players = world.getAllPlayers();

        // Bước 2: Kiểm tra xem có người chơi nào trong thế giới không
        if (players.length === 0) return;

        for (const player of players) {
            // Bước 3: Kiểm tra hàm raycast
            let raycast;
            try {
                raycast = player.getBlockFromViewDirection({ maxDistance: MAX_DISTANCE });
            } catch (e) {
                world.sendMessage("§c[Lỗi] Hàm getBlockFromViewDirection bị lỗi. Hãy bật Beta APIs!");
                return;
            }

            if (raycast) {
                const block = raycast.block;
                const pos = { x: block.x + 0.5, y: block.y + 0.5, z: block.z + 0.5 };

                let highlight = playerHighlights.get(player.id);

                if (!highlight || !highlight.isValid()) {
                    try {
                        // Bước 4: Thử triệu hồi thực thể
                        highlight = player.dimension.spawnEntity(HIGHLIGHT_ENTITY, pos);
                        playerHighlights.set(player.id, highlight);
                        world.sendMessage(`§a[2] Đã hiện khung tại: ${block.x}, ${block.y}, ${block.z}`);
                    } catch (spawnError) {
                        world.sendMessage(`§c[Lỗi] Không thể triệu hồi "${HIGHLIGHT_ENTITY}". Bạn đã cài Behavior Pack chưa?`);
                    }
                } else {
                    highlight.teleport(pos);
                }
            } else {
                const highlight = playerHighlights.get(player.id);
                if (highlight && highlight.isValid()) {
                    highlight.remove();
                }
                playerHighlights.delete(player.id);
            }
        }
    } catch (globalError) {
        console.warn("Lỗi hệ thống: " + globalError);
    }
}, 1); // Tăng lên 5 ticks một lần để dễ đọc log debug