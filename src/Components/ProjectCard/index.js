import './index.css'

const ProjectCard = props => {
  const {projectDetails} = props
  const {name, imageUrl} = projectDetails

  return (
    <li className="list-item">
      <img src={imageUrl} alt={name} className="project-image" />
      <p className="name">{name}</p>
    </li>
  )
}

export default ProjectCard
