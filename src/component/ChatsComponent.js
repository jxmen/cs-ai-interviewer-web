"use client"

import { useEffect, useState } from "react";
import { fetchAnswer, fetchChats } from "@/app/api";
import { Alert, Button, CircularProgress, Divider, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function ChatsComponent({ subjectId, subjectDetailQuestion, sessionId, token }) {
  const [chats, setChats] = useState([])
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [isChatError, setIsChatError] = useState(false)

  const [isSubmitAnswerLoading, setIsSubmitAnswerLoading] = useState(false)
  const [isSubmitAnswerError, setIsSubmitAnswerError] = useState(false)

  useEffect(() => {
    const question = { type: "question", message: subjectDetailQuestion };
    if (!token) {
      setChats([question]);
      return;
    }
    setIsChatLoading(true);
    fetchChats(subjectId, sessionId, token).then(({ data, isError }) => {
      if (isError) {
        setIsChatLoading(false)
        setIsChatError(true)
        return
      }

      if (data.length === 0) {
        setChats([question])
      } else {
        setChats([question, ...data])
      }
      setIsChatLoading(false)
    })
  }, [subjectId, subjectDetailQuestion, sessionId]);

  const addAnswerChat = (score, message) => {
    setChats((prevChats) => [...prevChats, { type: "answer", message, score }])
  }
  const addQuestionChat = (message) => {
    setChats((prevChats) => [...prevChats, { type: "question", message }])
  }
  /**
   * 점수가 없는 빈 답변을 추가한다.
   */
  const addDummyAnswerChat = (message) => {
    setChats((prevChats) => [...prevChats, { type: "answer", message }])
  }
  const deleteLastChat = () => {
    setChats((prevChats) => prevChats.slice(0, -1))
  }
  const submitAnswer = async () => {
    setIsSubmitAnswerLoading(true)
    await _submitAnswer()
    setIsSubmitAnswerLoading(false)
  }
  const _submitAnswer = async () => {
    const answerElement = document.getElementById('answer')
    const answer = answerElement.value
    answerElement.value = ""

    // 우선 제공한 내용을 기반으로 스코어가 없는 더미 답변을 생성한다.
    addDummyAnswerChat(answer)
    const { data, isError } = await fetchAnswer(subjectId, sessionId, answer, token)
    if (isError) {
      deleteLastChat()
      setIsSubmitAnswerError(true)
      return
    }

    // 기존 더미 답변을 지우고 점수가 매겨진 새로운 답변으로 데이터를 추가한다.
    deleteLastChat()
    addAnswerChat(data.score, answer)

    // 꼬리 질문을 추가한다.
    addQuestionChat(data.nextQuestion)
  }

  return (
    <>
      {
        isChatError ? <Alert severity={"error"}> 채팅 목록을 불러오는 중 오류가 발생했습니다.</Alert> :
          chats?.map((chat, index) => {
            return (
              <Box key={index} sx={{ paddingTop: '10px', }}>
                <Box sx={{ padding: '5px' }}>
                  {
                    chat.type === "question" ? "질문"
                      : typeof chat.score === "number" ? `답변 (점수: ${chat.score})`
                        : "답변"
                  }
                </Box>
                <Divider/>
                <Box sx={{ padding: '10px' }}>
                  {
                    chat.message.split('\n').map((line, index) => {
                      return (
                        <Typography key={index} variant="subtitle1" sx={{ paddingTop: '5px', paddingBottom: '5px' }}>
                          {line}
                        </Typography>
                      )
                    })
                  }
                </Box>
              </Box>
            )
          })
      }

      {
        !isChatLoading && !isChatError &&
        <>
          <AnswerInputFieldBox
            isLoading={isSubmitAnswerLoading}
            isError={isSubmitAnswerError}
            submitAnswer={submitAnswer}
            isLoggedIn={token}
          />
        </>
      }
    </>
  );

}

function AnswerInputFieldBox({ isLoading, isError, submitAnswer, isLoggedIn }) {
  const [isAnswerEmpty, setIsAnswerEmpty] = useState(true);

  if (isLoading) {
    return (
      <Box> <CircularProgress/> 답변 제출 중... </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity={"error"}> 답변 제출 중 오류가 발생했습니다. 다시 시도해주세요.</Alert>
    )
  }

  if (!isLoggedIn) {
    return (
      <>
        <Alert severity={"info"}> 로그인이 필요합니다. </Alert>
      </>
    )
  }

  return (
    <Box>
      <TextField id="answer" variant="outlined" label="답변을 최대한 자세히 작성하세요." fullWidth multiline
        onChange={(e) => {
          setIsAnswerEmpty(e.target.value.trim() === "")
        }}/>
      <Box sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        paddingTop: '10px'
      }}>
        <Button variant="contained"
          onClick={submitAnswer}
          disabled={isLoading || isAnswerEmpty}>제출하기
        </Button>
      </Box>

    </Box>
  );
}

