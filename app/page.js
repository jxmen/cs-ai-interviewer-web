"use client"

import { useRouter } from 'next/navigation';

import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Alert from "@mui/material/Alert";
import React, { useEffect, useState } from "react";
import { CircularProgress, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { fetchMemberSubjects, fetchSubjects } from "@/app/api";
import { getCookie } from "cookies-next";

// TODO: api 호출 부분만 server component로 분리하기
export default function Home() {
  const router = useRouter();

  const [tab, setTab] = useState('dsa');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]); // [{ id, title, category, maxScore? }
  const [isError, setIsError] = useState(false);

  const handleChangeTab = (event, newValue) => {
    router.push(`/?tab=${newValue}`);
    setTab(newValue)
  };

  useEffect(() => {
    setIsLoading(true);

    const isLoggedIn = getCookie('next-auth.access-token') != null;
    if (isLoggedIn) {
      const token = getCookie('next-auth.access-token');
      fetchMemberSubjects(token, tab)
        .then(response => setData(response.data.data))
        .catch(_ => setIsError(true))
        .finally(() => {
          setIsLoading(false);
        })
    } else {
      fetchSubjects(tab)
        .then(response => setData(response.data.data))
        .catch(_ => setIsError(true))
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [tab]);

  const moveSubjectDetail = (subjectId) => {
    router.push(`/subjects/${subjectId}`)
  }

  return (
    <Container maxWidth="sm" sx={{ padding: '10px' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        CS 면접 대비 - AI 면접관
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        AI 면접관과 함께 CS 면접을 준비해보세요!
      </Typography>
      <Tabs value={tab} onChange={handleChangeTab} aria-label="category tabs">
        <Tab label="자료구조/알고리즘" value="dsa"/>
        <Tab label="데이터베이스" value="database"/>
        <Tab label="운영체제" value="os"/>
        <Tab label="네트워크" value="network"/>
      </Tabs>
      {['dsa', 'database', 'os', 'network'].map((category) => (
        <TabPanel value={tab} index={category} key={category} isLoading={isLoading} isError={isError}>
          {
            (data?.length === 0) ? <Alert severity={"info"}>데이터가 없습니다.</Alert> :
              <List>
                {data.map((item, index) => {
                  const isLoggedIn = getCookie('next-auth.access-token') != null;

                  return (
                    <ListItem key={item.id} disablePadding={true}>
                      <ListItemButton divider={true} onClick={() => moveSubjectDetail(item.id)}>
                        <ListItemText primary={`${index + 1}. ${item.title}`}/>
                        {
                          !isLoggedIn ? null :
                            item.maxScore !== null ? (
                              <Box sx={{ marginLeft: 'auto', color: getColorByScore(item.maxScore) }}>
                                <ListItemText primary={`${item.maxScore}`}/>
                              </Box>
                            ) : (
                              <Box sx={{ marginLeft: 'auto' }}>
                                <ListItemText primary="-"/>
                              </Box>
                            )}
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
          }
        </TabPanel>
      ))}
    </Container>
  );
}

const getColorByScore = (score) => {
  if (score <= 40) return '#d32f2f'; // Dark Red
  if (score <= 60) return '#f57c00'; // Dark Orange
  if (score <= 80) return '#fbc02d'; // Dark Yellow
  if (score < 100) return '#388e3c'; // Dark Green

  // Dark Sky Blue
  return '#1976d2';
};


const TabPanel = (props) => {
  const { children, value, index, isLoading, isError, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tab-panel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        isError ? <Alert severity="error">데이터를 불러오는 중 오류가 발생했습니다.</Alert> :
          isLoading ? (
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              height: '50px',
              padding: '10px'
            }}>
              <CircularProgress/>
              <Box sx={{ marginLeft: '15px' }}/>데이터 불러오는중... <Box/>
            </Box>
          ) :
            <Box> {children} </Box>
      )}
    </div>
  );
}
