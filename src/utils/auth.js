import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export function getToken(user) {
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' });
}

export async function getUserFromToken(token, db) {
  if (!token) return null;

  const tokenData = jwt.verify(token, process.env.JWT_SECRET);
  if (!tokenData?.id) return null;

  return db.collection('Users').findOne({ _id: ObjectId(tokenData.id) });
}
