import {getChunkCenter, getChunkCorners, minecraftToChunkCoordinates} from "./chunkUtils";

export default async function test(req ,res) { 
    const {coordX, coordZ} = req.body;
    const chunkCoords = minecraftToChunkCoordinates(coordX, coordZ);
    const chunkCorners = getChunkCorners(chunkCoords.chunkX, chunkCoords.chunkZ);
    const chunkCentre = getChunkCenter(chunkCoords.chunkX, chunkCoords.chunkZ);
    return res.status(200).json({chunkCoords: chunkCoords, chunkCentre: chunkCentre, chunkCorners: chunkCorners});
}