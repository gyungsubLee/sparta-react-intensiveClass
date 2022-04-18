import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";

import { storage } from "../../shared/firebase";

//actions
const UPLOADING = "UPDATING";
const UPLOAD_IMAGE = "UPDATE_IMGAE";

//action creators
const uploading = createAction(UPLOADING, (uploading) => ({ uploading }));
const uploadImage = createAction(UPLOAD_IMAGE, (image_url)=> ({ image_url }));

//initialize
const initialState = {
    image_url: '',
    uploading: false,
}

//middlewares
const uploadImageFB= (image) => {
    return function (dispatch, getState, {history}){
        
        dispatch(uploading(true));
        const _upload = storage.ref(`images/${image.name}`).put(image);

        _upload.then((snapshot) => {
            console.log(snapshot);
            dispatch(uploading(false));
            snapshot.ref.getDownloadURL().then((url) => {
                console.log(url)
            });
        });
    }
}


//reducer
export default handleActions(
    {
        [UPLOAD_IMAGE]: (state, action) => produce(state, (draft) =>{
            draft.image_url = action.payload.image_url;
        }),
        [UPLOADING]: (state, action) => produce(state, (draft) =>{
            draft.uploading = action.payload.uploading;
        }),
    },
    initialState
);

const actionCreators = {
    uploadImage,
}

export {actionCreators};