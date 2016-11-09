import { combineReducers } from 'redux'
import * as types from '../constants/ActionTypes'

const initialState = {
    propertyType: types.PropertyTypes.ALL,
    region: 'ALL',
    city: 'PORTLAND'
}

function selectedRegion(state = 'ALL', action) {
    switch (action.type) {
        case types.SELECT_REGION: 
            return action.region
        default:
            return state
    }
}

function selectedCity(state = 'PORTLAND', action) {
    switch (action.type) {
        case types.SELECT_CITY: 
            return action.region
        default:
            return state
    }
}

function regionData(state = {
        isFetching: false,
        data: []
                }, action) {
    switch (action.type) {
        case types.REGION_DATA_REQUEST:
            return Object.assign({}, state, {
                isFetching: true
            })
        case types.REGION_DATA_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                data: action.data,
                lastUpdated: action.receivedAt
            })
        case types.REGION_DATA_FAILURE:
            return Object.assign({}, state, {
                isFetching: false
            })
        default:
            return state
    }
}

function dataByRegion(state = {}, action) {
  switch (action.type) {
    case types.REGION_DATA_REQUEST:
    case types.REGION_DATA_SUCCESS:
    case types.REGION_DATA_FAILURE:
      return Object.assign({}, state, {
        [action.region]: regionData(state[action.region], action)
      })
    default:
      return state
  }
}

function regions(state = {
        isFetching: false,
        data: []
                }, action) {
    switch (action.type) {
        case types.REGIONS_REQUEST:
            return Object.assign({}, state, {
                isFetching: true
            })
        case types.REGIONS_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                data: action.data,
                lastUpdated: action.receivedAt
            })
        case types.REGIONS_FAILURE:
            return Object.assign({}, state, {
                isFetching: false
            })
        default:
            return state
    }
}

function regionsByCity(state = {}, action) {
  switch (action.type) {
    case types.REGIONS_REQUEST:
    case types.REGIONS_SUCCESS:
    case types.REGIONS_FAILURE:
      return Object.assign({}, state, {
        [action.city]: regions(state[action.city], action)
      })
    default:
      return state
  }
}

function togglePropertyType(state = {}, action) {
    switch (action.type) {
        case types.TOGGLE_PROPERTY_TYPE:
            return Object.assign({}, state, {
                propertyType: action.propertyType
            })
        default:
            return state
    }
}

const rootReducer = combineReducers({
    selectedRegion,
    selectedCity,
    dataByRegion,
    regionsByCity,
    togglePropertyType
})

export default rootReducer
