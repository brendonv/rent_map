import fetch from 'isomorphic-fetch'
import * as types from '../constants/ActionTypes'
import { API } from '../constants/config'

/*
 * action creators
 */

export function toggleType(propertyType) {
    return {
        type: types.TOGGLE_PROPERTY_TYPE,
        propertyType
    }
}

export function selectRegion(region) {
    return {
        type: types.SELECT_REGION,
        region
    }
}

export function regionDataRequest(region) {
    return {
        type: types.REGION_DATA_REQUEST,
        region
    }
}

export function regionDataSuccess(region, json) {
    return {
        type: types.REGION_DATA_SUCCESS,
        region,
        data: json.data,
        receivedAt: Date.now()
    }
}

export function regionDataFailure(region, json) {
    return {
        type: types.REGION_DATA_FAILURE,
        region,
        receivedAt: Date.now()
    }
}


export function fetchRegionData(city, region) {
    return dispatch => {
        dispatch(regionDataRequest(region))
        return fetch(`${API}/api/data/${city.toLowerCase()}/${region.toLowerCase()}`)
            .then(response => response.json())
            .then(json =>
                // We can dispatch many times!
                // Here, we update the app state with the results of the API call.
                dispatch(regionDataSuccess(region, json))
            )
            // In a real world app, you also want to
            // catch any error in the network call.
    }
}

export function selectCity(city) {
    return {
        type: types.SELECT_CITY,
        city
    }
}

export function regionsRequest(city) {
    return {
        type: types.REGIONS_REQUEST,
        city
    }
}

export function regionsSuccess(city, json) {
    return {
        type: types.REGIONS_SUCCESS,
        city,
        data: json.data,
        receivedAt: Date.now()
    }
}

export function regionsFailure(city, json) {
    return {
        type: types.REGIONS_FAILURE,
        city,
        receivedAt: Date.now()
    }
}

export function fetchRegions(city) {
    return dispatch => {
        dispatch(regionsRequest(city))
        return fetch(`${API}/api/data/${city.toLowerCase()}/regions`)
            .then(response => response.json())
            .then(json =>
                dispatch(regionsSuccess(city, json))
            )
    }
}

function shouldFetchRegionData(state, region) {
  const data = state.dataByRegion[region]
  if (!data) {
    return true
  }
  if (data.isFetching) {
    return false
  }
  return data.didInvalidate
}

export function fetchRegionDataIfNeeded(city, region) {
  return (dispatch, getState) => {
    if (shouldFetchRegionData(getState(), region)) {
      return dispatch(fetchRegionData(city, region))
    }
  }
}