import { Post, User } from '../../../models';
import { PostAttributes, PostCreationAttributes, PostUpdateAttributes } from '../../../models/Post';

export class PostService {
	static async getAll(): Promise<PostAttributes[]> {
		const posts = await Post.findAll({
			include: [{
				model: User,
				as: 'author',
				attributes: ['id', 'username', 'email']
			}]
		});
		return posts;
	}

	static async getById(id: string): Promise<PostAttributes | null> {
		const post = await Post.findOne({
			where: { id },
			include: [{
				model: User,
				as: 'author',
				attributes: ['id', 'username', 'email']
			}]
		});

		return post;
	}

	static async create(postData: PostCreationAttributes): Promise<PostCreationAttributes> {
		const post = await Post.create(postData);
		return post;
	}

	static async update(id: string, postData: Partial<PostUpdateAttributes>): Promise<PostAttributes | null> {
		const post = await Post.findByPk(id);
		if (!post) return null;

		await post.update(postData);

		return this.getById(id);
	}

	static async delete(id: string): Promise<boolean> {
		const deletedCount = await Post.destroy({ where: { id } });
		return deletedCount > 0;
	}
}