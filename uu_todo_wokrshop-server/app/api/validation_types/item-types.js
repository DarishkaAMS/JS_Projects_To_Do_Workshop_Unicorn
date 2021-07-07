/* eslint-disable */

const itemCreateDtoInType = shape({
  listId: id().isRequired(),
  text: string(1,1000).isRequired()
})

const itemGetDtoInType = shape({
  id: id().isRequired()
})

const itemListDtoInType = shape({
  listId: id(),
  completed: boolean(),
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer()
  })
})

const itemUpdateDtoInType = shape({
  id: id().isRequired(),
  listId: id(),
  text: string(1,1000)
})

const itemCompleteDtoInType = shape({
  id: id().isRequired(),
  completed: boolean()
})

const itemDeleteDtoInType = shape({
  id: id().isRequired()
})
