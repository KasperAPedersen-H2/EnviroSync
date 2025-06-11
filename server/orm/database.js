/**
    * Copyright (c) 2025 Launchify. All rights reserved.
    *
    * This file is part of proprietary software owned by Launchify.
    * Use, distribution, or modification of this code is not permitted
    * without explicit, prior written consent or a valid license.
    *
    * For license inquiries, contact: kasper@launchify.dk
*/

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import Models from './models.js';
import Dummy from './dummy.js';

dotenv.config();

let sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: (msg) => {
        console.log(`[ORM]\t\t${msg}`);
    }
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('[CON]\t\tConnection has been established successfully.\n');
    } catch (e) {
        console.error('[CON]\t\tUnable to connect to the database:', e);
    }

    try {
        await sequelize.sync();
        console.log('[SYN]\t\tModels have been synchronized.\n');

        await Dummy();
    } catch (e) {
        console.error('[SYN]\t\tUnable to synchronize models or seed database:', e);
    }
})();

export default sequelize;