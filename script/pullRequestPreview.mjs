import { execSync } from "child_process";

console.log("[DEPLOY_PREVIEW]: START");
const command = "npm run deploy:staging";
const output = execSync(command, { encoding: "utf-8" });
const outputLines = output.split("\n");
const DEPLOY_URL = outputLines[outputLines.length - 1];
console.log("[DEPLOY_PREVIEW]: END");

console.log(`You can see the deploy preview on: ${DEPLOY_URL}`);

console.log("[GITHUB_COMMENT]: START");
const GH_COMMENT = `
- Deploy URL: [${DEPLOY_URL}](${DEPLOY_URL})
`;

const { GITHUB_TOKEN, GITHUB_REPOSITORY, GITHUB_PR_NUMBER, KEY_POST } =
  process.env;

const defaultHeaders = {};
defaultHeaders["Accept"] = "application/vnd.github+json";
defaultHeaders["Authorization"] = `token ${KEY_POST}`;
defaultHeaders["X-GitHub-Api-Version"] = "2022-11-28";

console.log("GITHUB_REPOSITORY", GITHUB_REPOSITORY);
console.log("GITHUB_PR_NUMBER", GITHUB_PR_NUMBER);

fetch(
  `https://api.github.com/repos/${GITHUB_REPOSITORY}/issues/${GITHUB_PR_NUMBER}/comments`,
  {
    headers: defaultHeaders,
    method: "POST",
    body: JSON.stringify({ body: GH_COMMENT }),
  },
)
  .then((response) => {
    if (response.ok) return response.json();
    throw new Error(response.statusText);
  })
  .then((response) => console.log(response))
  .catch((err) => {
    console.log("[COMMENT_ON_GITHUB: ERROR]");
    throw new Error(err);
  })
  .finally(() => {
    console.log("[COMMENT_ON_GITHUB: END]");
  });
