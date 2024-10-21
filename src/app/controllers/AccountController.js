const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require('../models/index');
const initialModelSqlServer = require('../models/initial-models');
const { where } = require('sequelize');
const models = initialModelSqlServer(db);

const { getAllAccounts } = require('../services/accountService');

async function hashPasswordBcrypt(password) {
    const saltRounds = 5; // Độ mạnh của salt
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

class AccountController {
    //[GET] /api/accounts/findAll
    async showAllAccount(req, res, next) {
        try {
            const accounts = await getAllAccounts();
            res.json({ success: true, data: accounts });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách tài khoản', error });
        }
    }

    //[GET] /api/account/register
    showRegisterForm(req, res, next) {
        // Nếu không cần render trang, có thể xóa method này
        res.status(404).json({ success: false, message: 'Chức năng chưa được triển khai' });
    }

    //[POST] /api/accounts/register
    async doRegister(req, res, next) {
        const data = req.body;
        try {
            const hashedPassword = await hashPasswordBcrypt(data.password);
            data.password = hashedPassword;

            const existUsername = await models.ACCOUNT.findOne({
                where: { USERNAME: data.username }
            });
            if (existUsername) {
                return res.status(400).json({ success: false, message: 'Tên người dùng đã tồn tại!' });
            }

            const newAccount = await models.ACCOUNT.create({
                USERNAME: data.username,
                PASSWORD: data.password,
                ROLE_ID: 3,
            });

            res.status(201).json({ success: true, message: 'Tạo tài khoản thành công', data: newAccount });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi khi đăng ký tài khoản', error });
        }
    }

    //[GET] /api/accounts/login
    showLoginForm(req, res, next) {
        // Nếu không cần render trang, có thể xóa method này
        res.status(404).json({ success: false, message: 'Chức năng chưa được triển khai' });
    }

    //[POST] /api/accounts/login
    async doLogin(req, res, next) {
        const data = req.body;
        try {
            const account = await models.ACCOUNT.findOne({
                where: { USERNAME: data.username }
            });

            if (!account) {
                return res.status(400).json({ success: false, message: 'Tên người dùng không tồn tại!' });
            }

            const comparePassword = await bcrypt.compare(data.password, account.PASSWORD);

            if (!comparePassword) {
                return res.status(400).json({ success: false, message: 'Mật khẩu không đúng!' });
            }

            const role = await models.ROLE.findOne({
                where: { ROLE_ID: account.ROLE_ID }
            });

            const staff = await models.STAFF.findOne({
                where: { ACCOUNT_ID: account.ACCOUNT_ID },
            });

            const customer = await models.CUSTOMER.findOne({
                where: { ACCOUNT_ID: account.ACCOUNT_ID },
            });

            const createToken = () => {
                if (account.username == "admin") {
                    const token = jwt.sign({ accountId: account.ACCOUNT_ID, role: role.NAME }, 'secret_key', { expiresIn: '1h' });
                    return token;
                } else {
                    if (staff) {
                        const token = jwt.sign({ accountId: account.ACCOUNT_ID, role: role.NAME, idPerson: staff.STAFF_ID }, 'secret_key', { expiresIn: '1h' });
                        return token;
                    } else {
                        const token = jwt.sign({ accountId: account.ACCOUNT_ID, role: role.NAME, idPerson: customer.CUSTOMER_ID }, 'secret_key', { expiresIn: '1h' });
                        return token;
                    }
                }
            };

            const token = createToken();
            res.cookie('tokenUser', token);

            res.json({ success: true, message: 'Đăng nhập thành công', token });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi khi đăng nhập', error });
        }
    }

    //[GET] /api/accounts/logout
    async doLogout(req, res, next) {
        try {
            // Xóa token trong cookie
            res.clearCookie('tokenUser');
            res.json({ success: true, message: 'Đăng xuất thành công' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi khi đăng xuất', error });
        }
    }
}

module.exports = new AccountController();
