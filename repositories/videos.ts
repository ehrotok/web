/**
 * https://ehrotok.up.railway.app/api/videos
 *
 * @params page ページ数
 */
export const fetchVideos = async (page: number): Promise<Videos> => {
  const config = useRuntimeConfig();
  if (config.public.isDevelopment) {
    const response = (await $fetch(
      `https://api.github.com/gists/${config.public.development.gistId}`,
      {
        headers: {
          Authorization: `token ${config.public.token}`,
        },
      }
    )) as any;

    return JSON.parse(
      response.files[config.public.development.fileName].content
    ) as Videos;
  }

  return await $fetch<Videos>("/v1/api/videos", {
    query: { page: page },
  });
};
