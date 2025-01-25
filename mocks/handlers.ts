import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get(Constants.API_URLS.VIDEOS, () => {
    return HttpResponse.json({
      status: 200,
      page: 1,
      pages: 4,
      count: 72,
      result: [
        {
          actress_name: '漫才コンビ: ダブルインパクト',
          url: 'https://cc3001.dmm.co.jp/litevideo/freepv/n/n_6/n_666ssbx2668/n_666ssbx2668_mhb_w.mp4',
          title: '二人の息ぴったりの掛け合いが特徴。爆笑必至のネタが満載です！',
          review_count: 25,
          review_average: 4.61,
          product_url: 'https://ol-car.com/',
          image_url:
            'https://i.ytimg.com/vi/a1WPK3aUbJg/hqdefault.jpg?sqp=-oaymwExCOADEI4CSFryq4qpAyMIARUAAIhCGAHwAQH4Af4JgALQBYoCDAgAEAEYciBeKEUwDw==&rs=AOn4CLC14ek7rjQZKfVzdz12CdIqNZ84wQ',
        },
        {
          actress_name: 'トリオ芸: 三つ巴ブラザーズ',
          url: 'https://cc3001.dmm.co.jp/litevideo/freepv/5/523/5234ctl00011/5234ctl00011_dmb_w.mp4',
          title: '個性的な三人組が繰り出す予測不能な展開が魅力のトリオコント！',
          review_count: 25,
          review_average: 4.61,
          product_url: 'https://ol-car.com/',
          image_url:
            'https://i.ytimg.com/vi/a1WPK3aUbJg/hqdefault.jpg?sqp=-oaymwExCOADEI4CSFryq4qpAyMIARUAAIhCGAHwAQH4Af4JgALQBYoCDAgAEAEYciBeKEUwDw==&rs=AOn4CLC14ek7rjQZKfVzdz12CdIqNZ84wQ',
        },
        {
          actress_name: 'ピン芸人: 笑いのランナー',
          url: 'https://cc3001.dmm.co.jp/litevideo/freepv/n/n_6/n_666ansb55213/n_666ansb55213_dmb_w.mp4',
          title: '独特の視点から日常を切り取るピン芸人の渾身の漫談をお楽しみください！',
          review_count: 25,
          review_average: 4.61,
          product_url: 'https://ol-car.com/',
          image_url:
            'https://i.ytimg.com/vi/a1WPK3aUbJg/hqdefault.jpg?sqp=-oaymwExCOADEI4CSFryq4qpAyMIARUAAIhCGAHwAQH4Af4JgALQBYoCDAgAEAEYciBeKEUwDw==&rs=AOn4CLC14ek7rjQZKfVzdz12CdIqNZ84wQ',
        },
        {
          actress_name: 'コント師: クレイジーサーカス',
          url: 'https://cc3001.dmm.co.jp/litevideo/freepv/n/n_9/n_976zepe75/n_976zepe75mhb.mp4',
          title: '驚きと笑いが交差する奇想天外なコントが観客を魅了します！',
          review_count: 25,
          review_average: 4.61,
          product_url: 'https://ol-car.com/',
          image_url:
            'https://i.ytimg.com/vi/a1WPK3aUbJg/hqdefault.jpg?sqp=-oaymwExCOADEI4CSFryq4qpAyMIARUAAIhCGAHwAQH4Af4JgALQBYoCDAgAEAEYciBeKEUwDw==&rs=AOn4CLC14ek7rjQZKfVzdz12CdIqNZ84wQ',
        },
      ],
    })
  }),
]
