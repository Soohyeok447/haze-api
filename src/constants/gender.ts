export const GENDER_LIST = ['MALE', 'FEMALE', 'ALL'] as const;

/**
 * @swagger
 * components:
 *   schemas:
 *     Gender:
 *       type: string
 *       enum:
 *         - MALE
 *         - FEMALE
 *         - ALL
 *       description: 성별을 나타내는 열거형.
 *       example: MALE
 */
export type Gender = (typeof GENDER_LIST)[number];
