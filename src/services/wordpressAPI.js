import axios from 'axios';

// WordPress API base URL - this will be your WP Engine headless WordPress URL
const WP_API_BASE_URL = process.env.REACT_APP_WP_API_URL || 'https://fitness4.wpenginepowered.com/wp-json/wp/v2';

// Create axios instance with default config
const wpAPI = axios.create({
  baseURL: WP_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// WordPress API service
export const wordpressAPI = {
  // Get all posts with optional parameters
  getPosts: async (params = {}) => {
    try {
      const response = await wpAPI.get('/posts', {
        params: {
          _embed: true, // Include featured images and author info
          per_page: params.perPage || 10,
          page: params.page || 1,
          search: params.search || '',
          categories: params.categories || '',
          ...params
        }
      });
      return {
        posts: response.data,
        totalPages: parseInt(response.headers['x-wp-totalpages']) || 1,
        totalPosts: parseInt(response.headers['x-wp-total']) || 0
      };
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw new Error('Failed to fetch blog posts');
    }
  },

  // Get single post by slug
  getPostBySlug: async (slug) => {
    try {
      const response = await wpAPI.get('/posts', {
        params: {
          slug: slug,
          _embed: true
        }
      });
      
      if (response.data.length === 0) {
        throw new Error('Post not found');
      }
      
      return response.data[0];
    } catch (error) {
      console.error('Error fetching post:', error);
      throw new Error('Failed to fetch blog post');
    }
  },

  // Get page by slug with ACF fields
  getPageBySlug: async (slug) => {
    try {
      const response = await wpAPI.get('/pages', {
        params: {
          slug: slug,
          _embed: true,
          acf_format: 'standard' // Include ACF fields
        }
      });
      
      if (response.data.length === 0) {
        throw new Error('Page not found');
      }
      
      return response.data[0];
    } catch (error) {
      console.error('Error fetching page:', error);
      throw new Error('Failed to fetch page');
    }
  },

  // Get all pages
  getPages: async () => {
    try {
      const response = await wpAPI.get('/pages', {
        params: {
          _embed: true,
          per_page: 100 // Get all pages
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching pages:', error);
      throw new Error('Failed to fetch pages');
    }
  },

  // Get categories
  getCategories: async () => {
    try {
      const response = await wpAPI.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }
  },

  // Get featured posts
  getFeaturedPosts: async (count = 3) => {
    try {
      const response = await wpAPI.get('/posts', {
        params: {
          _embed: true,
          per_page: count,
          sticky: true // WordPress sticky posts as featured
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching featured posts:', error);
      throw new Error('Failed to fetch featured posts');
    }
  },

  // Search posts
  searchPosts: async (query, page = 1) => {
    try {
      const response = await wpAPI.get('/posts', {
        params: {
          search: query,
          _embed: true,
          per_page: 10,
          page: page
        }
      });
      return {
        posts: response.data,
        totalPages: parseInt(response.headers['x-wp-totalpages']) || 1,
        totalPosts: parseInt(response.headers['x-wp-total']) || 0
      };
    } catch (error) {
      console.error('Error searching posts:', error);
      throw new Error('Failed to search posts');
    }
  }
};

// Utility functions for WordPress data
export const wpUtils = {
  // Extract featured image URL
  getFeaturedImageUrl: (post, size = 'medium_large') => {
    if (post._embedded && post._embedded['wp:featuredmedia']) {
      const media = post._embedded['wp:featuredmedia'][0];
      return media.media_details?.sizes?.[size]?.source_url || media.source_url;
    }
    return null;
  },

  // Extract author name
  getAuthorName: (post) => {
    if (post._embedded && post._embedded.author) {
      return post._embedded.author[0].name;
    }
    return 'Unknown Author';
  },

  // Extract excerpt without HTML tags
  getCleanExcerpt: (post, maxLength = 150) => {
    const excerpt = post.excerpt?.rendered || '';
    const cleanExcerpt = excerpt.replace(/<[^>]*>/g, '').trim();
    return cleanExcerpt.length > maxLength 
      ? cleanExcerpt.substring(0, maxLength) + '...'
      : cleanExcerpt;
  },

  // Format date
  formatDate: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  // Get category names
  getCategoryNames: (post) => {
    if (post._embedded && post._embedded['wp:term']) {
      const categories = post._embedded['wp:term'][0] || [];
      return categories.map(cat => cat.name);
    }
    return [];
  },

  // Get ACF field value with fallback
  getACFField: (page, fieldName, fallback = '') => {
    return page?.acf?.[fieldName] || fallback;
  },

  // Get ACF repeater field
  getACFRepeater: (page, fieldName, fallback = []) => {
    const repeater = page?.acf?.[fieldName];
    return Array.isArray(repeater) ? repeater : fallback;
  },

  // Get ACF image field
  getACFImage: (page, fieldName, size = 'medium_large') => {
    const image = page.acf?.[fieldName];
    if (typeof image === 'object' && image?.sizes) {
      return image.sizes[size] || image.url;
    }
    return typeof image === 'string' ? image : null;
  }
};

export default wordpressAPI;
