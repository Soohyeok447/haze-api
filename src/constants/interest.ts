export const INTEREST_LIST = [
  '게임',
  '캠핑',
  '헬스장',
  '노래방',
  '여행',
  '카페',
  '호캉스',
  '독서',
  '사진',
  '만화',
  '영화',
  '애니메이션',
  'PC방',
  '치맥',
  '한강',
  '와인',
  '카공',
  '맛집 탐방',
  '주식/투자',
  '독서',
  '음악 감상',
  '드라이브',
  '자기계발',
  '요리',
  '드로잉',
  '악기연주',
  '위스키',
] as const;

/**
 * @swagger
 * components:
 *   schemas:
 *     Interest:
 *       type: string
 *       enum:
 *         - '게임'
 *         - '캠핑'
 *         - '헬스장'
 *         - '노래방'
 *         - '여행'
 *         - '카페'
 *         - '호캉스'
 *         - '독서'
 *         - '사진'
 *         - '만화'
 *         - '영화'
 *         - '애니메이션'
 *         - 'PC방'
 *         - '치맥'
 *         - '한강'
 *         - '와인'
 *         - '카공'
 *         - '맛집 탐방'
 *         - '주식/투자'
 *         - '독서'
 *         - '음악 감상'
 *         - '드라이브'
 *         - '자기계발'
 *         - '요리'
 *         - '드로잉'
 *         - '악기연주'
 *         - '위스키'
 *       description: 관심사.
 *       example: '여행'
 */
export type Interest = (typeof INTEREST_LIST)[number];
