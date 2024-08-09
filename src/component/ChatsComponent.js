"use client"

import React, { useEffect, useState } from "react";
import { fetchAnswer, fetchChats } from "@/app/api";
import { Alert, Button, CircularProgress, Divider, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { StyledTooltip } from "@/src/component/Tooltip/StyledTooltip";

const CHAT_MAX_SCORE = 100;

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

  const getEmojiByScore = (score) => {
    if (score === 0) return { emoji: '😞', description: '기초를 다지는 중이에요! 조금만 더 힘내봐요!' };
    if (score <= 30) return { emoji: '😐', description: '기초를 잘 다지고 있어요! 계속해서 노력해봐요!' };
    if (score <= 60) return { emoji: '🙂', description: '좋아요! 이제 더 깊이 공부해봐요!' };
    if (score < 100) return { emoji: '😃', description: '훌륭해요! 거의 다 왔어요!' };
    return { emoji: '🎉', description: '완벽해요! 축하합니다!' };
  };

  const ChatItem = ({ chat, index }) => (
    <Box key={index} sx={{ paddingTop: '10px' }}>
      <Box sx={{ padding: '5px' }}>
        {chat.type === "question" ? "질문" :
          typeof chat.score === "number" ? (
            <>
              답변 ({chat.score}/{CHAT_MAX_SCORE}){" "}
              <StyledTooltip title={getEmojiByScore(chat.score).description}>
                <span>{getEmojiByScore(chat.score).emoji}</span>
              </StyledTooltip>
            </>
          ) : "답변"
        }
      </Box>
      <Divider/>
      <Box sx={{ padding: '10px' }}>
        {chat.message.split('\n').map((line, index) => (
          <Typography key={index} variant="subtitle1" sx={{ paddingTop: '5px', paddingBottom: '5px' }}>
            {line}
          </Typography>
        ))}
      </Box>
    </Box>
  );

  const ChatList = ({ chats, isChatError }) => (
    isChatError ? <Alert severity={"error"}> 채팅 목록을 불러오는 중 오류가 발생했습니다.</Alert> :
      chats?.map((chat, index) => <ChatItem key={index} chat={chat} index={index}/>)
  );


  return (
    <>
      {
        isChatLoading ? <CircularProgress/> :
          <ChatList chats={chats} isChatError={isChatError}/>
      }

      {
        !isChatLoading && !isChatError && (
          chats.length > 0 && chats[chats.length - 2]?.score === 100 ? `🎉 축하합니다. 다른 질문도 도전해보세요` : (
            <>
              <AnswerInputFieldBox
                isLoading={isSubmitAnswerLoading}
                isError={isSubmitAnswerError}
                submitAnswer={submitAnswer}
                isLoggedIn={token}
              />
            </>
          )
        )
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

