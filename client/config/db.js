import mongoose from  'mongoose';
import colors from 'colors';

const connectDB = async ()=>{ 
    try {
const conn =await mongoose.connect('mongodb://127.0.0.1:27017/Ecommerce');
console.log(`connected to mongodb database ${conn.connection.host}`)
    }
    catch (error){
        console.log(`error in mongodb ${error}`.bgRed.white)
    }
}
export default connectDB;