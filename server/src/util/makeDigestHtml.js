export function makeDigestHtml(posts) {
  return `
    <h2>Top 5 posts of the week</h2>
    <ol>
      ${posts
        .map(
          (p) => `
        <li>
          <strong>${p.title}</strong><br>
          ${p.content.slice(0, 150)}...<br>
          <em>Tags: ${p.tags.join(", ")}</em>
        </li>`,
        )
        .join("")}
    </ol>
    <p>See more on our website!</p>
  `;
}
