import { LikeAttributes, LikeCreationAttributes } from "../../../models/Like";
import { User, Like } from "../../../models";

export class LikeService {
  static async getByCommentId(commentId: string) {
    const { count, rows } = await Like.findAndCountAll({
      where: { commentId },
      include: [{ model: User, as: "user", attributes: ["id", "username"] }],
      order: [["createdAt", "DESC"]],
    });

    return {
      likes: rows,
      count,
    };
  }

  static async getLikeCount(commentId: string) {
    const count = await Like.count({
      where: { commentId },
    });

    return { count };
  }

  static async findOne(
    criteria: Partial<LikeAttributes>
  ): Promise<LikeAttributes | null> {
    const like = await Like.findOne({
      where: criteria,
    });

    return like;
  }

  static async create(
    likeData: LikeCreationAttributes
  ): Promise<LikeAttributes> {
    const like = await Like.create(likeData);
    return like;
  }

  static async delete(userId: string, commentId: string): Promise<boolean> {
    const deletedCount = await Like.destroy({
      where: {
        userId,
        commentId,
      },
    });
    return deletedCount > 0;
  }
}
