export function minecraftToChunkCoordinates(x, z) {
    var chunkX = Math.floor(x / 16);
    var chunkZ = Math.floor(z / 16);
    return { chunkX: chunkX, chunkZ: chunkZ };
}