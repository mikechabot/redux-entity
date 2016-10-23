# redux-entity
A redux reducer (model), and a thunk action creator (loadEntity).

## Model reducer
Store data on state.model associated to a key of your choice!
Each entity is automatically wrapped with the properties below:

| `data`   | The result of the promise, if successful |
| `error`   | The result of the promise, if rejected |
| `lastUpdated`   |The date/time that the entity was last modified |
| `isFetching`   |  Whether or not the data promise is pending |
 

