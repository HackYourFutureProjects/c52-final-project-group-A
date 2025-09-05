export function makeDigestHtml(posts) {
  return `
    <div style="background:#fafafa; border-radius:8px; padding:32px 24px; font-family:sans-serif; color:#222; max-width:520px; margin:auto;">
      <h2 style="color: #fe4a22; text-align:center; margin-bottom: 16px;">Top 5 posts of the week</h2>
      <ol style="padding-left:20px;">
        ${posts
          .map(
            (p) => `
          <li style="margin-bottom: 18px;">
            <strong style="font-size:1.1em;">${p.title}</strong><br>
            <span style="color:#444;">${p.content.slice(0, 150)}...</span><br>
            <em style="color:#fe4a22;">Tags: ${p.tags.join(", ")}</em>
          </li>`,
          )
          .join("")}
      </ol>
      <div style="text-align:center; margin:32px 0;">
        <a href="https://c52a.hyf.dev/" style="background:#fe4a22; color:white; padding:12px 28px; border-radius:5px; text-decoration:none; font-weight:bold; font-size:16px;">See more on our website</a>
      </div>
      <hr style="border:none; border-top:1px solid #eee; margin:24px 0;">
      <p style="color:#aaa; font-size:12px; text-align:center; margin:0;">This is an automated email, please do not reply.</p>
    </div>
  `;
}
