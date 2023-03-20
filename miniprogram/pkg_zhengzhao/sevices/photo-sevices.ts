

export interface PhotoSize {
  name: string;
  px: string;
  size: string;
  width: number;
  height: number;
  description: string;
}


export const getPhotoSizeList = async (): Promise<Array<PhotoSize>> => {

  return [{
    name: '一寸',
    px: '295×413 px',
    size: '25 × 35 mm',
    width: 295,
    height: 413,
    description: '教师资格证、简历、会计职称考试、健康证等。'
  },
  {
    name: '小一寸',
    px: '260×378 px',
    size: '22 × 32 mm',
    width: 260,
    height: 378,
    description: '驾驶证、驾照、英语AB级等。'
  },
  {
    name: '大一寸',
    px: '390×567 px',
    size: '33 × 48 mm',
    width: 390,
    height: 567,
    description: '计算机等级、中国护照、英语四六级考试等。'
  },
  {
    name: '二寸',
    px: '413×579 px',
    size: '35 × 49 mm',
    width: 413,
    height: 579,
    description: '养老护理员、医疗、职业药师资格证等。'
  },
  {
    name: '小二寸',
    px: '413×531 px',
    size: '33 × 45 mm',
    width: 413,
    height: 531,
    description: '国考、国家公务员、护士资格证考试、主管护师等。'
  },
  {
    name: '大二寸',
    px: '413×626 px',
    size: '35 × 53 mm',
    width: 413,
    height: 626,
    description: ''
  },
  {
    name: '结婚证',
    px: '626x413 px',
    size: '53 × 35 mm',
    width: 626,
    height: 413,
    description: '结婚证大二寸双人证件照。'
  },
  {
    name: '一寸半身照',
    px: '295×413 px',
    size: '25 × 35 mm',
    width: 295,
    height: 413,
    description: ''
  },
  {
    name: '二寸半身照',
    px: '413×579 px',
    size: '35 × 49 mm',
    width: 413,
    height: 579,
    description: ''
  },
  {
    name: '教师资格证',
    px: '295×413 px',
    size: '25 × 35 mm',
    width: 295,
    height: 413,
    description: '教师资格证'
  },
  {
    name: '三寸',
    px: '649×991 px',
    size: '55 × 84 mm',
    width: 413,
    height: 626,
    description: ''
  },
  {
    name: '四寸',
    px: '898×1205 px',
    size: '76 × 102 mm',
    width: 413,
    height: 626,
    description: ''
  },
  {
    name: '五寸',
    px: '1050×1499 px',
    size: '89 × 127 mm',
    width: 413,
    height: 626,
    description: ''
  },
  {
    name: '简历',
    px: '295×413 px',
    size: '25 × 35 mm',
    width: 295,
    height: 413,
    description: '简历'
  },
  {
    name: '健康证',
    px: '295×413 px',
    size: '25 × 35 mm',
    width: 295,
    height: 413,
    description: '健康证'
  },];
}