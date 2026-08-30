export function repoSlug(githubUrl) {
  const m = githubUrl.match(/github\.com\/([^/]+)\/([^/#?]+)/)
  return m ? `${m[1]}/${m[2]}` : null
}
