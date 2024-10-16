import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useBoundStore } from "../../store";
import EditDocPage from "./EditDocPage";
import LandingPage from "./LandingPage";
import NotFoundPage from "./NotFoundPage";

export default function ExternalAccessPage() {
  const { docId } = useParams();
  const { isLogIn, currentDocData, isNoExistDocUrlError, asyncGetSpecificDoc, asyncCheckSpecificDoc } = useBoundStore((state) => ({
    isLogIn: state.isLogIn,
    currentDocData: state.currentDocData,
    isNoExistDocUrlError: state.isNoExistDocUrlError,
    asyncGetSpecificDoc: state.asyncGetSpecificDoc,
    asyncCheckSpecificDoc: state.asyncCheckSpecificDoc,
  }));

  const isFetchCurrentUrlDocData = Object.keys(currentDocData).length;

  useEffect(() => {
    asyncCheckSpecificDoc(docId);
  }, [asyncCheckSpecificDoc, docId]);

  useEffect(() => {
    if (isLogIn) {
      asyncGetSpecificDoc(docId);
    }
  }, [asyncGetSpecificDoc, isLogIn, docId]);

  if (isNoExistDocUrlError) {
    return <NotFoundPage isNoExistDocUrlError={isNoExistDocUrlError} />
  }

  if (isFetchCurrentUrlDocData) {
    return <EditDocPage currentDocData={currentDocData} />
  }

  return <LandingPage />
}
