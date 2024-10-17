import PropTypes from "prop-types";
import Container from "../UI/Container";
import { useBoundStore } from "../../store";
import { useEffect, useState } from "react";

export default function ConcurrentDocUser({ uniqueId }) {
  const [concurrentDocUserNum, setConcurrentDocUserNum] = useState(1);
  const { userId, userName, concurrentDocUser, concurrentDocOtherUserName, asyncGetDocConcurrentUser, asyncGetUserNameWithUserId } = useBoundStore((state) => ({
    userId: state.userId,
    userName: state.userName,
    concurrentDocUser: state.concurrentDocUser,
    concurrentDocOtherUserName: state.concurrentDocOtherUserName,
    asyncGetDocConcurrentUser: state.asyncGetDocConcurrentUser,
    asyncGetUserNameWithUserId: state.asyncGetUserNameWithUserId,
  }));

  const concurrentDocOtherUser = concurrentDocUser ? concurrentDocUser.filter(value => value !== userId) : null;

  if (concurrentDocUser && concurrentDocUser.length > 1) {
    setConcurrentDocUserNum(concurrentDocUser.length);
  }

  useEffect(() => {
    asyncGetDocConcurrentUser(uniqueId);
  }, [asyncGetDocConcurrentUser, uniqueId]);

  useEffect(() => {
    if (concurrentDocUser && concurrentDocUser.length > 1) {
      const otherUserArray = concurrentDocUser.filter(value => value !== userId);

      for (let i = 0; i < otherUserArray.length; i++) {
        asyncGetUserNameWithUserId(otherUserArray[i]);
      }
    }
  }, [concurrentDocUser, userId, asyncGetUserNameWithUserId]);

  return (
    <Container style="flex flex-col justify-start items-center w-200 bg-gray-6">
      <p className="w-full text-center bg-gray-7 text-purple-light text-22 py-4">현재 접속자: {concurrentDocUserNum}명</p>
      <p className="text-white text-20 py-4">{userName}</p>
      {concurrentDocOtherUser?.map(value => {
        <p key={value} className="text-white text-20 py-4">{concurrentDocOtherUserName}</p>
      })}
    </Container>
  )
}

ConcurrentDocUser.propTypes = {
  uniqueId: PropTypes.string.isRequired,
}
