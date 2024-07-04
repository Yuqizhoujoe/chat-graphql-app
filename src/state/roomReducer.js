import { SET_ROOM } from "./actions";

const initialState = {
  room: null,
};

const roomReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ROOM:
      return {
        ...state,
        room: action.payload,
      };
    default:
      return state;
  }
};

export default roomReducer;
