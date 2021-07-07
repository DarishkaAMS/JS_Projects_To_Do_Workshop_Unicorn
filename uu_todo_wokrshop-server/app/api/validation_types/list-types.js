/* eslint-disable */

const listCreateDtoInType = shape({
  name: string(1, 30).isRequired()
})

const listGetDtoInType = shape({
  id: id().isRequired()
})

const listListDtoInType = shape({
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer()
  })
})

const listUpdateDtoInType = shape({
  id: id().isRequired(),
  name: string(1,30)
})
