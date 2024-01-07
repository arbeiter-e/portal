export function getChunkCorners(chunkX, chunkZ) {
    const chunkSize = 16; // Minecraft chunk size in blocks
    const corner1X = chunkX * chunkSize;
    const corner1Z = chunkZ * chunkSize;
    const corner2X = corner1X + chunkSize;
    const corner2Z = corner1Z + chunkSize;

    // Return an object containing the coordinates of the chunk corners
    return {
        corner1: { x: corner1X, z: corner1Z },
        corner2: { x: corner2X, z: corner2Z }
    };
}

export function getChunkCenter(chunkX, chunkZ) {
    const chunkSize = 16; // Minecraft chunk size in blocks
    const centerX = chunkX * chunkSize + chunkSize / 2;
    const centerZ = chunkZ * chunkSize + chunkSize / 2;

    // Return an object containing the coordinates at the center of the chunk
    return {
        x: centerX,
        z: centerZ
    };
}


export function minecraftToChunkCoordinates(x, z) {
    var chunkX = Math.floor(x / 16);
    var chunkZ = Math.floor(z / 16);
    return { chunkX: chunkX, chunkZ: chunkZ };
}


export default getChunkCorners;