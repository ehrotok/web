const useSeo =
  /**
   * 動的にheadタグを変更できるコンポーザブル
   *
   * @param title
   * @param description
   * @param imagePath
   * @param type
   * @param twitterCard
   * @returns
   */
  (
    title: string = "EhroTok - 大人のためのショート動画プラットフォーム",
    description: string = "EhroTokは、大人向けの特別なショート動画を楽しむためのプラットフォームです。手軽に楽しめる短い動画で、あなたの日常に新しい刺激をお届けします。",
    imagePath: string = Constants.IMAGES.LOGO_WITH_TEXT,
    type: string = "website",
    twitterCard: string = "summary"
  ) => {
    const url = "https://ehrotok.netlify.app";
    const image = `${url}/${imagePath}`;

    return {
      title: title,
      meta: [
        {
          hid: "description",
          name: "description",
          content: description,
        },
        {
          hid: "keywords",
          name: "keywords",
          content:
            "EhroTok, ショート動画, 大人向け動画, エンターテインメント, 短い動画, 動画プラットフォーム, 高品質動画, プライベート動画, 大人専用, 短時間エンタメ, ショートムービー, 動画共有サービス, スマホ動画, オンライン動画, ユーザー投稿動画, 短編動画",
        },
        {
          hid: "og:title",
          property: "og:title",
          content: title,
        },
        {
          hid: "og:type",
          property: "og:type",
          content: type,
        },
        {
          hid: "og:url",
          property: "og:url",
          content: url,
        },
        {
          hid: "og:image",
          property: "og:image",
          content: image,
        },
        {
          hid: "og:site_name",
          property: "og:site_name",
          content: title,
        },
        {
          hid: "og:description",
          property: "og:description",
          content: description,
        },
        {
          hid: "twitter:title",
          name: "twitter:title",
          content: title,
        },
        {
          hid: "twitter:description",
          name: "twitter:description",
          content: description,
        },
        {
          hid: "twitter:image",
          name: "twitter:image",
          content: image,
        },
        {
          hid: "twitter:card",
          name: "twitter:card",
          content: twitterCard,
        },
        {
          hid: "twitter:url",
          name: "twitter:url",
          content: url,
        },
        {
          hid: "robots",
          name: "robots",
          content: "noarchive",
        },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    };
  };

export { useSeo };