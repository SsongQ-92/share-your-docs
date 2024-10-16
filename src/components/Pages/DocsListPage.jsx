import { useEffect } from "react";
import { useBoundStore } from "../../store";
import Container from "../UI/Container";
import Card from "../Card";
import useNoLogInRedirect from "../../hooks/useNoLogInRedirect";

export default function DocsListPage() {
  const { asyncGetUserDocList, userAllDocs, userId } = useBoundStore((state) => ({
    asyncGetUserDocList: state.asyncGetUserDocList,
    userAllDocs: state.userAllDocs,
    userId: state.userId,
  }))

  const userDocsValues = Object.values(userAllDocs);
  const sortedUserDocsValues = userDocsValues.sort((a, b) => b.createdAt -  a.createdAt);

  useNoLogInRedirect();

  useEffect(() => {
    asyncGetUserDocList(userId);
  }, [asyncGetUserDocList, userId])

  if (userDocsValues.length === 0) {
    return (
      <Container style="flex-center pt-130 bg-black-dark text-30 text-red-0">
        등록된 문서이 없습니다
      </Container>
    )
  }

  return (
    <main className="flex items-start gap-40 px-130 pb-50 pt-130 bg-black-dark">
      <span className="flex-shrink-0 w-150 p-10 pl-20 bg-gray-6 text-white text-24">나의 문서</span>
      <Container style="w-full flex flex-col gap-30">
        {sortedUserDocsValues.map((value) => {
          return <Card key={value.id} id={value.id} contents={value.contents} title={value.title} createdAt={value.createdAt} modifiedAt={value.modifiedAt} />
        })}
      </Container>
    </main>
  )
}
