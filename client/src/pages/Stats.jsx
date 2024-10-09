import { ChartsContainer, StatsContainer } from '../components'
import customFetch from '../utils/customFetch'
import { useLoaderData } from 'react-router-dom'

export const loader = async () => {
  try {
    const response = await customFetch.get('/jobs/stats')
    return response.data
  } catch (error) {
    return error
  }

  return null
}

const Stats = () => {
  const { defaultStats, monthlyApplications } = useLoaderData()
  return (
    <>
      <StatsContainer defaultStats={defaultStats} />
      {/* only show chart if length */}
      {monthlyApplications?.length > 0 && <ChartsContainer data={monthlyApplications} />}
    </>
  )
}

export default Stats
