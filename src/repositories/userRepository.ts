import { User, UserModel } from '../models/userModel';

class UserRepository {
  public async create({
    id,
    refreshToken,
    gender,
    nickname,
    birth,
    location,
    interests,
    purpose,
    bans,
    reported,
  }): Promise<User> {
    try {
      const user = new UserModel({
        id,
        refreshToken,
        gender,
        nickname,
        birth,
        location,
        interests,
        purpose,
        bans,
        reported,
      });

      return await user.save();
    } catch (error) {
      throw error;
    }
  }

  public async findById(id: string): Promise<User | null> {
    try {
      return await UserModel.findOne({ id }).exec();
    } catch (error) {
      throw error;
    }
  }

  public async update({
    id,
    refreshToken,
    nickname,
    birth,
    location,
    interests,
    purpose,
    bans,
    reported,
  }: Partial<User>): Promise<User | null> {
    try {
      const updatedUser = await UserModel.findOneAndUpdate(
        { id },
        {
          refreshToken,
          nickname,
          birth,
          location,
          interests,
          purpose,
          bans,
          reported,
        },
        { new: true },
      ).exec();

      return updatedUser || null;
    } catch (error) {
      throw error;
    }
  }
}

export default new UserRepository();
