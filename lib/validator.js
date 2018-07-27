const validate = ({ payload, allowed=[], notAllowed=[], customFunctions, collectErrors=true }) => {
  let errors = [];

  allowed.forEach((validation) => {
    let eachKey = Object.keys(validation)[0];
    let allowedValues = validation[eachKey];

    if(!allowedValues.includes(payload[eachKey])) {
      if(validation.error) {
        __manageErrors(validation.error, errors, collectErrors);
      } else {
        __manageErrors(`Invalid \"${eachKey}\" field value`, errors, collectErrors);
      }
    }
  });

  notAllowed.forEach((validation) => {
    let eachKey = Object.keys(validation)[0];
    let notAllowedValues = validation[eachKey];

    if(notAllowedValues.includes(payload[eachKey])) {
      if(validation.error) {
        __manageErrors(validation.error, errors, collectErrors);
      } else {
        __manageErrors(`Invalid \"${eachKey}\" field value`, errors, collectErrors);
      }
    }
  });

  if(customFunctions){
    Object.keys(customFunctions).forEach((eachFunc) => {
      let validationFunction = customFunctions[eachFunc].func;
      let error = customFunctions[eachFunc].error;

      if(!validationFunction(payload)){
        if(error){
          __manageErrors(error, errors, collectErrors);
        } else {
          __manageErrors(`${eachFunc} returned False.`, errors, collectErrors);
        }
      }
    });
  }

  if(errors.length > 0) { throw errors };

  return;
}

const __manageErrors = (error, errorsList, collectErrors) => {
  if(collectErrors){
    errorsList.push(error);
  } else {
    throw error;
  }
}

module.exports = validate;
