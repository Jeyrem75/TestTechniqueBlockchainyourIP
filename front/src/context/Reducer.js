const Reducer = (state, action) => {
    switch(action.type) {
        case "LOGIN_START":
            return {
                user: null,
                isAdmin: false,
                isFetching: true,
                error: false,
            };
        case "LOGIN_SUCCESS":
            return {
                user: action.payload,
                isAdmin: action.payload.isAdmin,
                isFetching: false,
                error: false,
            };
        case "LOGIN_FAILURE":
            return {
                user: null,
                isAdmin: false,
                isFetching: false,
                error: true,
            };
        case "LOGOUT":
            return {
                user: null,
                isAdmin: false,
                isFetching: false,
                error: false,
            };
        case "REGISTER_START":
            return {
                user: null,
                isAdmin: false,
                isFetching: true,
                error: false,
            }
        case "REGISTER_SUCCESS":
            return {
                user: action.payload,
                isAdmin: false,
                isFetching: false,
                error: false,
            }
        case "REGISTER_FAILURE": 
            return {
                user: null,
                isAdmin: false,
                isFetching: false,
                error: true,
            }
        default:    
            return state;     
    }
};

export default Reducer;