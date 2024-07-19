const prisma = require("../lib/prisma");

class ComplaintService {
  static async getListComplaint() {
    const complaint = await prisma.complaint.findMany();
    if (!complaint)
      throw {
        name: "failedToRetrieve",
        message: "Failed to retrieve complaint",
      };
    return complaint;
  }

  static async getOneComplaint(order_id) {
    const complaint = await prisma.complaint.findUnique({
      where: { order_id: +order_id },
    });
    if (!complaint) {
      throw {
        name: "failedToRetrieve",
        message: "Failed to retrieve complaint",
      };
    }

    return complaint
  }

  static async createComplaint(data) {
    const { order_id, iscomplaint, text } = data;

    const existingComplaint = await prisma.complaint.findFirst({
      where: { order_id: +order_id },
    });
    if (existingComplaint)
      throw { name: "exist", message: "Complaint already exists" };

    const newComplaint = await prisma.complaint.create({
      data: { order_id: order_id, iscomplaint: iscomplaint, text: text },
    });
    if (!newComplaint)
      throw { name: "failedToCreate", message: "Failed to create complaint" };
    return newComplaint;
  }

  static async editComplaint(data) {
    const { order_id, iscomplaint, text } = data;
    const existingComplaint = await prisma.complaint.findUnique({
      where: { order_id: +order_id },
    });
    if (!existingComplaint)
      throw {
        name: "failedToUpdate",
        message: "Update is failed, no existing complaint",
      };

    const updatedComplaint = await prisma.complaint.update({
      where: { order_id: +order_id },
      data: { iscomplaint: iscomplaint, text: text },
    });
    if (!updatedComplaint)
      throw { name: "failedToUpdate", message: "Failed to update complaint" };
    return updatedComplaint;
  }

  static async deleteComplaint(order_id) {
    const existingComplaint = await prisma.complaint.findUnique({
      where: { order_id: +order_id },
    });
    if (!existingComplaint)
      throw {
        name: "failedToDelete",
        message: "Delete is failed, no existing complaint",
      };

    const deletedComplaint = await prisma.complaint.delete({
      where: { order_id: +order_id },
    });
    if (!deletedComplaint)
      throw { name: "failedToDelete", message: "Failed to delete complaint" };
    return deletedComplaint;
  }
}

module.exports = ComplaintService;
