/* eslint-disable no-return-await */
/* eslint-disable arrow-body-style */
/* eslint-disable import/order */
// @ts-nocheck
import prisma from '../../prisma/prisma-client'; 


export const createLandfill = async (landfillData: {
    name: string;
    capacity: string;
    startTime: string;
    endTime: string;
    lat: string;
    lon: string;
    address?: string;
    managerIds?: string[];
  }) => {
    const managerIds = landfillData.managerIds ? landfillData.managerIds.map(id => Number(id)) : [];
    return await prisma.landfill.create({
      data: {
        name: landfillData.name,
        capacity: Number(landfillData.capacity),
        currentWasteVolume: 0,
        startTime: landfillData.startTime,
        endTime: landfillData.endTime,
        gpsCoords: `${landfillData.lat},${landfillData.lon}`,
        lat: Number(landfillData.lat),
        lon: Number(landfillData.lon),
        address: landfillData.address,
        managers: {
          connect: managerIds.map(id => ({ id })),
        },
      },
      include: {
        managers: true,
      },
    });
  };


  export const updateLandfill = async (
    landfillData: {
      name?: string;
      capacity?: string;
      currentWasteVolume?: string;
      startTime?: string;
      endTime?: string;
      lat?: string;
      lon?: string;
      address?: string;
      managerIds?: string[];
    },
    id: number,
  ) => {
    const managerIds = landfillData.managerIds ? landfillData.managerIds.map(id => Number(id)) : [];
    if (landfillData.managerIds) {
      await prisma.landfill.update({
        where: {
          id,
        },
        data: {
          managers: {
            set: [],
          },
        },
      });
    }
  
    return await prisma.landfill.update({
      where: {
        id,
      },
      data: {
        name: landfillData.name,
        capacity: Number(landfillData.capacity),
        startTime: landfillData.startTime,
        endTime: landfillData.endTime,
        gpsCoords: `${landfillData.lat},${landfillData.lon}`,
        lat: Number(landfillData.lat),
        lon: Number(landfillData.lon),
        address: landfillData.address,
        managers: {
          set: managerIds.map(id => ({ id })),
        },
      },
      include: {
        managers: true,
      },
    });
  };


  