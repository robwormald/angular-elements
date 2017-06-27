export function createStore(reducer:any, initialState:any){

  let state = reducer(initialState, {type: '@@INIT'})

  function dispatch(action:any){}


  return {
	  dispatch
  }
}
