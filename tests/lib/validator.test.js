describe('# Testing Transformer\'s \"validate\" functionality', () => {

  test('should be able to validate a good payload with no errors', () => {

    const validator = require('../../lib/validator');

    const payload = {
      courseCode: 'CS',
      degree: 'Masters',
      status: 'Active',
      type: 'Full-time',
      research: false
    }

    const allowedValues = [
      {
        courseCode: ['CS', 'ECE', 'ARCH'],
        error: { code: 'ER-01', detail: 'Invalid Course Code.' }
      },
      {
        degree: ['Masters', 'Bachelors'],
        error: { code: 'ER-02', detail: 'Invalid Degree.' }
      },
      {
        status: ['Active', 'Registered'],
        error: { code: 'ER-03', detail: 'Status not active or registered.' }
      }
    ];

    const notAllowedValues = [
      {
        type: ['Part-time'],
        error: { code: 'ER-04', detail: 'Type cannot be Part-time' }
      },
      {
        research: [null, undefined],
        error: { code: 'ER-05', detail: 'Research field cannot be null or undefined.'}
      },
    ];

    try {
      validator({ payload, allowed: allowedValues, notAllowed: notAllowedValues })
    } catch(e) {
      expect(e).toBeNull()
    }

  });

  test('should be able to validate a bad payload with errors', () => {

    const validator = require('../../lib/validator');

    const payload = {
      courseCode: 'CS',
      degree: 'Masters',
      status: 'Inactive',
      type: 'Part-time',
      research: null
    }

    const allowedValues = [
      {
        courseCode: ['CS', 'ECE', 'ARCH'],
        error: { code: 'ER-01', detail: 'Invalid Course Code.' }
      },
      {
        degree: ['Masters', 'Bachelors'],
        error: { code: 'ER-02', detail: 'Invalid Degree.' }
      },
      {
        status: ['Active', 'Registered'],
        error: { code: 'ER-03', detail: 'Status not active or registered.' }
      }
    ];

    const notAllowedValues = [
      {
        type: ['Part-time'],
        error: { code: 'ER-04', detail: 'Type cannot be Part-time' }
      },
      {
        research: [null, undefined],
        error: { code: 'ER-05', detail: 'Research field cannot be null or undefined.'}
      },
    ];

    try {
      validator({ payload, allowed: allowedValues, notAllowed: notAllowedValues })
    } catch(e) {
      expect(e).toEqual([
        { code: 'ER-03', detail: 'Status not active or registered.' },
        { code: 'ER-04', detail: 'Type cannot be Part-time' },
        { code: 'ER-05',
          detail: 'Research field cannot be null or undefined.' }
      ]);
    }

  });

  test('should be able to validate a bad payload with errors not defined', () => {

    const validator = require('../../lib/validator');

    const payload = {
      courseCode: 'CS',
      degree: 'Masters',
      status: 'Inactive',
      type: 'Part-time',
      research: null
    }

    const allowedValues = [
      {
        courseCode: ['CS', 'ECE', 'ARCH'],
        error: { code: 'ER-01', detail: 'Invalid Course Code.' }
      },
      { degree: ['Masters', 'Bachelors'] },
      { status: ['Active', 'Registered'] }
    ];

    try {
      validator({ payload, allowed: allowedValues });
    } catch(e) {
      expect(e).toEqual([ 'Invalid "status" field value' ]);
    }

  });

  test('should be able to consume custom validation functions', () => {

    const validator = require('../../lib/validator');

    const payload = {
      courseCode: 'CS',
      degree: 'Masters',
      status: 'Inactive',
      type: 'Full-time',
      research: false,
      visa: 'Expired'
    }

    const allowedValues = [
      {
        courseCode: ['CS', 'ECE', 'ARCH'],
        error: { code: 'ER-01', detail: 'Invalid Course Code.' }
      },
      {
        degree: ['Masters', 'Bachelors'],
        error: { code: 'ER-02', detail: 'Invalid Degree.' }
      },
      {
        status: ['Active', 'Registered'],
        error: { code: 'ER-03', detail: 'Status not active or registered.' }
      }
    ];

    const notAllowedValues = [
      {
        type: ['Part-time'],
        error: { code: 'ER-04', detail: 'Type cannot be Part-time' }
      },
      {
        research: [null, undefined],
        error: { code: 'ER-05', detail: 'Research field cannot be null or undefined.'}
      },
    ];

    const customValidationFunctions = {
      isLegal: {
        func: function(payload) {
          return (payload.status === 'Active' && payload.visa === 'Active')
        },
        error: { code: 'ER-07', detail: 'Status Not Legal in country.' }
      }
    }

    try {
      validator({
        payload,
        allowed: allowedValues,
        notAllowed: notAllowedValues,
        customFunctions: customValidationFunctions
      });
    } catch(e) {
      expect(e).toEqual([ { code: 'ER-03', detail: 'Status not active or registered.' },
      { code: 'ER-07', detail: 'Status Not Legal in country.' } ])
    }

  });

  test('should throw the first error encountered when collectErrors is False', () => {

    const validator = require('../../lib/validator');

    const payload = {
      courseCode: 'CS',
      degree: 'Masters',
      status: 'Inactive',
      type: 'Full-time',
      research: false,
      visa: 'Expired'
    }

    const allowedValues = [
      {
        courseCode: ['CS', 'ECE', 'ARCH'],
        error: { code: 'ER-01', detail: 'Invalid Course Code.' }
      },
      {
        degree: ['Masters', 'Bachelors'],
        error: { code: 'ER-02', detail: 'Invalid Degree.' }
      },
      {
        status: ['Active', 'Registered'],
        error: { code: 'ER-03', detail: 'Status not active or registered.' }
      }
    ];

    try {
      validator({
        payload,
        allowed: allowedValues,
        collectErrors: false
      });
    } catch(e) {
      expect(e).toEqual({ code: 'ER-03', detail: 'Status not active or registered.' })
    }

  });

});
