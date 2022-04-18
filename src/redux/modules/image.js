import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";

import { storage } from "../../shared/firebase";

//actions
const UPLOADING = "UPLOADING";
const UPLOAD_IMAGE = "UPLOAD_IMAGE";
const SET_PREVIEW = "SET_PREVIEW";

//action creators
const uploading = createAction(UPLOADING, (uploading) => ({ uploading }));
const uploadImage = createAction(UPLOAD_IMAGE, (image_url)=> ({ image_url }));
const setPreview = createAction(SET_PREVIEW, (preview) => ({ preview }));

//initialize
const initialState = {
    image_url: '',
    uploading: false,
    preview: null,
};

//middlewares
const uploadImageFB= (image) => {
    return function (dispatch, getState, {history}){
        //uploading: true 변경
        dispatch(uploading(true));
        const _upload = storage.ref(`images/${image.name}`).put(image);

        _upload.then((snapshot) => {
            // console.log(snapshot);
            
            // 업로드한 파일의 다운로드 경로를 가져오자!
            snapshot.ref.getDownloadURL().then((url) => {
                // console.log(url);
                dispatch(uploadImage(url));
            });
        }).catch(err => {
            dispatch(uploading(false));
        }); 
    };
};


//reducer
export default handleActions(
    {
        [UPLOAD_IMAGE]: (state, action) => produce(state, (draft) =>{
            //action: 액션함수를 통해서 받아온 state 값
            draft.image_url = action.payload.image_url;
            draft.uploading = false;
        }),
        [UPLOADING]: (state, action) => produce(state, (draft) =>{
            draft.uploading = action.payload.uploading;
        }),
        [SET_PREVIEW]: (state, action) => produce(state, (draft) => {
            draft.preview = action.payload.preview;
        }),
    },
    initialState
);

const actionCreators = {
    uploadImage,
    uploadImageFB,
    setPreview,
}

export {actionCreators};