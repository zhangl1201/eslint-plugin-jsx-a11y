/**
 * @fileoverview Ensure media like audio and video don't have autoplay property.
 * @author Ling Zhang
 */

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

import { RuleTester } from 'eslint';
import test from 'tape';
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

const customSchema = [
  {
    audio: ['Audio'],
    video: ['Video'],
  },
];

const componentsSettings = {
  'jsx-a11y': {
    polymorphicPropName: 'as',
    components: {
      Audio: 'audio',
      Video: 'video',
    },
  },
};

const validCases = parsers.all([].concat(
  { code: '<div />;' },
  { code: '<video src="your_video_file.mp4"></video>;' },
  { code: '<audio src="your_audio_file.mp3"></audio>' },
  { code: '<Video src="your_video_file.mp4"></Video>;', options: customSchema },
  { code: '<Audio src="your_audio_file.mp3"></Audio>', options: customSchema },
  { code: '<Video src="your_video_file.mp4"></Video>;', settings: componentsSettings },
  { code: '<Audio src="your_audio_file.mp3"></Audio>', settings: componentsSettings },
)).map(parserOptionsMapper);

const invalidCases = parsers.all([].concat(
  { code: '<video src="your_video_file.mp4" autoplay></video>', errors: [expectedError] },
  { code: '<audio src="your_audio_file.mp3" autoplay></audio>', errors: [expectedError] },
  { code: '<Video src="your_video_file.mp4" autoplay></Video>;', options: customSchema, errors: [expectedError] },
  { code: '<Audio src="your_audio_file.mp3" autoplay></Audio>', options: customSchema, errors: [expectedError] },
  { code: '<Video src="your_video_file.mp4" autoplay></Video>;', settings: componentsSettings, errors: [expectedError] },
  { code: '<Audio src="your_audio_file.mp3" autoplay></Audio>', settings: componentsSettings, errors: [expectedError] },
)).map(parserOptionsMapper);

test('Testing rule media-no-autoplay valid cases', (t) => {
  validCases.forEach((validCase) => {
    let pass = false;
    try {
      ruleTester.run('media-no-autoplay', rule, {
        valid: [validCase],
        invalid: [],
      });
      pass = true;
    } catch (error) {
      pass = false;
    }
    if (pass) {
      t.pass(`Valid Case: ${validCase.code} pass.`);
    } else {
      t.fail(`Valid Case: ${validCase.code} fail.`);
    }
  });

  t.end();
});

test('Testing rule media-no-autoplay invalid cases', (t) => {
  invalidCases.forEach((invalidCase) => {
    let pass = false;
    try {
      ruleTester.run('media-no-autoplay', rule, {
        valid: [],
        invalid: [invalidCase],
      });
      pass = true;
    } catch (error) {
      pass = false;
    }
    if (pass) {
      t.pass(`InValid Case: ${invalidCase.code} pass.`);
    } else {
      t.fail(`InValid Case: ${invalidCase.code} fail.`);
    }
  });

  t.end();
});
