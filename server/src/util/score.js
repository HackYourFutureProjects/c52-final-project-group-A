//score functions
export function calculateUserScore(likesCount, followersCount) {
  return likesCount + followersCount * 0.5;
}

export function calculatePostScore(likeCount, tags, tagFrequencyMap) {
  const tagScore = tags.reduce(
    (sum, tag) => sum + (tagFrequencyMap[tag] || 0),
    0,
  );
  return likeCount + tagScore;
}
