import { fetchSubjectDetail } from "@/app/api";
import Container from "@mui/material/Container";
import BackIconButton from "@/src/component/BackIconButton";
import { Chip, Divider } from "@mui/material";
import Typography from "@mui/material/Typography";
import { categoryMap } from "@/src/constant/categoryMap";
import Alert from "@mui/material/Alert";
import ChatsComponent from "@/src/component/ChatsComponent";
import React from "react";

export default async function SubjectDetailPage({ params: { id: subjectId } }) {
  const { data, isError } = await fetchSubjectDetail(subjectId)

  return (
    <Container maxWidth="sm" sx={{ padding: '50px' }}>
      <BackIconButton/>
      <SubjectDetail data={data} isError={isError}/>
      <Divider/>
      <ChatsComponent
        subjectId={subjectId}
        subjectDetailQuestion={data.question}
      />
    </Container>
  );
}

function SubjectDetail({ data, isError }) {
  if (!Object.keys(data).length === 0 || isError) return (
    <Alert severity="error">데이터를 불러오는 중에 에러가 발생했습니다.</Alert>
  )

  return (
    <Typography variant="h4" component="h1" sx={{ padding: '10px' }}>
      {data.title}
      <Chip label={categoryMap[data.category.toLowerCase()]}
        color="primary"
        variant="outlined"
        sx={{ margin: '5px' }}
      />
    </Typography>
  );
}
