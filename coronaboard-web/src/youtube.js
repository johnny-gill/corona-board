const axios = require('axios');

// Date 객체를 넣었을때 n시간전, n분전 등으로 나타내 준다.
const TimeAgo = require('javascript-time-ago');
const ko = require('javascript-time-ago/locale/ko');
TimeAgo.addLocale(ko);
const timeAgoKorean = new TimeAgo('ko-KR');

// GCP API key
const apiKey = 'AIzaSyDdW25aRY-XptrDhNfMN6bijdawu6QiU8o';

/**
 * maxLength가 넘어가면 text를 잘라낸다.
 */
function truncateText(text, maxLength) {
  if (!text) {
    return '';
  }

  if (text.length > maxLength) {
    return text.substr(0, maxLength) + '...';
  } else {
    return text;
  }
}

//
function convertModel(item) {
  const { id, snippet, statistics } = item;
  return {
    videoUrl: `https://www.youtube.com/watch?v=${id}`,
    publishedAt: timeAgoKorean.format(Date.parse(snippet.publishedAt)),
    title: snippet.title,
    channelTitle: snippet.channelTitle,
    thumbnail: snippet.thumbnails ? snippet.thumbnails.medium.url : '',
    description: truncateText(snippet.description, 80),
    viewCount: parseInt(statistics.viewCount),
  };
}

/**
 * 검색어를 통한 영상 검색
 *
 * @param {string} keyword
 * @returns
 */
async function getYouTubeVideosByKeyword(keyword) {
  const searchResponse = await axios.get(
    'https://content.googleapis.com/youtube/v3/search',
    {
      params: {
        key: apiKey,
        q: keyword,
        type: 'video',
        part: 'id',
        maxResults: 3,
      },
    }
  );

  const ids = searchResponse.data.items.map((x) => x.id.videoId);

  // Video ID를 이용하여 비디오 정보(snippet), 통계(statistics) 조회
  const detailResponse = await axios.get(
    'https://content.googleapis.com/youtube/v3/videos',
    {
      params: {
        key: apiKey,
        id: ids.join(','),
        order: 'relevance',
        part: 'snippet, statistics',
      },
    }
  );

  return detailResponse.data.items.map(convertModel);
}

module.exports = {
  getYouTubeVideosByKeyword,
};

getYouTubeVideosByKeyword('장원영');
