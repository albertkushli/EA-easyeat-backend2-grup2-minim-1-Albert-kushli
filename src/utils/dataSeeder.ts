import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import Logging from '../library/logging';

// Import all models
import { RestaurantModel } from '../models/restaurant';
import { ReviewModel } from '../models/review';
import { CustomerModel } from '../models/customer';
import { RewardModel } from '../models/reward';
import { BadgeModel } from '../models/badge';
import { VisitModel } from '../models/visit';
import { EmployeeModel } from '../models/employee';
import { StatisticsModel } from '../models/statistics';
import { PointsWalletModel } from '../models/pointsWallet';
import { RewardRedemptionModel } from '../models/rewardRedemption';
import { DishModel } from '../models/dish';

const modelMap: { [key: string]: mongoose.Model<any> } = {
    'restaurants.json': RestaurantModel,
    'reviews.json': ReviewModel,
    'customers.json': CustomerModel,
    'rewards.json': RewardModel,
    'badges.json': BadgeModel,
    'visits.json': VisitModel,
    'employees.json': EmployeeModel,
    'statistics.json': StatisticsModel,
    'pointsWallets.json': PointsWalletModel,
    'rewardRedemptions.json': RewardRedemptionModel,
    'dishes.json': DishModel
};

export const insertData = async () => {
    try {
        // Try multiple locations for the data directory
        const possiblePaths = [
            path.join(__dirname, '../data'),           // build/data
            path.join(process.cwd(), 'src/data'),      // src/data (from root)
            path.join(__dirname, '../../src/data')     // src/data (relative to build/utils)
        ];

        let dataDir = '';
        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                dataDir = p;
                break;
            }
        }

        if (!dataDir) {
            Logging.error('Data directory not found. Searched in: ' + possiblePaths.join(', '));
            return;
        }

        Logging.info(`Using data directory: ${dataDir}`);

        const files = fs.readdirSync(dataDir);
        for (const file of files) {
            if (file.endsWith('.json')) {
                const model = modelMap[file];
                if (model) {
                    const count = await model.countDocuments();
                    if (count === 0) {
                        const filePath = path.join(dataDir, file);
                        const fileContent = fs.readFileSync(filePath, 'utf-8');
                        const data = JSON.parse(fileContent);
                        Logging.info(`Inserting data into ${model.collection.name} collection...`);
                        await model.insertMany(data);
                        Logging.info(`Data inserted into ${model.collection.name} collection.`);
                    } else {
                        Logging.info(`${model.collection.name} collection is not empty. Skipping insertion.`);
                    }
                }
            }
        }
        Logging.info('Database data check completed.');
    } catch (error) {
        Logging.error('Error inserting data:');
        Logging.error(error);
    }
};
