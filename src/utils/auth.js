import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb'; 

export const getToken = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' });

export const getUserFromToken = async (token, db) => {
  if (!token) return null;

  const tokenData = jwt.verify(token, process.env.JWT_SECRET);
  if (!tokenData?.id) return null;

  return await db.collection('Users').findOne({ _id: ObjectId(tokenData.id) });
}
