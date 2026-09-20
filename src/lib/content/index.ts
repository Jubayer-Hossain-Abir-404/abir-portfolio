/**
 * Public entry point for content. Components and loaders import from here and
 * never reach into `src/data` directly — a rule the linter enforces.
 *
 * Re-exports are listed explicitly rather than star-exported. This is the
 * contract that has to survive the move to an API, so it is worth being able to
 * read it in one place; a `export *` also leaves editors resolving the surface
 * indirectly, which is how a perfectly valid import ends up underlined in red.
 */
export {
  getAdjacentSystems,
  getEngineering,
  getExperience,
  getFeaturedSystems,
  getNoteBySlug,
  getNotes,
  getNoteSlugs,
  getPageCopy,
  getProfile,
  getProjects,
  getResearch,
  getSections,
  getSocial,
  getSystemBySlug,
  getSystems,
  getSystemSlugs,
} from './repository'
