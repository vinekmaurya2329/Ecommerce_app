import mongoose from  'mongoose';
import colors from 'colors';

const connectDB = async ()=>{ 
    try {
const conn =await mongoose.connect('mongodb+srv://vinekmaurya2329:vinek7068594746@cluster0.5iwx2uw.mongodb.net/?retryWrites=true&w=majority');
console.log(`connected to mongodb database ${conn.connection.host}`)
    }
    catch (error){
        console.log(`error in mongodb ${error}`.bgRed.white)
    }
}
export default connectDB;
