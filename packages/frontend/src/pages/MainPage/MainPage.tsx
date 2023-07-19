import { DownloadItem } from "../../components/DownloadItem/DownloadItem";
import { Header } from "../../components/Header/Header";
import { downloadAPI } from "../../services/DownloadService";

import "./MainPage.css";

export const MainPage = () => {
  const { data, isLoading, error } = downloadAPI.useFetchDownloadsQuery("");

  const renderList = () =>
    error ? (
      <div className="MainPage__text">error</div>
    ) : isLoading ? (
      <div className="MainPage__text">loading...</div>
    ) : data?.length === 0 ? (
      <div className="MainPage__text">Empty list</div>
    ) : (
      <div className="MainPage__list">
        {data?.map((item) => (
          <DownloadItem key={item.name} item={item} />
        ))}
      </div>
    );

  return (
    <>
      <Header />
      {renderList()}
    </>
  );
};
