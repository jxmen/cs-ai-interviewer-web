"use client"

import { useEffect, useState } from "react";
import { fetchAnswer, fetchChats } from "@/app/api";
import { Alert, Button, CircularProgress, Divider, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function ChatsComponent({ subjectId, subjectDetailQuestion, sessionId }) {
  const [chats, setChats] = useState([
    {
      type: "question",
      message: "가나다라마바사\n".repeat(3)
    },
    {
      type: "answer",
      message: "abcdefg\n".repeat(3)
    },
    {
      tyoe: "question",
      message: "답변에 대한 점수: 0점\n 이유: 시간 복잡도와 공간 복잡도에 대한 이해가 부족해 보입니다. 알고리즘의 성능을 평가하는 데 있어 매우 중요한 개념이므로 반드시 알고 있어야 합니다.\n공부할 수 있는 키워드: 빅오 표기법 / 시간 복잡도 / 공간 복잡도 / 알고리즘 효율성 / 어쩌구저쩌구 / qwerasdfzxcv / 1234567890 / 베재댜겨쇼미나어롷크투츞\n꼬리 질문: 빅오 표기법에 대해 아는 대로 설명해보세요.\n"
    }
  ])
  const [chatError, setChatError] = useState(false)

  const [isSubmitAnswerLoading, setIsSubmitAnswerLoading] = useState(false)
  const [submitAnswerError, setSubmitAnswerError] = useState(false)

  useEffect(() => {
    function extracted() {
      fetchChats(subjectId, sessionId).then(({ data, isError }) => {
        if (isError) {
          console.error('Error while fetching chats')
          setChatError(true)
          return
        }

        const question = { type: "question", message: subjectDetailQuestion };
        if (data.length === 0) {
          setChats([question])
        } else {
          setChats([question, ...data])
        }
      })
    }

    // extracted();
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
    const { data, isError } = await fetchAnswer(subjectId, sessionId, answer)
    if (isError) {
      deleteLastChat()
      setSubmitAnswerError(true)
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
        chatError ? <Box> 데이터를 불러오는 중 오류가 발생했습니다. </Box> :
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

      <AnswerInputFieldBox
        isLoading={isSubmitAnswerLoading}
        isError={submitAnswerError}
        submitAnswer={submitAnswer}
      />
    </>
  );

}

function AnswerInputFieldBox({ isLoading, isError, submitAnswer }) {
  if (isLoading) {
    return (
      <Box> <CircularProgress/> 답변 제출 중... </Box>
    )
  }

  if (isError) {
    return (
      <Alert severity={"error"}> 답변 제출 중 오류가 발생했습니다. 다시 시도해주세요.</Alert>
    )
  }

  return (
    <Box>
      <TextField id="answer" variant="outlined" label="답변을 최대한 자세히 작성하세요." fullWidth multiline/>
      <Box sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        paddingTop: '10px'
      }}>
        <Button variant="contained"
          onClick={submitAnswer}
          disabled={isLoading}>제출하기
        </Button>
      </Box>

    </Box>
  );
}
