import { createCtx } from "../utils/helper";

const SHOW_SINGLE = 'SHOW_SINGLE'

const [useHiddenInfo, HiddenInfoProvider] = createCtx('<HiddenInfo />', 'HiddenInfo')

const hiddenInfoReducer = (state, action) => {
  switch (action.type) {
    case SHOW_SINGLE:
      return state.map()
    default:
      break;
  }
}