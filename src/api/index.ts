import axiosInstance from '../utils/axios'

class ProjectAPI {

  // for example
  static getList() {
    return axiosInstance.get("/list")
  }
}

export default ProjectAPI