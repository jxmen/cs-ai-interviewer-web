"use client"

import React, { useEffect, useState } from "react";
import { fetchAnswer, fetchChats, fetchSubjectChatArchive } from "@/app/api";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField
} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { StyledTooltip } from "@/src/component/Tooltip/StyledTooltip";
import { useRouter } from "next/navigation";
import LocalStorage from "@/src/utils/LocalStorage";
import { useAuth } from "@/src/context/AuthContext";

const CHAT_MAX_SCORE = 100;
const MAX_ANSWER_COUNT = 10;

export default function ChatsComponent({ subjectId, subjectDetailQuestion }) {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const accessToken = LocalStorage.getItem('accessToken');

  const router = useRouter()

  const [chats, setChats] = useState([])
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [isChatError, setIsChatError] = useState(false)

  const [isSubmitAnswerLoading, setIsSubmitAnswerLoading] = useState(false)
  const [isSubmitAnswerError, setIsSubmitAnswerError] = useState(false)
  const [isChatArchiving, setIsChatArchiving] = useState(false)
  const [isChatArchivingError, setIsChatArchivingError] = useState(false)
  const [isOpenClearChatDialog, setIsOpenClearChatDialog] = useState(false);

  const firstDummyQuestion = { type: "question", message: subjectDetailQuestion };

  const logout = async () => {
    LocalStorage.logout()
    setIsLoggedIn(false)
    setChats([firstDummyQuestion]);
    router.refresh();
  }

  useEffect(() => {
    if (!isLoggedIn) {
      setChats([firstDummyQuestion]);
      return;
    }

    fetchChats(subjectId, accessToken).then(async ({ data, error }) => {
      if (error) throw error

      if (data.length === 0) {
        setChats([firstDummyQuestion])
      } else {
        setChats([...data])
      }
    })
      .catch(async (e) => {
        if (e.code === "REQUIRE_LOGIN") await logout();

        setIsChatLoading(false)
        setIsChatError(true)
      })
      .finally(() => setIsChatLoading(false))
  }, [subjectId, subjectDetailQuestion, isLoggedIn]);

  const addAnswerChat = (score, message, createdAt) => {
    setChats((prevChats) => [...prevChats, { type: "answer", message, score, createdAt }])
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

  const withLoading = (setLoadingState, fn) => async (...args) => {
    setLoadingState(true);
    try {
      await fn(...args);
    } finally {
      setLoadingState(false);
    }
  };

  const submitAnswer = async () => {
    const answerElement = document.getElementById('answer');
    const answer = answerElement.value;
    answerElement.value = "";

    // 우선 제공한 내용을 기반으로 스코어가 없는 더미 답변을 생성한다.
    addDummyAnswerChat(answer);
    const { data, error } = await fetchAnswer(subjectId, answer, accessToken);
    if (error) {
      if (error.code === "REQUIRE_LOGIN") return await logout();

      deleteLastChat();
      setIsSubmitAnswerError(true);
      return;
    }

    // 기존 더미 답변을 지우고 점수가 매겨진 새로운 답변으로 데이터를 추가한다.
    deleteLastChat();
    addAnswerChat(data.score, answer, data.createdAt);

    // 꼬리 질문을 추가한다.
    addQuestionChat(data.nextQuestion);
  };

  const submitAnswerWithLoading = withLoading(setIsSubmitAnswerLoading, submitAnswer);

  const getEmojiByScore = (score) => {
    if (score === 0) return { emoji: '😞', description: '기초를 다지는 중이에요! 조금만 더 힘내봐요!' };
    if (score <= 30) return { emoji: '😐', description: '기초를 잘 다지고 있어요! 계속해서 노력해봐요!' };
    if (score <= 60) return { emoji: '🙂', description: '좋아요! 이제 더 깊이 공부해봐요!' };
    if (score < 100) return { emoji: '😃', description: '훌륭해요! 거의 다 왔어요!' };
    return { emoji: '🎉', description: '완벽해요! 축하합니다!' };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
  };

  const ChatItem = ({ chat, index }) => (
    <Box key={index} sx={{ paddingTop: '10px' }}>
      <Box sx={{ padding: '5px', display: 'flex', justifyContent: 'space-between' }}>
        <Box>
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
        {chat.type === "answer" && chat.createdAt && (
          <Box>
            <Typography variant="caption" sx={{ color: 'gray' }}>
              {formatDate(chat.createdAt)}
            </Typography>
          </Box>
        )}
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

  const ClearButton = ({ disabled }) => (
    <Box
      sx={{
        display: 'inline-block',
        padding: '6px 16px',
        border: '1px solid',
        borderColor: 'secondary.main',
        color: 'secondary.main',
        borderRadius: '4px',
        cursor: 'pointer',
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
        fontSize: '0.875rem',
        lineHeight: 1.75,
        minWidth: '64px',
        textAlign: 'center',
        transition: 'box-shadow 0.3s ease-in-out',
        '&:hover': {
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        },
        '&:active': {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
        },
      }}
      onClick={openClearChatDialog}
      tabIndex={-1}
    >
      채팅 초기화
    </Box>
  );

  const AnswerInputFieldBox = () => {
    const [isAnswerEmpty, setIsAnswerEmpty] = useState(true);

    return (
      <Box>
        <TextField id="answer" variant="outlined" label="답변을 최대한 자세히 작성하세요." fullWidth multiline
          onChange={(e) => {
            setIsAnswerEmpty(e.target.value.trim() === "")
          }}/>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '10px'
        }}>
          <ClearButton disabled={chats.length <= 1}/>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ paddingRight: '10px' }}>
              제출한 답변 횟수: {chats.filter(it => it.type === "answer")?.length ?? 0} / {MAX_ANSWER_COUNT}
            </Box>
            <Button variant="contained"
              onClick={submitAnswerWithLoading}
              disabled={isSubmitAnswerLoading || isAnswerEmpty}>제출하기
            </Button>
          </Box>
        </Box> </Box>
    );
  };

  const renderAnswerBox = () => {
    const hasNotAnswer = () => {
      const answerChats = chats.filter(it => it.type === "answer");
      return answerChats.length >= MAX_ANSWER_COUNT;
    }

    if (isChatLoading || isChatError) return null;

    const lastAnswerChat = chats[chats.length - 2];
    if (lastAnswerChat?.score === 100) {
      return `🎉 축하합니다. 다른 질문도 도전해보세요`;
    }

    if (isSubmitAnswerLoading) {
      return (
        <Box sx={{
          padding: '10px',
          display: 'flex',
          alignItems: 'center',
        }}> <CircularProgress sx={{ padding: '10px' }}/> 답변 제출 중...⏳ </Box>
      );
    }

    if (isSubmitAnswerError) {
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

    if (isChatArchiving) {
      return (
        <Box sx={{
          padding: '10px',
          display: 'flex',
          alignItems: 'center',
        }}> <CircularProgress sx={{ padding: '10px' }}/> 채팅 초기화 중...⏳ </Box>
      );
    }

    if (isChatArchivingError) {
      return (
        <Alert severity={"error"}> 채팅 초기화 중 오류가 발생했습니다. 다시 시도해주세요.</Alert>
      )
    }

    if (hasNotAnswer()) {
      return (
        <>
          <Divider/>
          <Box sx={{ paddingTop: '10px' }}>
            🔥 답변 제출 한도에 도달했어요! 초기화하거나 다른 질문에 도전해보세요!
          </Box>
          <Box sx={{
            paddingTop: '10px',
            display: 'flex',
            alignItems: 'center',
          }}>
            <ClearButton disabled={false}/>
          </Box>
        </>
      )
    }

    return (
      <AnswerInputFieldBox/>
    );
  };

  const archiveChat = () => {
    setIsChatArchiving(true)
    fetchSubjectChatArchive(subjectId, accessToken).then(({ success }) => {
      if (!success) {
        setIsChatArchivingError(true)
        return
      }

      setChats([])
      addQuestionChat(subjectDetailQuestion)
    }).finally(() => {
      setIsChatArchiving(false)
    });
  }

  const openClearChatDialog = () => {
    setIsOpenClearChatDialog(true);
  }

  const closeClearChatDialog = () => {
    setIsOpenClearChatDialog(false);
  }

  const handleConfirmClearChat = () => {
    closeClearChatDialog();
    archiveChat();
  };

  return (
    <>
      {isChatLoading ?
        <Box sx={{ padding: '10px' }}> 채팅 데이터 불러오는 중... ⏳ </Box>
        : <ChatList chats={chats} isChatError={isChatError}/>}
      {renderAnswerBox()}
      <Dialog open={isOpenClearChatDialog} onClose={!isOpenClearChatDialog}>
        <DialogTitle>채팅 초기화</DialogTitle>
        <DialogContent>
          <Typography>정말로 채팅 내용을 초기화 하시겠습니까?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeClearChatDialog} color="primary">
            취소
          </Button>
          <Button onClick={handleConfirmClearChat} color="secondary">
            확인
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );

}
