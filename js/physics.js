

export const GRAVITY = 0.55; // konstanta gravitasi
export const MAX_FALL_SPEED = 12; // batas maks kecepatan jatuh
export const JUMP_FORCE = 11; // kekuatan lompatan awal
export const MOVE_SPEED = 3.8; // kecepatan jalan karakter
export const FRICTION = 0.72; // perlambatan saat tidak tekan tombol jalan

export function checkAABB(a, b) {
    return (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
    );
}

export function resolveCollisions(entity, platforms) {

    entity.grounded = false;

    entity.x += entity.vx;

    for (const plat of platforms) {
        if (checkAABB(entity, plat)) {
            if (entity.vx > 0) {

                entity.x = plat.x - entity.w;
            } else if (entity.vx < 0) {

                entity.x = plat.x + plat.w;
            }
            entity.vx = 0;
        }
    }

    entity.y += entity.vy;

    for (const plat of platforms) {
        if (checkAABB(entity, plat)) {
            if (entity.vy > 0) {

                entity.y = plat.y - entity.h;
                entity.grounded = true; // Langsung true karena gravitasi selalu ke bawah
            } else if (entity.vy < 0) {

                entity.y = plat.y + plat.h;
            }
            entity.vy = 0;
        }
    }
}
