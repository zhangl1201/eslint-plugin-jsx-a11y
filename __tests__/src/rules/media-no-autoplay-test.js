/**
 * @fileoverview Ensure media like audio and video don't have autoplay property.
 * @author Ling Zhang
 */

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

import { RuleTester } from 'eslint';
import parserOptionsMapper from '../../__util__/parserOptionsMapper';
import parsers from '../../__util__/helpers/parsers';
import rule from '../../../src/rules/media-no-autoplay';

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester();

const expectedError = {
  message: 'Media elements such as `<audio>` and `<video>` must not have `autoplay` property.',
  type: 'JSXOpeningElement',
};

ruleTester.run('media-no-autoplay', rule, {
  valid: parsers.all([].concat([
    { code: '<div />;' },
    { code: '<video src="your_video_file.mp4"></video>;' },
    { code: '<audio src="your_audio_file.mp3"></audio>' },
  ]).map(parserOptionsMapper)),
  invalid: parsers.all([].concat([
    { code: '<video src="your_video_file.mp4" autoplay></video>', errors: [expectedError] },
    { code: '<audio src="your_audio_file.mp3" autoplay></audio>', errors: [expectedError] },
  ]).map(parserOptionsMapper)),
});
