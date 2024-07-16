import { cookies } from "next/headers";
import { fetchSubjectDetail } from "@/app/api";
import Container from "@mui/material/Container";
import BackIconButton from "@/src/component/BackIconButton";
import { Chip, Divider } from "@mui/material";
import Typography from "@mui/material/Typography";
import { categoryMap } from "@/src/constant/categoryMap";
import Alert from "@mui/material/Alert";
import ChatsComponent from "@/src/component/ChatsComponent";

function SubjectDetail({
  subjectDetail,
  isError
}) {
  if (!Object.keys(subjectDetail).length === 0 || isError) return (
    <Alert severity="error">데이터를 불러오는 중에 에러가 발생했습니다.</Alert>
  )

  return (
    <Typography variant="h4" component="h1" sx={{ padding: '10px' }}>
      {subjectDetail.title}
      <Chip label={categoryMap[subjectDetail.category.toLowerCase()]}
        color="primary"
        variant="outlined"
        sx={{ margin: '5px' }}
      />
    </Typography>
  );
}

export default async function SubjectDetailPage({
  params: { id: subjectId }
}) {
  const sessionId = () => {
    if (cookies().has('SESSION')) {
      return cookies().get('SESSION').value
    } else {
      return null
    }
  }

  const csrfToken = () => {
    if (cookies().has('XSRF-TOKEN')) {
      return cookies().get('XSRF-TOKEN').value
    } else {
      return null
    }
  }

  const { data: subjectDetail, isError: isSubjectDetailFetchError } = await fetchSubjectDetail(subjectId)

  return (
    <Container maxWidth="sm" sx={{ padding: '50px' }}>
      <BackIconButton/>
      <SubjectDetail subjectDetail={subjectDetail} isError={isSubjectDetailFetchError}/>
      <Divider/>
      <ChatsComponent
        subjectId={subjectId}
        subjectDetailQuestion={subjectDetail.question}
        sessionId={sessionId()}
        csrfToken={csrfToken()}
      />

    </Container>
  );
}
