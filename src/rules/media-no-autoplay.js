/**
 * @fileoverview Ensure media like audio and video don't have autoplay property.
 * @author Ling Zhang
 * @flow
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

import type { JSXOpeningElement } from 'ast-types-flow';
import { getProp } from 'jsx-ast-utils';
import flatMap from 'array.prototype.flatmap';
import type { ESLintConfig, ESLintContext, ESLintVisitorSelectorConfig } from '../../flow/eslint';
import { generateObjSchema, arraySchema } from '../util/schemas';
import getElementType from '../util/getElementType';

const errorMessage = 'Media elements such as `<audio>` and `<video>` must not have `autoplay` property.';

const MEDIA_TYPES = ['audio', 'video'];

const schema = generateObjSchema({
  audio: arraySchema,
  video: arraySchema,
});

const isMediaType = (context, type) => {
  const options = context.options[0] || {};
  return MEDIA_TYPES
    .concat(flatMap(MEDIA_TYPES, (mediaType) => options[mediaType]))
    .some((typeToCheck) => typeToCheck === type);
};

export default ({
  meta: {
    docs: {
      url: 'https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/media-no-autoplay.md',
      description: 'Enforces that `<audio>` and `<video>` elements must not have `autoplay` property.',
    },
    schema: [schema],
  },

  create: (context: ESLintContext): ESLintVisitorSelectorConfig => ({
    JSXOpeningElement: (node: JSXOpeningElement) => {
      const elementType = getElementType(context);
      const type = elementType(node);
      if (!isMediaType(context, type)) {
        return;
      }
      const autoPlay = getProp(node.attributes, 'autoplay');
      if (autoPlay) {
        context.report({
          node,
          message: errorMessage,
        });
      }
    },
  }),
}: ESLintConfig);
