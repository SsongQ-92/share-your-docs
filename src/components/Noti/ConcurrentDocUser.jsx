import PropTypes from "prop-types";
import { memo, useEffect, useState } from "react";
import { useBoundStore } from "../../store";
import Container from "../UI/Container";

const ConcurrentDocUser = memo(function ConcurrentDocUser({ uniqueId }) {
  const [concurrentDocUserNum, setConcurrentDocUserNum] = useState(1);
  const { userId, userName, concurrentDocUser, concurrentDocOtherUserName, asyncGetDocConcurrentUser, asyncGetUserNameWithUserId } = useBoundStore((state) => ({
    userId: state.userId,
    userName: state.userName,
    concurrentDocUser: state.concurrentDocUser,
    concurrentDocOtherUserName: state.concurrentDocOtherUserName,
    asyncGetDocConcurrentUser: state.asyncGetDocConcurrentUser,
    asyncGetUserNameWithUserId: state.asyncGetUserNameWithUserId,
  }));

  const concurrentDocUserId = concurrentDocUser ? Object.keys(concurrentDocUser) : null;

  if (concurrentDocUserId && concurrentDocUserId.length > 1) {
    setConcurrentDocUserNum(concurrentDocUserId.length);
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      asyncGetDocConcurrentUser(uniqueId);
    }, 3000);

    return () => {
      clearInterval(intervalId);
    }
  }, [asyncGetDocConcurrentUser, uniqueId]);

  useEffect(() => {
    if (concurrentDocUserId && concurrentDocUserId.length > 1) {
      const concurrentDocOtherUser = concurrentDocUserId.filter(value => value !== userId);

      for (let i = 0; i < concurrentDocOtherUser.length; i++) {
        asyncGetUserNameWithUserId(concurrentDocOtherUser[i]);
      }
    }
  }, [concurrentDocUserId, userId, asyncGetUserNameWithUserId]);

  return (
    <Container style="flex flex-col justify-start items-center w-200 bg-gray-6">
      <p className="flex-col-center w-full bg-gray-7 text-purple-light text-22 py-4">
        <span>현재 문서 접속 인원: </span>
        <span>{concurrentDocUserNum}명</span>
      </p>
      <p className="text-white text-20 py-4">{userName}</p>
      {concurrentDocOtherUserName?.map(value => {
        <p key={value} className="text-white text-20 py-4">{value}</p>
      })}
    </Container>
  )
});

export default ConcurrentDocUser;

ConcurrentDocUser.propTypes = {
  uniqueId: PropTypes.string.isRequired,
}
