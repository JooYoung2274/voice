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

const SOCKET_CORS = {
  origin: "*",
  methods: ["GET", "POST"],
};

const CORS = {
  origin: "https://oao-voice.com",
  credentials: true,
};

const ROUTE = {
  INDEX: {
    TRACKS: "/tracks",
    COMMON: "/common",
    AUTH: "/auth",
    LIST: "/listinfo",
    SEARCH: "/search",
    PLAYLIST: "/playlist",
    CHAT: "/chat",
  },
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
  LIKE: "/:trackId/like",
  LIST: "/",
  PLAYLIST: "/",
  SEARCH: "/",
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
  CATEGORYALL: "전체",
  CATEGORYALLTEXT: "최근에 올라온 목소리",
  CHAT_TYPE: "text",
  TIMEOUT: "10s",
};

const NUMBER = {
  CATEGORYALLID: 1,
  TRACKNUM: 19,
};

const ETC = {
  PROFILE: "profile",
  UPLOAD_KEY: "profileImage",
};

const SECURITY = {
  WINDOW_MS: 1 * 1000,
  MAX: 15,
  DELAY_MS: 0,
};

const IMAGE_TYPE = ["jpg", "png", "jpeg", "gif"];

const AUDIO_TYPE = ["mp4", "mp3", "flac", "wav", "ogg", "mpeg", "x-m4a", "webm"];

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
  WRONG_REQ: "잘못된 요청입니다",
  NOT_CHATROOM: "삭제된 채팅방입니다",
  NOT_USER: "가입하지 않은 사용자입니다.",
  NOT_TAG: "적어도 하나의 태그는 선택해야 합니다.",
  WRONG_CATEGORY: "현재 운영하고 있는 카테고리가 아닙니다.",
  TITLE_VALIDATE: "제목은 존재해야하고 20자를 넘길 수 없습니다.",
  NOT_TRACK: "존재하지 않는 트랙입니다.",
  NOT_MYPAGE: "존재하지 않는 포트폴리오 페이지 입니다",
  NOT_TYPE: "정해진 확장자 파일만 업로드 가능합니다.",
  NOT_DELETE: "삭제할 수 없는 파일입니다",
  NOT_CONNECT_SOCKET_IO: "socket.io is not initalized",
};

module.exports = {
  AUTH_PLATFORM,
  SOCKET_CORS,
  SOCKET_EVENT,
  DIRECTORY,
  ROUTE,
  CLASS,
  IMAGE,
  SECURITY,
  MESSAGE,
  NUMBER,
  IMAGE_TYPE,
  AUDIO_TYPE,
  CORS,
  ETC,
};
