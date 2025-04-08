import { Comment, User, Post } from '../../../models';
import { CommentAttributes, CommentCreationAttributes, CommentUpdateAttributes } from '../../../models/Comment';

export class CommentService {
	static async getAll(): Promise<CommentAttributes[]> {
		const comments = await Comment.findAll({
			include: [{
				model: User,
				as: 'author',
				attributes: ['id', 'username', 'email']
			}, {
				model: Post,
				as: 'post',
				attributes: ['id', 'content']
			}]
		});
		return comments;
	}

	static async getById(id: string): Promise<CommentAttributes | null> {
		const comment = await Comment.findOne({
			where: { id },
			include: [{
				model: User,
				as: 'author',
				attributes: ['id', 'username', 'email']
			}, {
				model: Post,
				as: 'post',
				attributes: ['id', 'content']
			}]
		});

		return comment;
	}

	static async getByPostId(postId: string): Promise<CommentAttributes[]> {
		const comments = await Comment.findAll({
			where: { postId },
			include: [{
				model: User,
				as: 'author',
				attributes: ['id', 'username', 'email']
			}],
			order: [['createdAt', 'DESC']]
		});

		return comments;
	}

	static async create(commentData: CommentCreationAttributes): Promise<CommentCreationAttributes> {
		const comment = await Comment.create(commentData);
		return comment;
	}

	static async update(id: string, commentData: Partial<CommentUpdateAttributes>): Promise<CommentAttributes | null> {
		const comment = await Comment.findByPk(id);
		if (!comment) return null;

		await comment.update(commentData);

		return this.getById(id);
	}

	static async delete(id: string): Promise<boolean> {
		const deletedCount = await Comment.destroy({ where: { id } });
		return deletedCount > 0;
	}
}