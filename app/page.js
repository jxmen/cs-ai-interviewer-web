"use client"

import { useRouter } from 'next/navigation';

import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Alert from "@mui/material/Alert";
import React, { useEffect, useState } from "react";
import { CircularProgress, Divider, List, ListItem, ListItemButton, ListItemText } from "@mui/material";

const SERVER_BASE_URL = 'http://localhost:8080'; // TODO: 환경 변수로 분리하기

// TODO: api 호출 부분만 client component로 분리하기
export default function Home() {
  const router = useRouter();
  const [tab, setTab] = useState('dsa');

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]); // [{ id, question, answer }
  const [isError, setIsError] = useState(false);

  const handleChangeTab = (event, newValue) => {
    router.push(`/?tab=${newValue}`);
    setTab(newValue)
  };

  useEffect(() => {
    setIsLoading(true);

    fetch(`${SERVER_BASE_URL}/api/subjects?category=${tab}`)
      .then(serverPromise => {
        serverPromise.json()
          .then(response => setData(response.data))
          .then(_ => setIsLoading(false))
      })
      .catch(err => {
        console.error(err)
        setIsError(true)
      });
  }, [tab]);

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        CS 면접 대비 - AI 면접관
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        AI 면접관과 함께 CS 면접을 준비해보세요!
      </Typography>
      <Tabs value={tab} onChange={handleChangeTab} aria-label="category tabs">
        <Tab label="자료구조/알고리즘" value="dsa" />
        <Tab label="데이터베이스" value="database" />
        <Tab label="운영체제" value="os" />
        <Tab label="네트워크" value="network" />
      </Tabs>
      {['dsa', 'database', 'os', 'network'].map((category) => (
        <TabPanel value={tab} index={category} key={category}>
          {
            isError ? <Alert severity="error">데이터를 불러오는 중 오류가 발생했습니다.</Alert> :
              isLoading ? <CircularProgress /> :
                (data?.length === 0) ? <Alert severity={"info"}>데이터가 없습니다.</Alert>:
                  <List>
                    {data.map((item, index) => (
                      <ListItem key={item.id}>
                        <ListItemButton divider={true}>
                          <ListItemText primary={`${index + 1}. ${item.title}`}/>
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
          }
        </TabPanel>
      ))}
    </Container>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tab-panel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box> {children} </Box>
      )}
    </div>
  );
}
