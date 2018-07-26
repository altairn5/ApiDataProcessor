describe('# Testing Transformer\'s \"validate\" functionality', () => {

  test('should be able to orchestrate fields in a payload', () => {
    const orchestrate = require('../../lib/orchestrator');

    const dummyPayload = {
      student: {
        name: 'John Wick',
        degree: {
          type: 'Masters',
          status: 'Full-time',
          course: {
            courseName: 'Computer Science',
            courseCode: 'CS'
          }
        },
      },
      school: {
        schoolName: 'Massachusetts Insititute of Technology',
        affiliation: false,
        address: {
          city: 'Cambridge',
          state: 'Massachusetts',
          country: 'US'
        }
      }
    };

    // keep and delete couldn't go together -- ERROR
    orchestrate({
      payload: dummyPayload,
      keyModifiers: {
        'name': 'studentName',
        'type': 'degreeType',
      },
      valueModifiers: {
        'studentName': 'Ethan Hunt',
        'courseName': 'Political Science',
        'affiliation': true
      },
      deleteExcept: ['student', 'schoolName', 'affiliation']
    });

    console.warn(JSON.stringify(dummyPayload,undefined,2));


  });

});
