import { SERVER_BASE_URL } from "@/src/constant/urls";
import { EventSourcePolyfill, NativeEventSource } from "event-source-polyfill";

const EventSource = EventSourcePolyfill || NativeEventSource;

const getAnswerEventSource = (subjectId, answer, accessToken) => {
  return new EventSource(`${SERVER_BASE_URL}/api/v5/subjects/${subjectId}/answer?message=${answer}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    withCredentials: true
  })
}

export {
  getAnswerEventSource
}

