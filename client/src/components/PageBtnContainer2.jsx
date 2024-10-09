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

  const addPageButton = ({ pageNumber, activeClass }) => {
    return (
      <button
        className={`btn page-btn ${activeClass && 'active'}`}
        key={pageNumber}
        onClick={() => handlePageChange(pageNumber)}
      >
        {pageNumber}
      </button>
    )
  }
  // as it renders it removes the active class
  const renderPageButtons = () => {
    //... optinal to display the one before and after
    const pageButtons = []

    // add the first button
    pageButtons.push(addPageButton({ pageNumber: 1, activeClass: currentPage === 1 }))

    if (currentPage > 3) {
      pageButtons.push(
        <span className="page-btn dots" key="dots-1">
          ....
        </span>
      )
    }

    // if it is not equal to one the do not display the one before
    // one before current page
    if (currentPage !== 1 && currentPage !== 2) {
      pageButtons.push(addPageButton({ pageNumber: currentPage - 1, activeClass: false }))
    }

    // Add the current page button
    // ... if active is first or last we do not display the this one
    if (currentPage !== 1 && currentPage !== numOfPages) {
      pageButtons.push(addPageButton({ pageNumber: currentPage, activeClass: true }))
    }

    // one after current page
    // IT'S NOT THE LAST ONE OR THE PENULTUMATE ONE THEN SHOW
    // NOT displaying the one after the last page as we allready have the last page displayed
    if (currentPage !== numOfPages && currentPage !== numOfPages - 1) {
      pageButtons.push(addPageButton({ pageNumber: currentPage + 1, activeClass: false }))
    }

    // if the active is all the way up to the end of the array
    // we do not need to show the ... dots
    if (currentPage < numOfPages - 2) {
      pageButtons.push(
        <span className=" page-btn dots" key="dots+1">
          ....
        </span>
      )
    }
    // Add the last page button
    pageButtons.push(
      addPageButton({ pageNumber: numOfPages, activeClass: currentPage === numOfPages })
    )

    // console.log(pageButtons)

    return pageButtons
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
      <div className="btn-container">{renderPageButtons()}</div>
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
