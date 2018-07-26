const orchestrate = ({ payload, keyModifiers, valueModifiers, deleteExcept }) => {
  if(keyModifiers){
    Object.keys(keyModifiers).forEach((eachKey) => {
      searchAndReplace(payload, eachKey, keyModifiers[eachKey], 'renameKey')
    })
  }

  if(valueModifiers){
    Object.keys(valueModifiers).forEach((eachKey) => {
      searchAndReplace(payload, eachKey, valueModifiers[eachKey], 'replaceValue')
    })
  }
}

const searchAndReplace = (payload, toReplace, replacer, toDo) => {
  Object.keys(payload).forEach((key) => {

    if(key === toReplace){

      if(toDo === 'renameKey') {
        payload[replacer] = payload[toReplace];
        delete payload[toReplace];
        return;
      }

      if(toDo === 'replaceValue') {
        payload[toReplace] = replacer;
        return;
      }
    }

    if(payload[key].constructor === Object) {
      searchAndReplace(payload[key], toReplace, replacer, toDo)
    }

  });
}
module.exports = orchestrate
