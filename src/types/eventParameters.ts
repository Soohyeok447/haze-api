/**
 * matching events
 */
export type RespondToIntroduceEvent = {
  userId: string;
  response: 'accept' | 'decline';
};

export type StartMatchingEvent = {
  userId: string;
};

export type CancelMatchingEvent = {
  userId: string;
};

export type LeaveWebchatEvent = {
  userId: string;
};

export type RequestFaceRecognitionEvent = {
  userId: string;
};

export type RespondFaceRecognitionEvent = {
  userId: string;
  response: 'accept' | 'decline';
  receivedTime: Date | string;
};

export type ReportUserEvent = {
  userId: string;
};

/**
 * webRTC events
 */
export type OfferEvent = {
  offer: RTCSessionDescriptionInit;
  roomName: string;
};

export type AnswerEvent = {
  answer: RTCSessionDescriptionInit;
  roomName: string;
};

export type IceEvent = {
  ice: RTCIceCandidate;
  roomName: string;
};
