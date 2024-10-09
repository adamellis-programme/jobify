import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi'
import Wrapper from '../assets/wrappers/PageBtnContainer'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { useAllJobsContext } from '../pages/AllJobs'

const PageBtnContainer = () => {
  const {
    data: { numOfPages, currentPage },
  } = useAllJobsContext()

  const { search, pathname } = useLocation()
  const navigate = useNavigate()
  // not a explicit return
  const pages = Array.from({ length: numOfPages }, (_, index) => index + 1)

  const handlePageChange = (pageNumber) => {
    console.log({ search, pathname })
    console.log(pageNumber)
    const searchParams = new URLSearchParams(search)
    // ... set the page in params
    searchParams.set('page', pageNumber)
    // ... construct the path
    navigate(`${pathname}?${searchParams.toString()}`)
  }

  // prev and next we will not see changes unless we change the url
  return (
    <Wrapper>
      <button
        className="btn prev-btn"
        onClick={() => {
          let prevPage = currentPage - 1
          if (prevPage < 1) prevPage = numOfPages // to the last page
          handlePageChange(prevPage)
        }}
      >
        <HiChevronDoubleLeft />
        prev
      </button>
      {/* if number from Array.from() matches the number sent back from the server */}
      <div className="btn-container">
        {pages.map((pageNumber) => (
          <button
            className={`btn page-btn ${pageNumber === currentPage && 'active'}`}
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
      </div>
      <button
        className="btn next-btn"
        onClick={() => {
          let nextPage = currentPage + 1
          if (nextPage > numOfPages) nextPage = 1
          handlePageChange(nextPage)
        }}
      >
        next
        <HiChevronDoubleRight />
      </button>
    </Wrapper>
  )
}

export default PageBtnContainer
