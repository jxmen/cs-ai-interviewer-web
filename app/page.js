"use client"

import { useRouter } from 'next/navigation';

import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Alert from "@mui/material/Alert";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [tab, setTab] = useState('dsa');

  const handleChangeTab = (event, newValue) => {
    router.push(`/?tab=${newValue}`);
    setTab(newValue)
  };

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
      <TabPanel value={tab} index="dsa">
        <ComingSoonAlert />
      </TabPanel>
      <TabPanel value={tab} index="database">
        <ComingSoonAlert />
      </TabPanel>
      <TabPanel value={tab} index="os">
        <ComingSoonAlert />
      </TabPanel>
      <TabPanel value={tab} index="network">
        <ComingSoonAlert />
      </TabPanel>
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

function ComingSoonAlert() {
  return (
    <Alert severity="info">준비중입니다.</Alert>
  )
}
