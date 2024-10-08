"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { fetchMySubjects, fetchSubjects } from "@/src/api";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { StyledTooltip } from "@/src/component/Tooltip/StyledTooltip";
import { CircularProgress, IconButton, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import HelpCenterRoundedIcon from "@mui/icons-material/HelpCenterRounded";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Alert from "@mui/material/Alert";
import LocalStorage from "@/src/utils/LocalStorage";
import { useAuth } from "@/src/context/AuthContext";

export default function Home() {
  const router = useRouter();

  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const accessToken = LocalStorage.getItem("accessToken");

  const [tab, setTab] = useState('dsa');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]); // [{ id, title, category, maxScore? }
  const [isError, setIsError] = useState(false);

  const handleRequireLogin = async () => {
    LocalStorage.logout();
    setIsLoggedIn(false);
  };

  const loadSubjects = async () => {
    setIsLoading(true);
    try {
      if (isLoggedIn) {
        const json = await fetchMySubjects(tab, accessToken);
        if (json.error) throw json.error

        setData(json.data);
      } else {
        const json = await fetchSubjects(tab);
        setData(json.data);
      }
    } catch (e) {
      if (e.code === "REQUIRE_LOGIN" || e.code === "INVALID_TOKEN") {
        await handleRequireLogin(tab);
      } else {
        setIsError(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    /**
     * https://stackoverflow.com/questions/60618844/react-hooks-useeffect-is-called-twice-even-if-an-empty-array-is-used-as-an-ar
     */
    console.log('i fire once');
    loadSubjects()
  }, [tab, isLoggedIn]);

  const handleChangeTab = (event, newValue) => {
    router.push(`/?tab=${newValue}`);
    setTab(newValue)
  };

  const moveSubjectDetail = (subjectId) => {
    router.push(`/subjects/${subjectId}`)
  }

  return (
    <Container maxWidth="sm" sx={{ padding: '10px' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        CS 면접 대비 - AI 면접관
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1">
          AI 면접관과 함께 CS 면접을 준비해보세요!
        </Typography>
        <StyledTooltip
          title={
            <Box>
              <b>점수 기준</b><br/><br/>
              😞 0: 기초 부족<br/>
              😐 10~30: 기초 수준만 알고 있음<br/>
              🙂 40~60: 어느 정도 알고 있음<br/>
              😃 70~90: 어느 정도 깊게 알고 있음<br/>
              🎉 100: 매우 깊게 알고 있음
            </Box>
          }
        >
          <IconButton sx={{ padding: '5px' }}>
            <HelpCenterRoundedIcon/>
          </IconButton>
        </StyledTooltip>
      </Box>
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
                {data?.map((item, index) => {
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
  if (score === 0) return '#d32f2f'; // Dark Red
  if (score <= 30) return '#f57c00'; // Dark Orange
  if (score <= 60) return '#fbc02d'; // Dark Yellow
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
