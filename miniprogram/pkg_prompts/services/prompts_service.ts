
export interface PromptEntity {
  prompts: Array<string>,
  aiType: string,
  args: string,
}

export const getRecommendList = async (): Promise<Array<PromptEntity>> => {

  return []
};