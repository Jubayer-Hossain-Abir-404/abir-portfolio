import { SectionHeader } from '@/components/layout/SectionHeader'
import { sectionHeadingId } from '@/lib/routes'
import { OpenSourceStrip } from '@/components/work/OpenSourceStrip'
import { SystemBlock } from '@/components/work/SystemBlock'
import type { Project, SectionCopy, System } from '@/types'

type SelectedSystemsProps = {
  index: number
  section: SectionCopy
  systems: System[]
  projects: Project[]
}

export function SelectedSystems({ index, section, systems, projects }: SelectedSystemsProps) {
  return (
    <section
      id={section.id}
      aria-labelledby={sectionHeadingId(section.id)}
      className="scroll-mt-20 pt-section"
    >
      <SectionHeader
        headingId={sectionHeadingId(section.id)}
        index={index}
        label={section.label}
        title={section.title}
        lede={section.lede}
      />

      <div className="mt-12">
        {systems.map((system, position) => (
          <SystemBlock key={system.slug} system={system} position={position} />
        ))}
      </div>

      <OpenSourceStrip projects={projects} />
    </section>
  )
}
