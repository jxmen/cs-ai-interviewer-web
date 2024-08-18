import { SERVER_BASE_URL } from "@/src/constant/urls";

async function fetchChats(subjectId) {
  const response = await fetch(`${SERVER_BASE_URL}/api/v1/subjects/${subjectId}/chats`, {
    credentials: 'include',
  });

  return await response.json()
}

async function fetchSubjectDetail(subjectId) {
  const response = await fetch(`${SERVER_BASE_URL}/api/v1/subjects/${subjectId}`);

  return await response.json()
}


async function fetchAnswer(subjectId, answer) {
  const response = await fetch(`${SERVER_BASE_URL}/api/v4/subjects/${subjectId}/answer`, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ answer })
  });

  return await response.json()
}

async function fetchMySubjects(category) {
  const response = await fetch(`${SERVER_BASE_URL}/api/v1/subjects/my?category=${category}`, {
    credentials: 'include',
  });

  return await response.json()
}

async function fetchSubjects(category) {
  const response = await fetch(`${SERVER_BASE_URL}/api/v1/subjects?category=${category}`);
  return await response.json()
}

async function fetchSubjectChatArchive(subjectId) {
  const response = await fetch(`${SERVER_BASE_URL}/api/v2/subjects/${subjectId}/chats/archive`, {
    method: 'POST',
    credentials: 'include',
  });

  return await response.json()
}

export {
  fetchChats,
  fetchSubjectDetail,
  fetchAnswer,
  fetchSubjects,
  fetchSubjectChatArchive,
  fetchMySubjects,
};
