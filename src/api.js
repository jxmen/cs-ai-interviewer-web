import { SERVER_BASE_URL } from "@/src/constant/urls";

async function fetchSubjects(category) {
  const response = await fetch(`${SERVER_BASE_URL}/api/v1/subjects?category=${category}`);

  return await response.json()
}

async function fetchSubjectDetail(subjectId) {
  const response = await fetch(`${SERVER_BASE_URL}/api/v1/subjects/${subjectId}`);

  return await response.json()
}

async function fetchChats(subjectId, accessToken) {
  const response = await fetch(`${SERVER_BASE_URL}/api/v1/subjects/${subjectId}/chats`, {
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  });

  return await response.json()
}

async function fetchMySubjects(category, accessToken) {
  const response = await fetch(`${SERVER_BASE_URL}/api/v1/subjects/my?category=${category}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  return await response.json()
}

async function fetchSubjectChatArchive(subjectId, accessToken) {
  const response = await fetch(`${SERVER_BASE_URL}/api/v2/subjects/${subjectId}/chats/archive`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  return await response.json()
}

export {
  fetchChats,
  fetchSubjectDetail,
  fetchSubjects,
  fetchSubjectChatArchive,
  fetchMySubjects,
};
