import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import query from '../queries/dbqueries';
import pool from '../queries/pool';
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';


dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const SECRET = process.env.JWT_KEY;


class Helper {

    static async createUser(req) {
        try {


        } catch (error) {
            console.log(error);
        }
    }

    static async login(req) {
        try {
            const { userName, email, password } = req.body;
            let result;
            if (userName) {
                let username1 = userName.toLowerCase();
                result = await pool.query(query.getUserByUserName(username1));
            }
            else if (email) {
                result = await pool.query(query.getUserByEmail(email));
            }
            if (!result.rows[0]) return 'accountNotFound';
            const db = result.rows[0];
            const validPassword = await bcrypt.compare(password, db.password);

            if (!validPassword) return 'invalidPassword';

            const { id, is_admin } = db;
            

            const token = jwt.sign({ id, email, is_admin }, SECRET, { expiresIn: '12h' });
            //mailer.mail();
            return { id, token, is_admin };
        } catch (error) {
            console.log(error);

        }

    }

    static async updateUserEmail(req) {
        try {
            const userId = parseInt(req.user.id, 10);
            const password = req.body.password;
            const data = await pool.query(query.getUserById(userId));
            if (!data.rows[0]) return 'accountNotFound';
            const db = data.rows[0];

            const foundUser = await pool.query(query.getUserByEmail(req.body.email));
            if (foundUser.rowCount > 0) return 'notUniqueEmail';

            const validPassword = await bcrypt.compare(password, db.password);

            if (!validPassword) return 'invalidPassword';

            const result = await pool.query(query.updateUserEmail(req.body.email, userId));

            const user = result.rows[0];
            const newEmail = user.email;
            const { id, is_admin } = user;
            const token = jwt.sign({ id, newEmail, is_admin }, SECRET, { expiresIn: '12h' });

            return { token, user };

        } catch (error) {
            console.log(error);
        }
    }

    static async updatePassword(req) {
        try {
            const userId = parseInt(req.user.id, 10);

            const { rows } = await pool.query(query.getUserById(userId));
            if (!rows[0]) return 'accountNotFound';

            const { oldPassword, newPassword } = req.body;
            const db = rows[0];
            const validPassword = await bcrypt.compare(oldPassword, db.password);

            if (!validPassword) return 'invalidPassword';

            const hashNewPassword = await bcrypt.hash(newPassword, 10);

            const result = await pool.query(query.updateUserPassword(hashNewPassword, userId));

            const user = result.rows[0];
            const { id, email, is_admin } = user;

            const token = jwt.sign({ id, email, is_admin }, SECRET, { expiresIn: '12h' });

            return { token, user };

        } catch (error) {
            console.log(error);
        }
    }

    static async getUserByUserName(req) {
        try {
            const isAdmin = req.user.is_admin;

            if (!isAdmin) {
                return 'forbidden';
            }

            let username1 = req.params.username.toLowerCase();
            const result = await pool.query(query.getUserByUserName(username1));
            if (result.rowCount < 1) return 'accountNotFound';

            return result.rows[0];

        } catch (error) {
            console.log(error);
        }
    }

    static async getUserById(req) {
        try {
            const isAdmin = req.user.is_admin;
            let data = null;
            let incidents = undefined;
            if (isAdmin) {
                return 'forbidden';
            }

            let id = parseInt(req.params.id, 10);
            const result = await pool.query(query.getUserById(id));
            data = await pool.query(query.getAllUserIncidents(id))

            let redFlags = 0, interventions = 0, underInvestigation = 0;
            let draft = 0, resvd = 0, rejected = 0;

            if (result.rowCount < 1) return 'accountNotFound';

            const user = result.rows[0];
            const { email, registered, image, user_name } = user;

            if (data.rows[0]) {
                incidents = data.rows
                incidents.forEach(incident => {
                    switch (incident.status) {
                        case 'Draft':
                            draft++
                            break;
                        case 'Resolved':
                            resvd++
                            break;
                        case 'Under investigation':
                            underInvestigation++
                            break;
                        case 'Rejected':
                            rejected++
                            break;
                    }
                    switch (incident.type) {
                        case 'Red-flag':
                            redFlags++
                            break;
                        case 'Intervention':
                            interventions++
                            break;
                    }

                });
            }
            const total = redFlags + interventions;
            const values = {
                redFlags, interventions, resvd, total, email, user_name,
                rejected, draft, underInvestigation, registered, image
            };
            return values;
        } catch (error) {
            console.log(error);
        }
    }

    static async getAllUsers(req) {
        try {

            const isAdmin = req.user.is_admin;

            if (!isAdmin) {
                return 'forbidden';
            }

            const result = await pool.query(query.getAllUsernames());

            if (result.rowCount < 1) return 'accountNotFound';

            return result.rows;
        } catch (error) {
            console.log(error);
        }

    }

    static async createProfileImage(req, data) {
        try {
            const result = await cloudinary.uploader.upload(data, {upload_preset:'dhuokyu2'})
            if (result === undefined || !result.url) {
                return 'cloudinary error';
            }

            const userId = parseInt(req.user.id, 10)
            const { public_id, secure_url } = result;
            const userInfo = await pool.query(query.updateUserImage(public_id, secure_url, userId));
            const { image, image_id } = userInfo.rows[0]
            return {image, image_id};

        } catch (error) {
            console.log(error);
        }
    }

    static async deleteUser(req) {
        try {
            const userId = parseInt(req.user.id, 10);
            const { rows, rowCount } = await pool.query(query.getUserById(userId));

            if (rowCount < 1) return 'accountNotFound';

            const password = req.body.password;
            const user = rows[0];
            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) return 'invalidPassword';

            if (user.is_admin && user.id === 1) {
                return 'forbidden';
            }

            const result = await pool.query(query.deleteUser(userId));
            return result.rows[0];

        } catch (error) {
            console.log(error);
        }
    }
}

export default Helper;