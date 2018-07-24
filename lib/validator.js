const validate = ({ payload, allowed=[], notAllowed=[] }) => {
  let errors = [];

  allowed.forEach((validation) => {
    let eachKey = Object.keys(validation)[0];
    let allowedValues = validation[eachKey];

    if(!allowedValues.includes(payload[eachKey])) {
      if(validation.error) {
        errors.push(validation.error);
      } else {
        errors.push(`Invalid \"${eachKey}\" field value`);
      }
    }
  });

  notAllowed.forEach((validation) => {
    let eachKey = Object.keys(validation)[0];
    let notAllowedValues = validation[eachKey];

    if(notAllowedValues.includes(payload[eachKey])) {
      if(validation.error) {
        errors.push(validation.error);
      } else {
        errors.push(`Invalid \"${eachKey}\" field value`);
      }
    }
  });

  if(errors.length > 0) { throw errors };

  return;
}

module.exports = validate;
