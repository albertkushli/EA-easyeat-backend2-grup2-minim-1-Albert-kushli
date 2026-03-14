import mongoose from 'mongoose';
import { RewardModel, IReward } from '../models/reward';

const createReward = async (data: Partial<IReward>) => {
    const reward = new RewardModel({
        _id: new mongoose.Types.ObjectId(),
        ...data
    });

    return await reward.save();
};

const getReward = async (rewardId: string) => {
    return await RewardModel.findById(rewardId);
};

const getAllRewards = async () => {
    return await RewardModel.find();
};

const updateReward = async (rewardId: string, data: Partial<IReward>) => {
    const reward = await RewardModel.findById(rewardId);

    if (reward) {
        reward.set(data);
        return await reward.save();
    }

    return null;
};

const deleteReward = async (rewardId: string) => {
    return await RewardModel.findByIdAndDelete(rewardId);
};

export default {
    createReward,
    getReward,
    getAllRewards,
    updateReward,
    deleteReward
};