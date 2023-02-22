import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import ProjectCard from '../ProjectCard'

import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProjectShowCase extends Component {
  state = {
    projectList: [],
    activeCategoryId: categoriesList[0].id,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProjectList()
  }

  getProjectList = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const {activeCategoryId} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${activeCategoryId}`

    const options = {
      method: 'GET',
    }

    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()

      const updatedData = data.projects.map(eachProject => ({
        id: eachProject.id,
        imageUrl: eachProject.image_url,
        name: eachProject.name,
      }))

      this.setState({
        projectList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  handleCategoryId = event => {
    this.setState(
      {
        activeCategoryId: event.target.value,
      },
      this.getProjectList,
    )
  }

  handleRetryButton = () => {
    this.getProjectList()
  }

  renderProjectList = () => {
    const {projectList} = this.state

    return (
      <ul className="project-list">
        {projectList.map(eachProject => (
          <ProjectCard key={eachProject.id} projectDetails={eachProject} />
        ))}
      </ul>
    )
  }

  renderLoaderView = () => (
    <div className="loader" data-testid="loader">
      <Loader type="ThreeDots" color="#328af2" height={45} width={45} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-info">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        onClick={this.handleRetryButton}
        className="retry-btn"
      >
        Retry
      </button>
    </div>
  )

  renderStatusView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProjectList()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    const {activeCategoryId} = this.state
    return (
      <div>
        <Header />
        <div className="main-container">
          <select
            value={activeCategoryId}
            onChange={this.handleCategoryId}
            className="select"
          >
            {categoriesList.map(eachCategory => (
              <option
                key={eachCategory.id}
                value={eachCategory.id}
                className="option"
              >
                {eachCategory.displayText}
              </option>
            ))}
          </select>
          {this.renderStatusView()}
        </div>
      </div>
    )
  }
}

export default ProjectShowCase
