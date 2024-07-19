const ComplaintService = require("../services/complaintService");

class ComplaintController {
  static async getListComplaint(req, res, next) {
    try {
      const complaint = await ComplaintService.getListComplaint();
      res.status(200).json({
        message: "Success",
        status: 200,
        data: complaint,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOneComplaint(req, res, next) {
    try {
      const { order_id } = req.params;
      const complaint = await ComplaintService.getOneComplaint(order_id);
      res.status(200).json({
        message: "Success",
        status: 200,
        data: complaint,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createComplaint(req, res, next) {
    try {
      const { order_id, iscomplaint, text } = req.body;

      const complaint = await ComplaintService.createComplaint({
        order_id,
        iscomplaint,
        text,
      });
      res.status(200).json({
        message: "Successfully create complaint",
        status: 200,
        data: complaint,
      });
    } catch (error) {
      next(error);
    }
  }

  static async editComplaint(req, res, next) {
    try {
      const { order_id } = req.params;
      const { iscomplaint, text } = req.body;
      const updatedComplaint = await ComplaintService.editComplaint({
        order_id,
        iscomplaint,
        text,
      });
      res.status(200).json({
        message: "Successfully complaint updated",
        status: 200,
        data: updatedComplaint,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteComplaint(req, res, next) {
    try {
      const { order_id } = req.params;
      await ComplaintService.deleteComplaint(order_id);
      res.status(200).json({
        message: "Successfully complaint deleted",
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ComplaintController;
