'use strict';

const fetch = require('cross-fetch');

// Action Types
const CHAT_REQUEST = 'CHAT_REQUEST';
const CHAT_SUCCESS = 'CHAT_SUCCESS';
const CHAT_FAILURE = 'CHAT_FAILURE';

const GET_MESSAGES_REQUEST = 'GET_MESSAGES_REQUEST';
const GET_MESSAGES_SUCCESS = 'GET_MESSAGES_SUCCESS';
const GET_MESSAGES_FAILURE = 'GET_MESSAGES_FAILURE';

const FETCH_RESPONSE_REQUEST = 'FETCH_RESPONSE_REQUEST';
const FETCH_RESPONSE_SUCCESS = 'FETCH_RESPONSE_SUCCESS';
const FETCH_RESPONSE_FAILURE = 'FETCH_RESPONSE_FAILURE';

const GET_INFORMATION_REQUEST = 'GET_INFORMATION_REQUEST';
const GET_INFORMATION_SUCCESS = 'GET_INFORMATION_SUCCESS';
const GET_INFORMATION_FAILURE = 'GET_INFORMATION_FAILURE';

const RESET_CHAT_STATE = 'RESET_CHAT_STATE';
const RESET_CHAT_SUCCESS = 'RESET_CHAT_SUCCESS';

const UPDATE_MESSAGE = 'UPDATE_MESSAGE';

// Sync Action Creators
const messageRequest = () => ({ type: CHAT_REQUEST, isSending: true });
const messageSuccess = (message) => ({ type: CHAT_SUCCESS, payload: { message }, isSending: false });
const messageFailure = (error) => ({ type: CHAT_FAILURE, payload: error, error: error, isSending: false });

const responseRequest = () => ({ type: FETCH_RESPONSE_REQUEST, isSending: true });
const responseSuccess = (response) => ({ type: FETCH_RESPONSE_SUCCESS, payload: response, isSending: false });
const responseFailure = (error) => ({ type: FETCH_RESPONSE_FAILURE, payload: error, error: error, isSending: false });

const getMessagesRequest = () => ({ type: GET_MESSAGES_REQUEST, isSending: true });
const getMessagesSuccess = (messages) => ({ type: GET_MESSAGES_SUCCESS, payload: { messages }, isSending: false });
const getMessagesFailure = (error) => ({ type: GET_MESSAGES_FAILURE, payload: error, error: error, isSending: false });

const getMessageInformationRequest = () => ({ type: GET_INFORMATION_REQUEST });
const getMessageInformationSuccess = (info) => ({ type: GET_INFORMATION_SUCCESS, payload: info });
const getMessageInformationFailure = (error) => ({ type: GET_INFORMATION_FAILURE, payload: error, error: error });

const resetChatSuccess = () => ({ type: RESET_CHAT_SUCCESS });

const updateMessage = (messageId, updates) => ({ type: UPDATE_MESSAGE, payload: { messageId, updates } });

// Async Action Creator (Thunk)
const resetChat = (message) => {
  return async (dispatch, getState) => {
    dispatch(resetChatSuccess());
  };
}

const submitMessage = (message, collection_id = null) => {
  return async (dispatch, getState) => {
    dispatch(messageRequest());
    const token = getState().auth.token;

    try {
      let requestBody = { ...message };
      const response = await fetch('/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const result = await response.json();
      dispatch(messageSuccess(result));
    } catch (error) {
      dispatch(messageFailure(error.message));
    }
  };
};

const submitStreamingMessage = (message, collection_id = null) => {
  return async (dispatch, getState) => {
    dispatch(messageRequest());
    const token = getState().auth.token;

    try {
      let requestBody = { ...message, streaming: true };
      const response = await fetch('/messages/stream', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const result = await response.json();
      dispatch(messageSuccess(result));

      // Return the conversation ID for streaming setup
      return result.object;
    } catch (error) {
      dispatch(messageFailure(error.message));
      throw error;
    }
  };
};

const fetchResponse = (message) => {
  return async (dispatch, getState) => {
    dispatch(responseRequest());
    const token = getState().auth.token;

    try {
      let requestBody = { ...message };
      const response = await fetch('/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const result = await response.json();
      dispatch(responseSuccess(result));
    } catch (error) {
      dispatch(responseFailure(error.message));
    }
  };
};

const regenAnswer = (message, collection_id = null) => {
  return async (dispatch, getState) => {
    dispatch(messageRequest());
    const token = getState().auth.token;

    message.temperature = 'extreme';
    message.regenerate = true;

    // Start with the original message
    let requestBody = { ...message };

    try {
      const response = await fetch(`/messages/${message.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Temperature': message.temperature
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const result = await response.json();
      dispatch(messageSuccess(result));
    } catch (error) {
      dispatch(messageFailure(error.message));
    }
  };
};

const getMessages = (params = {}) => {
  return async (dispatch, getState) => {
    dispatch(getMessagesRequest());

    const state = getState();
    const token = state.auth.token;

    // TODO: re-evaluate this... is this safe?
    if (!params.conversation_id) params.conversation_id = state.chat.message.conversation;

    try {
      const response = await fetch('/messages?' + new URLSearchParams(params), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const result = await response.json();

      dispatch(getMessagesSuccess(result));
    } catch (error) {
      dispatch(getMessagesFailure(error.message));
    }
  };
};

const getMessageInformation = (request) => {
  return async (dispatch, getState) => {
    dispatch(getMessageInformationRequest());
    try {
      const state = getState();
      const token = state.auth.token;
      const response = await fetch('/documents', {
        method: 'SEARCH',
        headers: {
          //        'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      const info = await response.json();

      dispatch(getMessageInformationSuccess(info));
    } catch (error) {
      dispatch(getMessageInformationFailure(error.message));
    }
  }
}

module.exports = {
  resetChat,
  submitMessage,
  submitStreamingMessage,
  fetchResponse,
  getMessages,
  regenAnswer,
  getMessageInformation,
  updateMessage,
  CHAT_SUCCESS,
  CHAT_FAILURE,
  CHAT_REQUEST,
  GET_MESSAGES_REQUEST,
  GET_MESSAGES_SUCCESS,
  GET_MESSAGES_FAILURE,
  FETCH_RESPONSE_REQUEST,
  FETCH_RESPONSE_SUCCESS,
  FETCH_RESPONSE_FAILURE,
  RESET_CHAT_STATE,
  RESET_CHAT_SUCCESS,
  UPDATE_MESSAGE
};
