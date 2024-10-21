const { getAllStaff } = require('../services/staffService');
const initialModelSqlServer = require('../models/initial-models');
const db = require('../models/index');
const models = initialModelSqlServer(db);
const { where } = require('sequelize');

class StaffController {

    //[GET] /api/staff/findAll
    async showAllStaff(req, res, next) {
        try {
            const result = await getAllStaff();
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Có lỗi xảy ra!' });
        }
    }

    //[GET] /api/staff/create
    showCreateForm(req, res, next) {
        res.status(200).json({ message: "Form tạo nhân viên" });
    }

    //[POST] /api/staff/create
    async doCreate(req, res, next) {
        try {
            const data = req.body;

            const existStaff = await models.STAFF.findOne({
                where: { NAME: data.name, EMAIL: data.email }
            });

            if (existStaff) {
                return res.status(400).json({ error: "Nhân viên này đã tồn tại!" });
            }

            const newStaff = await models.STAFF.create({
                NAME: data.name,
                EMAIL: data.email,
                GENDER: data.gender,
                ADDRESS: data.address,
                PHONE: data.phone,
                ROLE: data.role,
                RATING: 0,
                ACCOUNT_ID: data.accountId,
                LOCATION_ID: data.locationId,
            });

            res.status(201).json({
                message: "Tạo mới nhân viên thành công",
                staff: newStaff,
            });
        } catch (error) {
            res.status(500).json({ error: 'Có lỗi xảy ra!' });
        }
    }

    //[GET] /api/staff/edit/:id
    async showEditForm(req, res, next) {
        try {
            const id = req.params.id;

            const staff = await models.STAFF.findOne({
                where: { STAFF_ID: id },
            });

            if (!staff) {
                return res.status(404).json({ message: "Không tìm thấy nhân viên!" });
            }

            const location = await models.LOCATION.findAll();

            res.status(200).json({
                message: "Form chỉnh sửa nhân viên",
                staff: staff.dataValues,
                location: location,
            });
        } catch (error) {
            res.status(500).json({ message: "Có lỗi xảy ra!" });
        }
    }

    //[PUT] /api/staff/edit/:id
    async doEdit(req, res, next) {
        try {
            const staffEdited = req.body;

            const [updatedRowsCount] = await models.STAFF.update({
                NAME: staffEdited.name,
                EMAIL: staffEdited.email,
                GENDER: staffEdited.gender,
                PHONE: staffEdited.phone,
                ADDRESS: staffEdited.address,
                ROLE: staffEdited.role,
                LOCATION_ID: staffEdited.locationId,
                ACCOUNT_ID: staffEdited.accountId,
            }, { where: { STAFF_ID: req.params.id } });

            if (updatedRowsCount > 0) {
                res.status(200).json({ message: "Chỉnh sửa nhân viên thành công!" });
            } else {
                res.status(404).json({ message: "Không tìm thấy nhân viên để chỉnh sửa!" });
            }
        } catch (error) {
            res.status(500).json({ error: "Có lỗi xảy ra!" });
        }
    }

    //[DELETE] /api/staff/delete/:id
    async doDelete(req, res, next) {
        try {
            const deletedRowsCount = await models.STAFF.destroy({
                where: { STAFF_ID: req.params.id }
            });

            if (deletedRowsCount > 0) {
                res.status(200).json({ message: "Xóa nhân viên thành công!" });
            } else {
                res.status(404).json({ message: "Không tìm thấy nhân viên để xóa!" });
            }
        } catch (error) {
            res.status(500).json({ error: 'Có lỗi xảy ra!' });
        }
    }

    //[GET] /api/staff/detail/:id
    async showDetail(req, res, next) {
        try {
            const staff = await models.STAFF.findOne({
                where: { STAFF_ID: req.params.id },
            });

            if (!staff) {
                return res.status(404).json({ error: "Không tìm thấy nhân viên!" });
            }

            res.status(200).json({
                message: "Chi tiết nhân viên",
                staff: staff.dataValues,
            });
        } catch (error) {
            res.status(500).json({ error: "Có lỗi xảy ra!" });
        }
    }
}

module.exports = new StaffController();
