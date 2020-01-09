'use strict';
const Model = require("../models");
const AbstractService = require("./abstract").AbstractService;

class PostService extends AbstractService {

    /**
     * Create post
     * @param {Object} params
     */
    static async createPost(params) {
        try {   
            params.userId = params.currentUser.userId;
            
            const existingPost = await Model.Post.getByTitle(params.post.postTitle);
            if(existingPost) {
                super.throwCustomError(existingPost, 'Post is already exist.!');
            }

            const post = await Model.Post.build(params);

            post.create();

        return post;

        }catch(error) {
            super.throwCustomError(error, "An error occured during post creating process!")
        }
    }


    /**
     * Get post by userId
     * @param {Object} params
     */
    static async getPostByUser(params) {
        try {
            const posts = await Model.Post.getByUser(params.currentUser.userId);
            if(!posts) {
                super.throwCustomError(posts, "There is no posts!");
            } 

        return posts;

        }catch(error) {
            super.throwCustomError(error, "An error occured while retrieve posts by user!")
        }
    }


    /**
     * Get all posts
     */
    static async getAllPosts() {
        try {
            const posts = await Model.Post.getPosts();
            if(!posts) {
                super.throwCustomError(posts, "Posts not found!");
            }

        return posts;

        }catch(error) {
            super.throwCustomError(error, "An error occured while retrieve posts!")
        }
    }


    /**
     * Update post by postId
     * @param {Object} params
     */
    static async updatePost(params) {
        try {
            const post = await Model.Post.getById(params);
            if(!post) {
                super.throwCustomError(post, "Post not found!");
            }

            post.merge(params);

            post.update();

        return post;

        }catch(error) {
            super.throwCustomError(error, "Error")
        }
    }


    /**
     * Delete post by postId
     * @param {Object} params
     */
    static async deletePost(params) {
        try {
            const post = await Model.Post.getById(params);
            if(!post) {
                super.throwCustomError(post, "Post not found!");
            }

            post.delete();   

        return post;

        }catch(error) {
            super.throwCustomError(error, "Error");
        }
    }
}

module.exports.PostService = PostService;