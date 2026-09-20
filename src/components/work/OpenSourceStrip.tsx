import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/motion/Reveal'
import { externalLinkProps } from '@/lib/routes'
import type { Project } from '@/types'
import { StackLine } from './StackLine'

type OpenSourceStripProps = {
  projects: Project[]
}

/**
 * Deliberately subordinate to the case studies above it: a compact row, no
 * case-study links, no numerals. These repos are here because a reviewer can
 * read the source, not because they carry the same weight as the systems.
 */
export function OpenSourceStrip({ projects }: OpenSourceStripProps) {
  return (
    <Reveal as="section" aria-labelledby="also-public" className="border-t border-rule pt-8">
      <h3 id="also-public" className="meta text-muted">
        Also public
      </h3>

      <ul className="mt-6 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <li key={project.repo}>
            <a
              href={project.repo}
              {...externalLinkProps(project.repo)}
              className="group flex items-baseline gap-1.5"
            >
              <span className="font-medium tracking-tight transition-colors group-hover:text-accent">
                {project.name}
              </span>
              <ArrowUpRight
                aria-hidden
                className="size-3 shrink-0 text-muted transition-colors group-hover:text-accent"
              />
            </a>

            <StackLine items={project.stack} className="mt-2 text-muted" />
            <p className="mt-3 max-w-sm text-sm text-pretty text-muted">{project.relevance}</p>
          </li>
        ))}
      </ul>
    </Reveal>
  )
}
