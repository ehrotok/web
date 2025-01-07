export const $envFetch = async <T>(url: string, opts?: any): Promise<T> => {
  const config = useRuntimeConfig();
  const isGetMethod = !opts?.method || opts.method == "GET";
  if (config.public.isDevelopment) {
    return isGetMethod ? fetchDev<T>(url) : Promise.resolve({} as T);
  }
  if (!isGetMethod) {
    opts.headers = { Authorization: `Bearer ${config.public.bearerToken}` };
  }

  return await $fetch<T>(url, { ...opts });
};

const fetchDev = async <T>(url: string): Promise<T> => {
  // @todo 今はめんどすぎるので一旦雑にモック作る
  if (url === "/v1/api/accounts") {
    return JSON.parse(`{
      "token": "9462a6de-c6ef-4411-bcd2-1e2881fbd529",
      "last_accessed_at": "2025-01-07T06:29:07.926Z",
      "bookmarks": [],
      "histories": []
    }`) as T;
  }

  const config = useRuntimeConfig();
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
  ) as T;
};
