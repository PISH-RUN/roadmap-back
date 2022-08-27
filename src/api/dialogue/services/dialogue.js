'use strict';

/**
 * dialogue service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::dialogue.dialogue');
