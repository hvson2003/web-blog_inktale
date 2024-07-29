/**
 * @license Apache-2.0
*/

'use strict';

/**
 * node modules
 */
const router = require('express').Router();

/**
 * custom modules
 */
const renderBlogDetail = require('../controllers/blog_detail_controller');
const { updateReaction, deleteReaction } = require('../controllers/reaction_controller');

// GET route: Render the blog detail page
router.get('/:blogId', renderBlogDetail);

// PUT route: Update blog reactions
router.put('/:blogId/reactions', updateReaction);

// DELETE route: Delete blog reactions
router.delete('/:blogId/reactions', deleteReaction);

module.exports = router;