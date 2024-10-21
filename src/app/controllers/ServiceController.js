const db = require('../models/index');
const initialModelsSQLServer = require('../models/initial-models');
const models = initialModelsSQLServer(db);

const multer = require('multer');
const fs = require('fs');

// Khởi tạo multer để lưu file tạm thời
const upload = multer({ dest: 'uploads/' });

class ServiceController {

    //[GET] /api/services/findAll
    async showAll(req, res, next) {
        try {
            const data = await models.SERVICE.findAll();
            res.status(200).json({
                message: "Danh sách dịch vụ",
                services: data,
            });
        } catch (error) {
            res.status(500).json({ message: "Có lỗi xảy ra!" });
        }
    }

    //[GET] /api/services/create
    async showCreateForm(req, res, next) {
        res.status(200).json({ message: "Form tạo dịch vụ" });
    }

    //[POST] /api/services/create
    async doCreate(req, res, next) {
        try {
            const { name, description, price } = req.body;
            const imageFile = req.file;

            // Đọc file và chuyển thành base64
            const imageBase64 = fs.readFileSync(imageFile.path, { encoding: 'base64' });

            // Tạo mới dịch vụ và lưu image dưới dạng base64
            const newService = await models.SERVICE.create({
                NAME: name,
                DESCRIPTION: description,
                PRICE: price,
                IMAGE: imageBase64, // Lưu chuỗi base64 vào DB
            });

            // Xóa file tạm sau khi đã chuyển đổi
            fs.unlinkSync(imageFile.path);

            res.status(201).json({
                message: "Tạo dịch vụ thành công",
                service: newService,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Có lỗi xảy ra!" });
        }
    }

    //[GET] /api/services/edit/:id
    async showEditForm(req, res, next) {
        try {
            const id = req.params.id;
            const service = await models.SERVICE.findOne({ where: { SERVICE_ID: id } });

            if (!service) {
                return res.status(404).json({ message: "Dịch vụ không tồn tại!" });
            }

            res.status(200).json({
                message: "Form chỉnh sửa dịch vụ",
                service: service.dataValues,
            });
        } catch (error) {
            res.status(500).json({ message: "Có lỗi xảy ra!" });
        }
    }

    //[PUT] /api/services/edit/:id
    async doEdit(req, res, next) {
        try {
            const id = req.params.id;
            const { name, description, price } = req.body;
            const imageFile = req.file;

            let updateData = {
                NAME: name,
                DESCRIPTION: description,
                PRICE: price,
            };

            // Nếu có file ảnh mới, chuyển đổi thành base64 và cập nhật
            if (imageFile) {
                const imageBase64 = fs.readFileSync(imageFile.path, { encoding: 'base64' });
                updateData.IMAGE = imageBase64;

                // Xóa file tạm
                fs.unlinkSync(imageFile.path);
            }

            const [updatedRows] = await models.SERVICE.update(updateData, { where: { SERVICE_ID: id } });

            if (updatedRows === 0) {
                return res.status(404).json({ message: "Không tìm thấy dịch vụ để chỉnh sửa!" });
            }

            res.status(200).json({ message: "Chỉnh sửa dịch vụ thành công!" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Có lỗi xảy ra!" });
        }
    }

    //[DELETE] /api/services/delete/:id
    async doDelete(req, res, next) {
        try {
            const id = req.params.id;
            const deletedRows = await models.SERVICE.destroy({ where: { SERVICE_ID: id } });

            if (deletedRows === 0) {
                return res.status(404).json({ message: "Không tìm thấy dịch vụ để xóa!" });
            }

            res.status(200).json({ message: "Xóa dịch vụ thành công!" });
        } catch (error) {
            res.status(500).json({ message: "Có lỗi xảy ra!" });
        }
    }

    //[GET] /api/services/detail/:id
    async showDetail(req, res, next) {
        try {
            const id = req.params.id;
            const service = await models.SERVICE.findOne({ where: { SERVICE_ID: id } });

            if (!service) {
                return res.status(404).json({ message: "Dịch vụ không tồn tại!" });
            }

            res.status(200).json({
                message: "Chi tiết dịch vụ",
                service: service.dataValues,
            });
        } catch (error) {
            res.status(500).json({ message: "Có lỗi xảy ra!" });
        }
    }
}

module.exports = new ServiceController();
