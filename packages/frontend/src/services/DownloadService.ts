import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { IDownload, IDownloadUpdateEvent } from "../models/IDownload";

export const downloadAPI = createApi({
  reducerPath: "downloadAPI",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Download"],
  endpoints: (build) => ({
    fetchDownloads: build.query<IDownload[], unknown>({
      query: () => ({
        url: "/list",
      }),
      providesTags: () => ["Download"],
      async onCacheEntryAdded(
        _arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const source = new EventSource("/api/sse", {
          withCredentials: true,
        });

        try {
          await cacheDataLoaded;

          const listener = (event: MessageEvent<string>) => {
            const data = JSON.parse(event.data) as IDownloadUpdateEvent;

            updateCachedData((draft) => {
              const foundDownloadIndex = draft.findIndex(
                (el) => el.name === data.name
              );

              if (foundDownloadIndex > -1) {
                draft[foundDownloadIndex].progress = data.progress;

                if (data.progress === 1) {
                  draft[foundDownloadIndex].status = "ready";
                }
              }
            });
          };

          source.addEventListener("message", listener);
        } catch {
          /**
           */
        }

        await cacheEntryRemoved;

        source.close();
      },
    }),

    createDownload: build.mutation<unknown, FormData>({
      query: (body) => ({
        url: "/upload",
        method: "POST",
        body,
      }),
      invalidatesTags: (_, error) => (error ? [] : ["Download"]),
    }),

    deleteDownload: build.mutation<unknown, string>({
      query: (name) => ({
        url: `/delete/${name}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, error) => (error ? [] : ["Download"]),
    }),
  }),
});
