// actionTypes.js
export const SET_USER = "SET_USER";
export const SET_ROOM = "SET_ROOM";

export const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

export const setRoom = (room) => ({
  type: SET_ROOM,
  payload: room,
});
