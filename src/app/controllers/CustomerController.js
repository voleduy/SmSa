const { getAllCustomers } = require('../services/customerService');
const initialModelSqlServer = require('../models/initial-models');
const db = require('../models/index');
const models = initialModelSqlServer(db);

class CustomerController {

    //[GET] /api/customers/findAll
    async showAllCustomer(req, res, next) {
        try {
            const result = await getAllCustomers();
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách khách hàng', error });
        }
    }

    //[GET] /api/customers/create
    async showCreateForm(req, res, next) {
        res.status(404).json({ success: false, message: 'Chức năng chưa được triển khai' });
    }

    //[POST] /api/customers/create
    async doCreate(req, res, next) {
        try {
            const data = req.body;

            console.log(data);

            const customer = await models.CUSTOMER.create({
                NAME: data.name,
                EMAIL: data.email,
                PHONE: data.phone,
                ADDRESS: data.address,
                DATE_OF_BIRTH: data.dateOfBirth,
                GENDER: data.gender,
                POINTS: 0,
                ACCOUNT_ID: 1,
            });

            res.status(201).json({ success: true, message: "Thêm khách hàng thành công", data: customer });
        } catch (error) {
            res.status(500).json({ success: false, message: "Có lỗi xảy ra!", error });
        }
    }

    //[GET] /api/customers/edit/:id
    async showEditForm(req, res, next) {
        try {
            const id = req.params.id;

            const customer = await models.CUSTOMER.findOne({
                where: { CUSTOMER_ID: id },
            });

            if (!customer) {
                return res.status(404).json({ success: false, message: "Không tìm thấy khách hàng!" });
            }

            res.status(200).json({ success: true, message: 'Chỉnh sửa khách hàng', data: customer.dataValues });
        } catch (error) {
            res.status(500).json({ success: false, message: "Có lỗi xảy ra!", error });
        }
    }

    //[PUT] /api/customers/edit/:id
    async doEdit(req, res, next) {
        try {
            const customer = req.body;

            const [updatedRowsCount] = await models.CUSTOMER.update({
                NAME: customer.name,
                EMAIL: customer.email,
                PHONE: customer.phone,
                ADDRESS: customer.address,
                DATE_OF_BIRTH: customer.dateOfBirth,
                GENDER: customer.gender,
                POINTS: customer.points,
                ACCOUNT_ID: customer.accountId,
            }, { where: { CUSTOMER_ID: req.params.id } });

            if (updatedRowsCount > 0) {
                res.status(200).json({ success: true, message: 'Chỉnh sửa khách hàng thành công!' });
            } else {
                res.status(404).json({ success: false, message: 'Không tìm thấy khách hàng để chỉnh sửa!' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: "Có lỗi xảy ra!", error });
        }
    }

    //[DELETE] /api/customers/delete/:id
    async doDelete(req, res, next) {
        try {
            const deletedRowsCount = await models.CUSTOMER.destroy({
                where: { CUSTOMER_ID: req.params.id }
            });

            if (deletedRowsCount > 0) {
                res.status(200).json({ success: true, message: 'Xóa khách hàng thành công!' });
            } else {
                res.status(404).json({ success: false, message: 'Không tìm thấy khách hàng để xóa!' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Có lỗi xảy ra!', error });
        }
    }

    //[GET] /api/customers/detail/:id
    async showDetail(req, res, next) {
        try {
            const customer = await models.CUSTOMER.findOne({
                where: { CUSTOMER_ID: req.params.id },
            });

            if (!customer) {
                return res.status(404).json({ success: false, message: "Không tìm thấy khách hàng!" });
            }

            res.status(200).json({ success: true, message: 'Chi tiết khách hàng', data: customer.dataValues });
        } catch (error) {
            res.status(500).json({ success: false, message: "Có lỗi xảy ra!", error });
        }
    }
}

module.exports = new CustomerController();
