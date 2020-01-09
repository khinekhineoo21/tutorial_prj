'use strict';

const uuidv4 = require('uuid/v4');
const moment = require('moment');
const Schema = require('../schemas');
const CustomUtils = require('../utils/CustomUtils').CustomUtils;
const CustomError = require("../utils/customErrors").CustomError;
const AbstractModel = require('./abstract');
const CustomValidator = require("../utils/customValidator").CustomValidator;

class PostModel extends AbstractModel {
    constructor(params = {}) {
        super();
        this.id = params.id;
        this.postId = params.postId;
        this.postTitle = params.postTitle;
        this.postDescription = params.postDescription;
        this.author = params.author;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
    }

    
    /**
     * Build post
     */
    static async build(params) {
        this.id = uuidv4();
        const post = new PostModel({
            id: this.id,
            postId: this.id,
            postTitle: params.post.postTitle,
            postDescription: params.post.postDescription,
            author: params.userId,
            createdAt: moment().format('YYYY-M-D HH:mm A'),
            updatedAt: moment().format('YYYY-M-D HH:mm A')
        });
        return post;
    }

    
    /**
     * Get post by postTitle
     * @params {String} postTitle
     */
    static async getByTitle(postTitle) {
        const post = await Schema.Post.findOne({ postTitle });
        return this.toModel(post);
    }


    /**
     * Get post by author
     * @params {String} author
     */
    static async getByUser(author) {
        let posts = [];
        posts = await Schema.Post.find({ author });
        const results = posts.map(post => {
            return this.toModel(post);
        });
        return results;
    }


    /**
     * Get posts
     */
    static async getPosts() {
        let posts = [];
        posts = await Schema.Post.find();
        const results = posts.map(post => {
            return this.toModel(post);
        });
        return results;
    }

    
    /**
     * Create post
     */
    async create() {
        const post = new Schema.Post(this);
        post.save();
        return this.constructor.toModel(post);
    }

    
    /**
     * Get post by postId,author
     * @params {object} params
     */
    static async getById(params) {
        const post = await Schema.Post.findOne({ postId: params.postId, author: params.currentUser.userId });
        return this.toModel(post);
    }

    
    /**
     * Merge post
     * @params {object} params
     */
    async merge(params) {
        if(params.post.postTitle !== undefined) {
            this.postTitle = params.post.postTitle;
        }
        if(params.post.postDescription !== undefined) {
            this.postDescription = params.post.postDescription;
        }
        this.updatedAt = moment().format('YYYY-M-D HH:mm A'); 
    }

    
    /**
     * Update post
     */
    async update() {
        const post = await Schema.Post.findOneAndUpdate(
          { postId: this.id },
          {
            postTitle: this.postTitle,
            postDescription: this.postDescription,
            updatedAt: this.updatedAt
          }
        );

    return this.constructor.toModel(post);
    }

    
    /**
     * Delete post
     */
    async delete() {
        const post = await Schema.Post.findOneAndDelete({ postId: this.id});
        return this.constructor.toModel(post);
    }
    
    
    /**
     * @param {Object} params
     * @return {PostModel|null}
     */
    static toModel(params) {
        if(!params) return null;
        const post = {
            id: params.postId !== undefined ? params.postId: null,
            postId: params.postId !== undefined ? params.postId: null,
            postTitle: params.postTitle !== undefined ? params.postTitle: null,
            postDescription: params.postDescription !== undefined ? params.postDescription: null,
            author: params.author !== undefined ? params.author: null,
            createdAt: params.createdAt !== undefined ? params.createdAt: null,
            updatedAt: params.updatedAt !== undefined ? params.updatedAt: null
        }
      return new PostModel(post);
    }
}

module.exports.PostModel = PostModel