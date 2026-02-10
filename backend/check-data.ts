import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User';
import Wallet from './src/models/Wallet';

dotenv.config();

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || '');
        console.log('Connected to MongoDB\n');

        // Check users
        const users = await User.find().select('-passwordHash');
        console.log(`Total Users: ${users.length}`);
        console.log('Users:', JSON.stringify(users, null, 2));
        console.log('\n');

        // Check wallets
        const wallets = await Wallet.find();
        console.log(`Total Wallets: ${wallets.length}`);
        console.log('Wallets:', JSON.stringify(wallets, null, 2));

        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkData();
