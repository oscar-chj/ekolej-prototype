import { prisma } from "../../../prisma/prisma";

export const emailLogService = {
  createLog: async (data: { recipient: string; status: string; description: string }) => {
    return await prisma.emailLog.create({ data });
  },


  fetchLogs: async (status?: string, search?: string) => {
    return await prisma.emailLog.findMany({
      where: {
        status: (status && status !== "All Statuses") ? status : undefined,
        recipient: { contains: search || '', mode: 'insensitive' }
      },
      orderBy: { createdAt: 'desc' },
      take: 10 
    });
  }
};