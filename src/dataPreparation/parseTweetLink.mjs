export const parseTweetLink = (text) => {
  const match =
    /\bhttps?:\/\/(?:www\.|mobile\.)?(?:twitter|x)\.com\/(i\/web|[\w]+)\/status\/(\d+)\b/i.exec(
      text
    );
  if (!match) return null;

  const [, author, id] = match;
  return {
    url: `https://x.com/${author}/status/${id}`,
    username: author.includes("/") ? null : author,
  };
};
