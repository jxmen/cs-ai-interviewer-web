import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Button, Chip, Divider, IconButton, Skeleton, TextField } from "@mui/material";
import { useRouter } from "next/router";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { categoryMap } from "@/src/constant/categoryMap";

const SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

export default function SubjectDetail() {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState() // id, title, question
  const [isError, setIsError] = useState(false)
  const moveHome = () => router.push("/");

  useEffect(() => {
    setIsLoading(true)
    const { id } = router.query

    fetch(`${SERVER_BASE_URL}/api/subjects/${id}`)
      .then(it => it.json())
      .then(data => setData(data))
      .then(_ => setIsLoading(false))
      .catch(err => setIsError(true))
  }, [router.query]);


  return (
    <Container maxWidth="sm" sx={{
      padding: '50px'
    }}>
      <>
        <IconButton aria-label="back" onClick={moveHome}>
          <ArrowBackIcon/>
        </IconButton>
        <br/>

        {isError ? <Alert severity="error">데이터를 불러오는 중에 에러가 발생했습니다.</Alert> :
          <>
            <Typography variant="h4" component="h1" sx={{ padding: '10px' }}>
              {isLoading ? <Skeleton/> :
                <>
                  {data?.title}
                  <Chip label={categoryMap[data?.category?.toLowerCase()]}
                    color="primary"
                    variant="outlined"
                    sx={{ margin: '5px' }}
                  />
                </>
              }
            </Typography>
            <Divider/>
            {isLoading ? <Skeleton/> : <>
              <Alert severity="info" sx={{ margin: '10px' }}>
                {isLoading ? <Skeleton/> : "답변 제출 기능 준비중입니다."}
              </Alert>
            </>
            }

            <Typography variant="subtitle1" sx={{ padding: '10px' }}>
              {isLoading ? <Skeleton/> : data?.question}
            </Typography>

            {isLoading ? <Skeleton/> : <>
              <TextField id="answer" variant="outlined" label="답변을 최대한 자세히 작성하세요." fullWidth/>
            </>}
            <Box sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              paddingTop: '10px'
            }}>
              {isLoading ? <Skeleton variant="rect" width={100} height={40}/>
                : <Button variant="contained" disabled> 제출하기 </Button>}
            </Box>
          </>
        }


      </>
    </Container>
  )
}
