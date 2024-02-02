export const makePagination = (pageNumber = 0, itemsPerPage = 10) => {
  const take = itemsPerPage || 10
  const page = pageNumber && pageNumber > 0 ? pageNumber - 1 : 0
  const skip = take * page
  return { take, skip }
}
