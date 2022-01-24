const AUTH_PLATFORM = {
  KAKAO: "kakao",
  NAVER: "naver",
  GOOGLE: "google",
};

const SOCKET_EVENT = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  ERROR: "error",
  JOIN_ROOM: "joinRoom",
  LEAVE_ROOM: "leaveRoom",
  ROOM: "room",
  LIST: "list",
  FILE: "file",
  CHAT: "chat",
  LOGIN: "login",
};

const ROUTE = {
  TRACK: {
    LIST: "/listinfo",
    TRACK: "/",
    TRACKPAGE: "/:trackId",
    PLAYLIST: "/playlist",
  },
  COMMON: {
    MAINPAGE: "/",
    MYPAGE: "/user/:userId",
    SEARCH: "/search",
  },
  CHAT: {
    CHAT: "/",
    LIST: "/list",
    NEW: "/new",
    TRACK: "/track",
    IMAGE: "/image",
  },
  AUTH: {
    KAKAO: "/kakao",
    KAKAO_CALLBACK: "/kakao/callback",
    GOOGLE: "/google",
    GOOGLE_CALLBACK: "/google/callback",
    NAVER: "/naver",
    NAVER_CALLBACK: "/naver/callback",
    PROFILE: "/profile",
    MY_INFO: "/me",
    USER_INFO: "/user/:userId",
  },
  COMMENT: {
    CREATE_COMMENT: "/:trackId/comment",
    COMMENT: "/:trackId/comment/:commentId",
  },
};

const IMAGE = {
  PROFILE: "profile.png",
  FIFTH: "OAO_5단계.png",
  FOURTH: "OAO_4단계.png",
  THIRD: "OAO_3단계.png",
  SECOND: "OAO_2단계.png",
  FIRST: "OAO_1단계.png",
};

const CLASS = {
  FIFTH: "탑스타 와오",
  FOURTH: "핫한 와오",
  THIRD: "라이징스타 와오",
  SECOND: "끼쟁이 와오",
  FIRST: "수줍은 와오",
};

const DIRECTORY = {
  CATEGORY_URL: "categoryUrl",
  CHAT_IMAGES: "chatImages",
  CHAT_TRACKS: "chatTracks",
  ETC: "etc",
  IMAGES: "images",
  TRACKS: "tracks",
  TRACK_THUMBNAIL: "trackThumbnail",
  UNTRACKS: "untracks",
  AUDIO: "audio",
  IPHONE: "iphone",
  IMAGE: "image",
};

const ETC = {
  PROFILE: "profile",
  UPLOAD_KEY: "profileImage",
  CATEGORY_ID: 1,
};

const SECURITY = {
  WINDOW_MS: 1 * 1000,
  MAX: 15,
  DELAY_MS: 0,
};

const MESSAGE = {
  REQ_LIMITER: "1초에 15번만 요청할 수 있습니다.",
  TOKEN: "토큰이 유효하지 않습니다.",
  NICK_USED: "사용중인 닉네임입니다",
  NICK_LENGTH: "닉네임은 4자이상 15자 이하여야 합니다.",
  NICK_VALIDATE: "닉네임에 특수문자를 포함할 수 없습니다.",
  EMAIL_VALIDATE: "이메일 형식이 올바르지 않습니다.",
  INTRODUCE: "자기 소개는 50자를 넘길 수 없습니다.",
  TRACK_UNDEFINED: "존재하지 않는 트랙입니다.",
  COMMENT_LENGTH: "댓글은 50자를 넘길 수 없습니다.",
  COMMENT_DELETE_FAIL: "존재하지 않는 댓글이거나 트랙에 포함되지 않거나 댓글쓴사람이 아닙니다",
  DEFAULT_ERROR: "Error!!",
};

module.exports = {
  AUTH_PLATFORM,
  SOCKET_EVENT,
  DIRECTORY,
  ROUTE,
  CLASS,
  IMAGE,
  SECURITY,
  MESSAGE,
  ETC,
};
