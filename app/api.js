import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";

const SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL

async function fetchChats(subjectId, sessionId) {
  const headers = {}
  if (sessionId) {
    headers['Cookie'] = `SESSION=${sessionId}`
  }

  const response = await fetch(`${SERVER_BASE_URL}/api/chat/messages?subjectId=${subjectId}`, {
    credentials: 'include',
    headers
  })

  const json = await response.json();
  return {
    data: json.data || [],
    isError: response.status >= 400
  }
}

async function fetchSubjectDetail(subjectId) {
  const response = await fetch(`${SERVER_BASE_URL}/api/subjects/${subjectId}`);
  if (!response.ok) {
    return {
      data: null,
      isError: true
    };
  }

  const data = await response.json();
  return {
    data: data,
    isError: false
  };
}

async function fetchAnswer(subjectId, sessionId, answer) {
  const headers = {
    'Content-Type': 'application/json'
  }
  if (sessionId) {
    headers['Cookie'] = `SESSION=${sessionId}`
  }

  const response = await fetch(`${SERVER_BASE_URL}/api/subjects/${subjectId}/answer`, {
    credentials: 'include',
    method: 'POST',
    headers,
    body: JSON.stringify({ answer })
  });

  const json = await response.json();
  return {
    data: json,
    isError: response.status >= 400
  }
}

export {
  fetchChats,
  fetchSubjectDetail,
  fetchAnswer
};
