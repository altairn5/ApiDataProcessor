const orchestrate = (options) => {
  const { payload, keyModifiers, valueModifiers, deleteExcept } = options;

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

  if(deleteExcept) {
    // let childOfRelationshipMap = buildDependencyGraph(payload);
    // let fieldHierarchy = {};
    let orchestratedObject = {};

    deleteExcept.forEach((keyToKeep) => {
      buildDependencyGraph(payload, keyToKeep, orchestratedObject);
      // let parent = childOfRelationshipMap[keyToKeep];
      //
      // fieldHierarchy[keyToKeep] = [];
      // fieldHierarchy[keyToKeep].push(parent)
      //
      // while (childOfRelationshipMap[parent]) {
      //   let subParent = parent;
      //   parent = childOfRelationshipMap[subParent];
      //   fieldHierarchy[keyToKeep].push(parent)
      // }
    });

    // buildNewPayload(fieldHierarchy, payload)
  }
}

// const buildNewPayload = (fieldHierarchy, payload) => {
//   const orchestratedObject = {};
//   console.warn(fieldHierarchy)
//
//   Object.keys(fieldHierarchy).forEach((reqKey) => {
//     fieldHierarchy[reqKey].reverse();
//
//     fieldHierarchy[reqKey].forEach((parent) => {
//       orchestratedObject[parent] = payload[parent];
//
//     })
//   })
//   // fieldHierarchy.forEach((each) => {
//   //   console.warn(each)
//   //   // orchestratedObject[each] = payload[each]
//   // })
//   console.warn(orchestratedObject)
// }

/**
 * Build Dependecy Graph for all the fields and results in a
 * 'childOf' relationship map
 * @param  {Object} payload input payload object for orchestration
 * @return {Tuples}         Returns a map of subFields and their parents
 *                          [ child : parent, ....]
 */
const buildDependencyGraph = (payload, keyToKeep, orchestratedObject) => {
  let parent = [];
  Object.keys(payload).forEach((key) => {
    orchestratedObject[key] = undefined;

    let obj  = __buildUtil(payload, key, keyToKeep, parent, orchestratedObject, {}, undefined);

    if(obj){
      orchestratedObject[key] = obj;
      // console.warn(obj)
    }
    // console.warn(orchestratedObject)
  });
  return parent;
}

const __buildUtil = (payload, parentKey, keyToKeep, parent, orchestratedObject, tmpObj, tmpParent) => {

  if(parentKey === keyToKeep){
    tmpObj[parentKey] = payload[parentKey];
    return tmpObj
  }

  if(payload[parentKey].constructor === Object) {
    orchestratedObject[tmpParent] = undefined;

    Object.keys(payload[parentKey]).forEach((childKey) => {
      parent[childKey] = parentKey;

      let itsParent = payload[parentKey]
      let obj = __buildUtil(payload[parentKey], childKey, keyToKeep, parent, orchestratedObject, tmpObj, parentKey);

      if(obj){
        orchestratedObject = itsParent
        orchestratedObject[tmpParent] = obj;
      }




    })
  }
  console.warn(orchestratedObject)




  // if(Object.keys(tmpObj).length > 0){
  //   return tmpObj
  // } else {
  //   return;
  // }

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
