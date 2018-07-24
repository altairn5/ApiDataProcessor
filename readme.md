This Library provides toolset for easy orchestration, transformation and validation of data fields and values in a most simplistic and elegant way.
Reduces code complexity and ugliness via a simple very specific interface.

## Installation

Using npm:

```javascript
$ npm i --save api-processor
```

In Node.js:

```javascript
const apiProcessor = require('api-processor')
```

## Usage

### .validate
Validates a data payload against a list of allowed and not allowed values.<br/>
Consumes a payload to be validated with schemas for allowed values and not allowed values passed as arguments

#### Syntax
```javascript
apiProcessor.validate({
  payload: payloadToBeValidated,
  allowed: listOfAllowedValues,
  notAllowed: listOfNotAllowedValues
})
```

If you want to define your own custom `errors`, make sure you add an error object in your validation schema like:

```
const list = [
  {
    field: <listOfAllowedValues>(Array),
    error: <customErrorObject>(Object, Optional)
  }
]
```

#### Example
Following is a complete example of the usage:

```javascript

const payload = {
  courseCode: 'CS',
  degree: 'Masters',
  status: 'Active',
  type: 'Part-time',
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
    research: [null, undefined]
  },
];

try {
  validator({
    payload,
    allowed: allowedValues,
    notAllowed: notAllowedValues
  });
} catch(e) {
  console.error(e);
}
```

#### Output :
 `[ { code: 'ER-04', detail: 'Type cannot be Part-time' } ]`

The beauty of this approach is that you can save all the validation lists as schema in a config file somewhere separate in the code, <b>keeping the code clean</b> and validate the whole payload all at once.


## Coming Soon..(In Progress)

### .orchestrate
This functionality will let you orchestrate values of the fields in your complex data model with depths and nested objects.
This functionality will eliminate all the complexity of depth traversal of nested Objects in Javascript and help you orchestrate key and values using `keyModifiers` and `valueModifiers`

#### Possible Example
```javascript
apiProcessor.orchestrate({
  payload: payloadToBeOrchestrated,
  keyModifiers: [
    { oldFieldName1: newFieldName1 },
    { oldFieldName2: newFieldName2 }
  ]
  valueModifiers: [
    { key1: 'newValue1' },
    { key2: 'newValue2' }
  ]
})
```

### .transform (Ideas welcomed)
This functionality will let you transform your complex nested data payload object to the way you want by specifying a template.

#### Possible Example
```javascript
apiProcessor.transform({
  payload: payloadToBeTransformed,
  transformTo: // some transformation template (still thinking of the approach..)
})
```
