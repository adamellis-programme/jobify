import { toast } from 'react-toastify'
import { JobsContainer, SearchContainer } from '../components'
import customFetch from '../utils/customFetch'
import { useLoaderData } from 'react-router-dom'
import { useContext, createContext } from 'react'

export const loader = async ({ request }) => {
  console.log(request.url)
  // const url = [...new URL(request.url).searchParams.entries()]
  // console.log(Object.fromEntries([...new URL(request.url).searchParams.entries()]))
  // console.log(Object.fromEntries([...new URL(request.url).searchParams]))
  // console.log([new URL(request.url).searchParams])
  // new URL(request.url).searchParams.forEach((i) => console.log(i))
  // const url = new URL(request.url).searchParams.entries()
  // url.forEach((i) => console.log(i))
  // what is an itterator
  // for (const param of url) { console.log(param) // Logs each key-value pair}
  // How to Work with the Iterator:
  // To see what's inside the iterator, you need to consume it by converting it into a more standard structure, such as an array or by looping over it.
  const params = Object.fromEntries([...new URL(request.url).searchParams.entries()])

  try {
    // as axios we can direcly pass the params obj
    const { data } = await customFetch.get('/jobs', {
      // send the query params
      params,
    })
    // console.log(data)
    return {
      data,
      searchValues: { ...params },
    }
  } catch (error) {
    toast.error(error?.response?.data?.msg)
    return error
  }
}

const AllJobsContext = createContext()

const AllJobs = () => {
  // get data from the loader and then pass it down
  const { data, searchValues } = useLoaderData()
  // console.log(data)

  return (
    <AllJobsContext.Provider value={{ data, searchValues }}>
      <SearchContainer />
      <JobsContainer />
    </AllJobsContext.Provider>
  )
}

// imported into ... jobs container and search container
export const useAllJobsContext = () => useContext(AllJobsContext)
export default AllJobs
